-- Recreate the events tables if they were dropped.
-- Run this in the Supabase SQL Editor.

-- Drop tables and sequences if they exist so we can recreate cleanly
DROP TABLE IF EXISTS public.events_rels CASCADE;
DROP TABLE IF EXISTS public.events_locales CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP SEQUENCE IF EXISTS public.events_rels_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.events_locales_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.events_id_seq CASCADE;

-- Create enum types if they don't already exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE n.nspname = 'public' AND t.typname = 'enum_events_status') THEN
        CREATE TYPE public.enum_events_status AS ENUM ('upcoming', 'ongoing', 'past', 'cancelled');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE n.nspname = 'public' AND t.typname = 'enum_events_kind') THEN
        CREATE TYPE public.enum_events_kind AS ENUM ('seminar', 'workshop', 'retreat', 'festival');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE n.nspname = 'public' AND t.typname = '_locales') THEN
        CREATE TYPE public._locales AS ENUM ('bg', 'en');
    END IF;
END $$;

-- events table
CREATE TABLE public.events (
    id integer NOT NULL,
    slug character varying NOT NULL,
    starts_at timestamp(3) with time zone NOT NULL,
    ends_at timestamp(3) with time zone,
    capacity numeric DEFAULT 0 NOT NULL,
    status public.enum_events_status DEFAULT 'upcoming'::public.enum_events_status NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    view_count numeric DEFAULT 0,
    kind public.enum_events_kind DEFAULT 'seminar'::public.enum_events_kind NOT NULL,
    cover_url character varying,
    facebook_url character varying,
    facebook_event_id character varying
);

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;
ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);

CREATE UNIQUE INDEX events_slug_idx ON public.events USING btree (slug);
CREATE INDEX events_created_at_idx ON public.events USING btree (created_at);
CREATE INDEX events_updated_at_idx ON public.events USING btree (updated_at);

-- events_locales table
CREATE TABLE public.events_locales (
    title character varying NOT NULL,
    description jsonb,
    location character varying,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id integer NOT NULL
);

CREATE SEQUENCE public.events_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.events_locales_id_seq OWNED BY public.events_locales.id;
ALTER TABLE ONLY public.events_locales ALTER COLUMN id SET DEFAULT nextval('public.events_locales_id_seq'::regclass);

ALTER TABLE ONLY public.events_locales
    ADD CONSTRAINT events_locales_pkey PRIMARY KEY (id);

CREATE UNIQUE INDEX events_locales_locale_parent_id_unique ON public.events_locales USING btree (_locale, _parent_id);

ALTER TABLE ONLY public.events_locales
    ADD CONSTRAINT events_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.events(id) ON DELETE CASCADE;

-- events_rels table
CREATE TABLE public.events_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    event_packages_id integer
);

CREATE SEQUENCE public.events_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.events_rels_id_seq OWNED BY public.events_rels.id;
ALTER TABLE ONLY public.events_rels ALTER COLUMN id SET DEFAULT nextval('public.events_rels_id_seq'::regclass);

ALTER TABLE ONLY public.events_rels
    ADD CONSTRAINT events_rels_pkey PRIMARY KEY (id);

CREATE INDEX events_rels_event_packages_id_idx ON public.events_rels USING btree (event_packages_id);
CREATE INDEX events_rels_order_idx ON public.events_rels USING btree ("order");
CREATE INDEX events_rels_parent_idx ON public.events_rels USING btree (parent_id);
CREATE INDEX events_rels_path_idx ON public.events_rels USING btree (path);

ALTER TABLE ONLY public.events_rels
    ADD CONSTRAINT events_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.events(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.events_rels
    ADD CONSTRAINT events_rels_event_packages_fk FOREIGN KEY (event_packages_id) REFERENCES public.event_packages(id) ON DELETE CASCADE;
