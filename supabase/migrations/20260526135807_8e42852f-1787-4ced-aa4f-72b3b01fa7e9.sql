-- Add explicit deny-all RLS policy on leads. All app reads/writes go through
-- supabaseAdmin (service role), which bypasses RLS. This policy ensures anon
-- and authenticated roles cannot read, insert, update or delete leads directly.
CREATE POLICY "Deny all direct access to leads"
ON public.leads
AS RESTRICTIVE
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);