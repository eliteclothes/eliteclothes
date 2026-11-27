-- DESCUENTOS DESDE EL PANEL
-- Pégalo en Supabase > SQL Editor > New query > Run (una sola vez; es seguro repetirlo).
-- Agrega al producto su "precio antes" (el precio normal que se muestra tachado). 0 = sin descuento.
-- "precio" sigue siendo lo que se cobra, así que el pago con Bold ya usa el precio con descuento.
alter table public.productos add column if not exists precio_antes integer not null default 0;
