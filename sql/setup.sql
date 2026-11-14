-- PEGA ESTE ARCHIVO COMPLETO en Supabase > SQL Editor > New query > Run (se ejecuta una sola vez)

-- 1) Tabla de productos
create table if not exists public.productos (
  id        bigint generated always as identity primary key,
  grupo     text    not null default 'hombre',   -- hombre | mujer | kids
  nombre    text    not null,
  marca     text    not null default '',
  cat       text    not null,                    -- categoría (Camisetas, Perfumes...)
  precio    integer not null default 0,
  imgs      text[]  not null default '{}',       -- fotos (la primera es la principal)
  tallas    text[]  not null default '{}',
  agotadas  text[]  not null default '{}',
  activo    boolean not null default true,       -- false = oculto en la tienda
  orden     integer not null default 0,
  creado    timestamptz not null default now()
);

-- 2) Seguridad: todos pueden VER los productos activos; solo el dueño (con sesión) puede cambiarlos
alter table public.productos enable row level security;
drop policy if exists "ver productos" on public.productos;
drop policy if exists "admin gestiona" on public.productos;
create policy "ver productos" on public.productos for select using (activo = true or auth.role() = 'authenticated');
create policy "admin gestiona" on public.productos for all to authenticated using (true) with check (true);

-- 3) Carpeta pública de fotos
insert into storage.buckets (id, name, public) values ('fotos', 'fotos', true) on conflict (id) do nothing;
drop policy if exists "fotos publicas" on storage.objects;
drop policy if exists "admin sube fotos" on storage.objects;
drop policy if exists "admin edita fotos" on storage.objects;
drop policy if exists "admin borra fotos" on storage.objects;
create policy "fotos publicas" on storage.objects for select using (bucket_id = 'fotos');
create policy "admin sube fotos" on storage.objects for insert to authenticated with check (bucket_id = 'fotos');
create policy "admin edita fotos" on storage.objects for update to authenticated using (bucket_id = 'fotos');
create policy "admin borra fotos" on storage.objects for delete to authenticated using (bucket_id = 'fotos');
