-- SEGURIDAD: que SOLO TÚ (con tu correo) puedas editar productos y fotos.
-- 1) Cambia TU_CORREO@dominio.com (aparece 8 veces) por el correo con el que entras al panel.
-- 2) Pégalo en Supabase > SQL Editor > New query > Run.
-- 3) Además apaga los registros: Authentication > Sign In / Providers > desactiva "Allow new users to sign up".

drop policy if exists "ver productos" on public.productos;
drop policy if exists "admin gestiona" on public.productos;
create policy "ver productos" on public.productos for select
  using (activo = true or (auth.jwt() ->> 'email') = 'TU_CORREO@dominio.com');
create policy "admin gestiona" on public.productos for all to authenticated
  using ((auth.jwt() ->> 'email') = 'TU_CORREO@dominio.com')
  with check ((auth.jwt() ->> 'email') = 'TU_CORREO@dominio.com');

drop policy if exists "admin sube fotos" on storage.objects;
drop policy if exists "admin edita fotos" on storage.objects;
drop policy if exists "admin borra fotos" on storage.objects;
create policy "admin sube fotos" on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos' and (auth.jwt() ->> 'email') = 'TU_CORREO@dominio.com');
create policy "admin edita fotos" on storage.objects for update to authenticated
  using (bucket_id = 'fotos' and (auth.jwt() ->> 'email') = 'TU_CORREO@dominio.com');
create policy "admin borra fotos" on storage.objects for delete to authenticated
  using (bucket_id = 'fotos' and (auth.jwt() ->> 'email') = 'TU_CORREO@dominio.com');
