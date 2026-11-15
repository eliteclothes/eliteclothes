-- AVISOS POR WHATSAPP: marca para no avisar dos veces el mismo pedido.
-- Si ya habías corrido pedidos.sql, pega SOLO esto en Supabase > SQL Editor > Run (es seguro repetirlo).
alter table public.pedidos add column if not exists avisado boolean not null default false;
