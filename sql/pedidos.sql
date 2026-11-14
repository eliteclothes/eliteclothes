-- PEDIDOS + INVENTARIO POR TALLA
-- Pega este archivo COMPLETO en Supabase > SQL Editor > New query > Run.
-- Es seguro correrlo más de una vez y NO cambia nada de lo que ya ves en la tienda.

-- 1) Inventario: cuántas unidades hay de cada talla. Ejemplo: {"S": 3, "M": 5, "L": 0}
alter table public.productos add column if not exists stock jsonb not null default '{}'::jsonb;

-- Productos que ya existen: 1 unidad por talla disponible y 0 por talla agotada
-- (el dueño luego ajusta las cantidades reales desde el panel)
update public.productos p
set stock = coalesce((
  select jsonb_object_agg(t, case when t = any(p.agotadas) then 0 else 1 end)
  from unnest(p.tallas) as t
), '{}'::jsonb)
where p.stock = '{}'::jsonb;

-- 2) Pedidos
create table if not exists public.pedidos (
  id               bigint generated always as identity primary key,
  ref              text    not null unique,            -- referencia que se envía a Bold (ej: EC-1731543210-482)
  estado           text    not null default 'pendiente'
                   check (estado in ('pendiente','pagado','enviado','fallido','cancelado','revisar')),
  nombre           text    not null,
  cedula           text    not null default '',
  telefono         text    not null,
  correo           text    not null,
  departamento     text    not null default '',
  ciudad           text    not null,
  direccion        text    not null,
  notas            text    not null default '',
  subtotal         integer not null,
  envio            integer not null default 0,
  total            integer not null,
  bold_tx          text,                               -- id de la transacción en Bold
  guia             text    not null default '',        -- número de guía del envío
  stock_descontado boolean not null default false,
  visto            boolean not null default false,     -- el dueño ya lo abrió en el panel
  creado           timestamptz not null default now(),
  pagado_en        timestamptz,
  enviado_en       timestamptz
);

create table if not exists public.pedido_items (
  id          bigint generated always as identity primary key,
  pedido_id   bigint  not null references public.pedidos(id) on delete cascade,
  producto_id bigint  references public.productos(id) on delete set null,
  nombre      text    not null,
  talla       text    not null,
  cantidad    integer not null check (cantidad > 0),
  precio      integer not null,
  img         text    not null default ''
);

create index if not exists pedidos_estado_creado on public.pedidos (estado, creado desc);
create index if not exists pedido_items_pedido   on public.pedido_items (pedido_id);

-- 3) Seguridad: el público NO puede ver ni crear pedidos desde el navegador.
--    Los pedidos los crea el servidor (Netlify) con la llave secret.
--    Solo el dueño (con sesión en /admin/) puede verlos y actualizarlos.
alter table public.pedidos      enable row level security;
alter table public.pedido_items enable row level security;

drop policy if exists "admin ve pedidos"      on public.pedidos;
drop policy if exists "admin edita pedidos"   on public.pedidos;
drop policy if exists "admin ve items"        on public.pedido_items;
create policy "admin ve pedidos"    on public.pedidos      for select to authenticated using (true);
create policy "admin edita pedidos" on public.pedidos      for update to authenticated using (true) with check (true);
create policy "admin ve items"      on public.pedido_items for select to authenticated using (true);

-- 4) Descontar el stock cuando Bold confirma el pago (lo llama el servidor, una sola vez por pedido)
--    Devuelve: 'ok' | 'ya_descontado' | 'sin_stock' (queda en estado "revisar") | 'no_existe'
create or replace function public.descontar_stock_pedido(p_pedido bigint)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  ped      public.pedidos%rowtype;
  it       record;
  actual   integer;
  faltante boolean := false;
begin
  select * into ped from public.pedidos where id = p_pedido for update;   -- bloquea el pedido
  if not found then return 'no_existe'; end if;
  if ped.stock_descontado then return 'ya_descontado'; end if;

  -- a) verificar que alcance todo (bloquea también los productos)
  for it in select * from public.pedido_items where pedido_id = p_pedido loop
    select coalesce((stock ->> it.talla)::integer, 0) into actual
      from public.productos where id = it.producto_id for update;
    if actual is null or actual < it.cantidad then faltante := true; end if;
  end loop;

  if faltante then
    update public.pedidos
       set estado = 'revisar', pagado_en = coalesce(pagado_en, now())
     where id = p_pedido;
    return 'sin_stock';
  end if;

  -- b) descontar y actualizar las tallas agotadas
  for it in select * from public.pedido_items where pedido_id = p_pedido loop
    update public.productos
       set stock = jsonb_set(stock, array[it.talla],
                             to_jsonb(coalesce((stock ->> it.talla)::integer, 0) - it.cantidad))
     where id = it.producto_id;

    update public.productos p
       set agotadas = coalesce((
             select array_agg(t) from unnest(p.tallas) as t
             where coalesce((p.stock ->> t)::integer, 0) <= 0), '{}')
     where p.id = it.producto_id;
  end loop;

  update public.pedidos
     set estado = 'pagado', stock_descontado = true, pagado_en = coalesce(pagado_en, now())
   where id = p_pedido;
  return 'ok';
end $$;

-- 5) Devolver el stock si se cancela un pedido (botón "Devolver al inventario" del panel)
create or replace function public.devolver_stock_pedido(p_pedido bigint)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  ped public.pedidos%rowtype;
  it  record;
begin
  if auth.role() not in ('authenticated', 'service_role') then
    raise exception 'sin permiso';
  end if;

  select * into ped from public.pedidos where id = p_pedido for update;
  if not found then return 'no_existe'; end if;

  if ped.stock_descontado then
    for it in select * from public.pedido_items where pedido_id = p_pedido loop
      update public.productos
         set stock = jsonb_set(stock, array[it.talla],
                               to_jsonb(coalesce((stock ->> it.talla)::integer, 0) + it.cantidad))
       where id = it.producto_id;

      update public.productos p
         set agotadas = coalesce((
               select array_agg(t) from unnest(p.tallas) as t
               where coalesce((p.stock ->> t)::integer, 0) <= 0), '{}')
       where p.id = it.producto_id;
    end loop;
  end if;

  update public.pedidos set estado = 'cancelado', stock_descontado = false where id = p_pedido;
  return 'ok';
end $$;

-- Quién puede llamar a cada función
revoke all on function public.descontar_stock_pedido(bigint) from public, anon, authenticated;
grant execute on function public.descontar_stock_pedido(bigint) to service_role;
revoke all on function public.devolver_stock_pedido(bigint) from public, anon;
grant execute on function public.devolver_stock_pedido(bigint) to authenticated, service_role;
