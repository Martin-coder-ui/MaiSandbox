/*
  # Create Test Users

  1. Test Users
    Creates several test user accounts with known passwords for development/testing:
    - healthuser@example.com (password: password123)
    - moneyuser@example.com (password: password123)
    - socialuser@example.com (password: password123)
    - styleuser@example.com (password: password123)
    - demo@example.com (password: password123)

  2. Profiles
    Creates corresponding profile entries for each test user

  Note: This uses pgcrypto extension for password hashing
*/

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Delete existing test users if they exist
DELETE FROM auth.users
WHERE email IN (
  'healthuser@example.com',
  'moneyuser@example.com',
  'socialuser@example.com',
  'styleuser@example.com',
  'demo@example.com'
);

-- Insert test users with valid password hashes
-- Note: Supabase requires specific fields for auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  recovery_sent_at,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_current,
  email_change_token_new
) VALUES
  (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'healthuser@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Health User"}'::jsonb,
    false,
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'moneyuser@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Money User"}'::jsonb,
    false,
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'socialuser@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Social User"}'::jsonb,
    false,
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'styleuser@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Style User"}'::jsonb,
    false,
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'demo@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Demo User"}'::jsonb,
    false,
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

-- Create corresponding profile entries
INSERT INTO profiles (id, email, full_name)
SELECT 
  id,
  email,
  CASE email
    WHEN 'healthuser@example.com' THEN 'Health User'
    WHEN 'moneyuser@example.com' THEN 'Money User'
    WHEN 'socialuser@example.com' THEN 'Social User'
    WHEN 'styleuser@example.com' THEN 'Style User'
    WHEN 'demo@example.com' THEN 'Demo User'
  END as full_name
FROM auth.users
WHERE email IN (
  'healthuser@example.com',
  'moneyuser@example.com',
  'socialuser@example.com',
  'styleuser@example.com',
  'demo@example.com'
)
ON CONFLICT (id) DO NOTHING;
