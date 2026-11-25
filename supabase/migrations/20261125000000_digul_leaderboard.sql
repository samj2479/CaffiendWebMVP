BEGIN;

CREATE SCHEMA IF NOT EXISTS digul_private;
REVOKE ALL ON SCHEMA digul_private FROM PUBLIC, anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS digul_private.leaderboard (
  nickname text COLLATE "C" PRIMARY KEY CHECK (nickname ~ '^[가-힣A-Za-z0-9]{2,10}$'),
  score integer NOT NULL CHECK (score > 0),
  reached_order bigint NOT NULL UNIQUE,
  achieved_at timestamptz NOT NULL,
  play_time_ms bigint CHECK (play_time_ms BETWEEN 0 AND 9007199254740991)
);
ALTER TABLE digul_private.leaderboard ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE digul_private.leaderboard FROM PUBLIC, anon, authenticated, service_role;

-- Provision the digest separately. Reapplying the migration preserves the token.
CREATE TABLE IF NOT EXISTS digul_private.server_auth (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  token_hash bytea NOT NULL CHECK (octet_length(token_hash) = 32)
);
ALTER TABLE digul_private.server_auth ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE digul_private.server_auth FROM PUBLIC, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION digul_private.require_game_server()
RETURNS void
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $function$
DECLARE
  db_role text := current_setting('role', true);
  token text;
BEGIN
  -- PostgREST switches database roles after verifying credentials.
  IF db_role = 'service_role' THEN
    RETURN;
  END IF;
  IF db_role = 'anon' THEN
    token := nullif(current_setting('request.headers', true), '')::jsonb ->> 'x-digul-server-token';
    IF length(token) BETWEEN 32 AND 256 AND EXISTS (
      SELECT 1 FROM digul_private.server_auth AS cfg
      WHERE cfg.singleton AND cfg.token_hash = pg_catalog.sha256(convert_to(token, 'UTF8'))
    ) THEN
      RETURN;
    END IF;
  END IF;
  RAISE EXCEPTION 'Digul server credential required' USING ERRCODE = '42501';
END
$function$;
REVOKE ALL ON FUNCTION digul_private.require_game_server() FROM PUBLIC, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.digul_leaderboard_top5()
RETURNS TABLE (nickname text, score integer, "achievedAt" timestamptz, "playTimeMs" bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  PERFORM digul_private.require_game_server();
  RETURN QUERY
  SELECT b.nickname, b.score, b.achieved_at, b.play_time_ms
  FROM digul_private.leaderboard AS b
  ORDER BY b.score DESC, b.reached_order
  LIMIT 5;
END
$function$;

CREATE OR REPLACE FUNCTION public.digul_leaderboard_submit(
  p_nickname text, p_score integer, p_play_time_ms bigint DEFAULT NULL
)
RETURNS TABLE (nickname text, score integer, "achievedAt" timestamptz, "playTimeMs" bigint)
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  PERFORM digul_private.require_game_server();
  IF p_nickname IS NULL OR p_nickname COLLATE "C" !~ '^[가-힣A-Za-z0-9]{2,10}$'
    OR p_score IS NULL OR p_score < 0
    OR p_play_time_ms NOT BETWEEN 0 AND 9007199254740991 THEN
    RAISE EXCEPTION 'Invalid Digul leaderboard record' USING ERRCODE = '22023';
  END IF;

  IF p_score > 0 THEN
    -- Serialize scoring writes so tie order and the five-row cutoff agree.
    -- Plain reads can still see the last committed standings.
    LOCK TABLE digul_private.leaderboard IN SHARE ROW EXCLUSIVE MODE;
    INSERT INTO digul_private.leaderboard AS b (nickname, score, reached_order, achieved_at, play_time_ms)
    SELECT p_nickname, p_score, coalesce(max(old.reached_order), 0) + 1, clock_timestamp(), p_play_time_ms
    FROM digul_private.leaderboard AS old
    ON CONFLICT ON CONSTRAINT leaderboard_pkey DO UPDATE
    SET score = EXCLUDED.score, reached_order = EXCLUDED.reached_order,
        achieved_at = EXCLUDED.achieved_at, play_time_ms = EXCLUDED.play_time_ms
    WHERE EXCLUDED.score > b.score;

    DELETE FROM digul_private.leaderboard AS b
    WHERE b.nickname IN (
      SELECT tail.nickname FROM digul_private.leaderboard AS tail
      ORDER BY tail.score DESC, tail.reached_order OFFSET 5
    );
  END IF;

  RETURN QUERY SELECT * FROM public.digul_leaderboard_top5();
END
$function$;

REVOKE ALL ON FUNCTION public.digul_leaderboard_top5() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.digul_leaderboard_submit(text, integer, bigint) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.digul_leaderboard_top5() TO anon, service_role;
GRANT EXECUTE ON FUNCTION public.digul_leaderboard_submit(text, integer, bigint) TO anon, service_role;

NOTIFY pgrst, 'reload schema';
COMMIT;
