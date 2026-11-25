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

CREATE OR REPLACE FUNCTION public.digul_leaderboard_top5()
RETURNS TABLE (nickname text, score integer, "achievedAt" timestamptz, "playTimeMs" bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $function$
  SELECT b.nickname, b.score, b.achieved_at, b.play_time_ms
  FROM digul_private.leaderboard AS b
  ORDER BY b.score DESC, b.reached_order
  LIMIT 5
$function$;

CREATE OR REPLACE FUNCTION public.digul_leaderboard_submit(
  p_nickname text, p_score integer, p_play_time_ms bigint DEFAULT NULL
)
RETURNS TABLE (nickname text, score integer, "achievedAt" timestamptz, "playTimeMs" bigint)
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
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
GRANT EXECUTE ON FUNCTION public.digul_leaderboard_top5() TO service_role;
GRANT EXECUTE ON FUNCTION public.digul_leaderboard_submit(text, integer, bigint) TO service_role;

NOTIFY pgrst, 'reload schema';
COMMIT;
