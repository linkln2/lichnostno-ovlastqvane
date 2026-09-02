-- Add Spanish, Italian and German locale values to all *_locales enum types.
-- Run this in your Supabase SQL Editor (or Postgres client) before deploying
-- the payload.config.ts change that adds the new locales.

DO $$
DECLARE
  enum_rec record;
BEGIN
  FOR enum_rec IN
    SELECT t.typname AS name
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typtype = 'e'
      AND n.nspname = 'public'
      AND t.typname LIKE '%locales'
  LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM pg_enum e
      JOIN pg_type t ON t.oid = e.enumtypid
      WHERE t.typname = enum_rec.name
        AND e.enumlabel = 'es'
    ) THEN
      EXECUTE format('ALTER TYPE public.%I ADD VALUE %L', enum_rec.name, 'es');
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM pg_enum e
      JOIN pg_type t ON t.oid = e.enumtypid
      WHERE t.typname = enum_rec.name
        AND e.enumlabel = 'it'
    ) THEN
      EXECUTE format('ALTER TYPE public.%I ADD VALUE %L', enum_rec.name, 'it');
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM pg_enum e
      JOIN pg_type t ON t.oid = e.enumtypid
      WHERE t.typname = enum_rec.name
        AND e.enumlabel = 'de'
    ) THEN
      EXECUTE format('ALTER TYPE public.%I ADD VALUE %L', enum_rec.name, 'de');
    END IF;
  END LOOP;
END $$;
