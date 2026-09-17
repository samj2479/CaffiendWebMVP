-- Phase 1: metadata-only inspection, NOT a migration.
-- Run in the intended Supabase project's SQL editor with read-only review.
-- No customer/order rows, credentials, or function bodies are selected.
-- Review results before sharing: custom policy expressions may contain literals.
BEGIN TRANSACTION READ ONLY;

SELECT table_schema, table_name, column_name, data_type, udt_name,
       is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

SELECT n.nspname AS schema_name, c.relname AS table_name,
       c.relrowsecurity AS rls_enabled, c.relforcerowsecurity AS force_rls
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname IN ('public', 'storage') AND c.relkind IN ('r', 'p')
ORDER BY 1, 2;

SELECT n.nspname AS schema_name, c.relname AS table_name,
       con.conname, con.contype, pg_get_constraintdef(con.oid) AS definition
FROM pg_constraint con
JOIN pg_class c ON c.oid = con.conrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
ORDER BY 1, 2, 3;

SELECT schemaname, tablename, indexname, indexdef
FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename, indexname;

SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies WHERE schemaname IN ('public', 'storage', 'realtime')
ORDER BY schemaname, tablename, policyname;

SELECT table_schema, table_name, grantee, privilege_type
FROM information_schema.table_privileges
WHERE table_schema IN ('public', 'storage')
  AND grantee IN ('anon', 'authenticated', 'service_role', 'PUBLIC')
ORDER BY 1, 2, 3, 4;

SELECT table_schema, table_name, column_name, grantee, privilege_type
FROM information_schema.column_privileges
WHERE table_schema = 'public' AND grantee IN ('anon', 'authenticated', 'PUBLIC')
ORDER BY 1, 2, 3, 4, 5;

SELECT event_object_schema, event_object_table, trigger_name,
       event_manipulation, action_timing, action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public' ORDER BY 1, 2, 3;

SELECT n.nspname AS schema_name, p.proname AS function_name,
       pg_get_function_identity_arguments(p.oid) AS arguments,
       p.prosecdef AS security_definer, p.proacl AS access_privileges
FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' ORDER BY 1, 2, 3;

SELECT pubname, schemaname, tablename
FROM pg_publication_tables WHERE schemaname = 'public' ORDER BY 1, 2, 3;

SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets WHERE id = 'menu-images';

ROLLBACK;
