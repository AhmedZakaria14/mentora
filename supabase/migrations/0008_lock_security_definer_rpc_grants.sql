revoke all on function public.handle_new_user() from public, anon, authenticated;

revoke all on function public.create_booking_hold(uuid,uuid,timestamptz,timestamptz,integer) from public, anon;
grant execute on function public.create_booking_hold(uuid,uuid,timestamptz,timestamptz,integer) to authenticated, service_role;

revoke all on function public.submit_mentor_application(jsonb) from public, anon;
grant execute on function public.submit_mentor_application(jsonb) to authenticated, service_role;
