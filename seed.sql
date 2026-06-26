-- ============================================================
-- SEED: Run this in Supabase SQL Editor AFTER deploying schema
-- Step 1: Create your tenant
-- Step 2: Invite a user via Supabase Auth (Authentication > Users > Invite)
-- Step 3: Run the INSERT below to link that user to the tenant
-- ============================================================

-- 1. Create your first tenant (your company or first customer)
INSERT INTO tenants (nombre, email)
VALUES ('Improve Latino América', 'oscar.gonzalez@improvelatinoamerica.com')
RETURNING id;  -- Copy this UUID, you'll need it below

-- 2. After inviting yourself via Supabase Auth dashboard, run:
-- (replace the UUIDs with your actual user ID and the tenant ID from above)
--
-- INSERT INTO usuarios (id, tenant_id, nombre, email, rol)
-- VALUES (
--   'YOUR-AUTH-USER-UUID',          -- from Supabase Auth > Users
--   'YOUR-TENANT-UUID',             -- from the INSERT above
--   'Oscar González',
--   'oscar.gonzalez@improvelatinoamerica.com',
--   'admin'
-- );

-- 3. Seed some master data (optional, to test the app)
-- First get the tenant_id from step 1, then run:
--
-- INSERT INTO clientes (tenant_id, codigo, nombre, pais) VALUES
--   ('YOUR-TENANT-UUID', 'CLI-001', 'Walmart Inc.', 'USA'),
--   ('YOUR-TENANT-UUID', 'CLI-002', 'Target Corporation', 'USA'),
--   ('YOUR-TENANT-UUID', 'CLI-003', 'H&M Group', 'Sweden');
--
-- INSERT INTO colores (tenant_id, codigo, nombre) VALUES
--   ('YOUR-TENANT-UUID', 'BLK', 'BLACK'),
--   ('YOUR-TENANT-UUID', 'WHT', 'WHITE'),
--   ('YOUR-TENANT-UUID', 'NVY', 'NAVY'),
--   ('YOUR-TENANT-UUID', 'RED', 'RED');
--
-- INSERT INTO tallas (tenant_id, codigo, orden) VALUES
--   ('YOUR-TENANT-UUID', 'XS', 1),
--   ('YOUR-TENANT-UUID', 'S', 2),
--   ('YOUR-TENANT-UUID', 'M', 3),
--   ('YOUR-TENANT-UUID', 'L', 4),
--   ('YOUR-TENANT-UUID', 'XL', 5),
--   ('YOUR-TENANT-UUID', 'XXL', 6);
