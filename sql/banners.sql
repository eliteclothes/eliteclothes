-- BANNERS EDITABLES DESDE EL PANEL (pestaña "Banners")
-- 1) Cambia TU_CORREO@dominio.com (aparece 2 veces) por el MISMO correo que usaste en seguridad.sql (Ctrl + H en el Bloc de notas).
-- 2) Pégalo en Supabase > SQL Editor > New query > Run. Es seguro repetirlo.
-- Mientras no haya banners activos en esta tabla, la tienda sigue mostrando los de js/datos/banners.js.

create table if not exists public.banners (
  id      bigint generated always as identity primary key,
  img     text    not null,                       -- foto (enlace)
  pos     text    not null default '50% 50%',     -- qué parte de la foto se ve (encuadre)
  titulo  text    not null default '',
  texto   text    not null default '',
  boton   text    not null default '',            -- vacío = sin botón
  href    text    not null default '',            -- a dónde lleva el botón
  orden   integer not null default 0,
  activo  boolean not null default true,
  creado  timestamptz not null default now()
);

alter table public.banners enable row level security;
drop policy if exists "ver banners" on public.banners;
drop policy if exists "admin gestiona banners" on public.banners;
-- Todos ven los banners activos; solo tu correo ve los ocultos y puede crear, editar o borrar.
create policy "ver banners" on public.banners for select
  using (activo = true or (auth.jwt() ->> 'email') = 'eliteclothes827@gmail.com');
create policy "admin gestiona banners" on public.banners for all to authenticated
  using ((auth.jwt() ->> 'email') = 'eliteclothes827@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'eliteclothes827@gmail.com');
