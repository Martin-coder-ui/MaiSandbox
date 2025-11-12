/*
  # Create New Test Accounts for Clients and Providers
  
  ## Overview
  Creates test accounts that match the SignIn screen UI with proper credentials.
  
  ## Test Accounts Created
  
  ### Client Accounts:
  1. Emma Thompson (MaiHealth) - emma.health@test.com / health123
  2. James Wilson (MaiHome) - james.finance@test.com / finance123
  3. Sophie Chen (MaiStyle) - sophie.style@test.com / style123
  
  ### Provider Accounts:
  1. Dr. Sarah Johnson (Health Provider) - dr.sarah@test.com / provider123
  2. Lisa Rodriguez (Financial Advisor) - advisor.lisa@test.com / provider123
  
  ## Important Notes
  - All accounts are created with email_confirmed_at set (no confirmation needed)
  - Passwords are properly hashed using bcrypt
  - Provider accounts include provider_profiles entries
  - All providers are verified and ready to use
*/

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Delete existing test users if they exist
DELETE FROM auth.users
WHERE email IN (
  'emma.health@test.com',
  'james.finance@test.com',
  'sophie.style@test.com',
  'dr.sarah@test.com',
  'advisor.lisa@test.com'
);

-- Create temporary table to store generated UUIDs
CREATE TEMP TABLE temp_user_ids (
  email text PRIMARY KEY,
  user_id uuid DEFAULT gen_random_uuid()
);

-- Generate UUIDs for all test users
INSERT INTO temp_user_ids (email) VALUES
  ('emma.health@test.com'),
  ('james.finance@test.com'),
  ('sophie.style@test.com'),
  ('dr.sarah@test.com'),
  ('advisor.lisa@test.com');

-- Insert CLIENT and PROVIDER test users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_current,
  email_change_token_new
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  t.user_id,
  'authenticated',
  'authenticated',
  t.email,
  crypt(
    CASE t.email
      WHEN 'emma.health@test.com' THEN 'health123'
      WHEN 'james.finance@test.com' THEN 'finance123'
      WHEN 'sophie.style@test.com' THEN 'style123'
      WHEN 'dr.sarah@test.com' THEN 'provider123'
      WHEN 'advisor.lisa@test.com' THEN 'provider123'
    END,
    gen_salt('bf')
  ),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object(
    'full_name',
    CASE t.email
      WHEN 'emma.health@test.com' THEN 'Emma Thompson'
      WHEN 'james.finance@test.com' THEN 'James Wilson'
      WHEN 'sophie.style@test.com' THEN 'Sophie Chen'
      WHEN 'dr.sarah@test.com' THEN 'Dr. Sarah Johnson'
      WHEN 'advisor.lisa@test.com' THEN 'Lisa Rodriguez'
    END
  ),
  false,
  now(),
  now(),
  '',
  '',
  '',
  ''
FROM temp_user_ids t;

-- Create profiles for all accounts
INSERT INTO profiles (id, email, full_name, avatar_url, bio, location)
SELECT
  t.user_id,
  t.email,
  CASE t.email
    WHEN 'emma.health@test.com' THEN 'Emma Thompson'
    WHEN 'james.finance@test.com' THEN 'James Wilson'
    WHEN 'sophie.style@test.com' THEN 'Sophie Chen'
    WHEN 'dr.sarah@test.com' THEN 'Dr. Sarah Johnson'
    WHEN 'advisor.lisa@test.com' THEN 'Lisa Rodriguez'
  END,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=' ||
  CASE t.email
    WHEN 'emma.health@test.com' THEN 'Emma'
    WHEN 'james.finance@test.com' THEN 'James'
    WHEN 'sophie.style@test.com' THEN 'Sophie'
    WHEN 'dr.sarah@test.com' THEN 'DrSarah'
    WHEN 'advisor.lisa@test.com' THEN 'Lisa'
  END,
  CASE t.email
    WHEN 'emma.health@test.com' THEN 'Fitness enthusiast focused on holistic health and wellness.'
    WHEN 'james.finance@test.com' THEN 'Home improvement enthusiast and smart home technology lover.'
    WHEN 'sophie.style@test.com' THEN 'Fashion blogger and personal style consultant.'
    WHEN 'dr.sarah@test.com' THEN 'Licensed physiotherapist with 15 years of experience in sports rehabilitation.'
    WHEN 'advisor.lisa@test.com' THEN 'Certified Financial Planner helping clients achieve their financial goals.'
  END,
  CASE t.email
    WHEN 'emma.health@test.com' THEN 'San Francisco, CA'
    WHEN 'james.finance@test.com' THEN 'Austin, TX'
    WHEN 'sophie.style@test.com' THEN 'New York, NY'
    WHEN 'dr.sarah@test.com' THEN 'Los Angeles, CA'
    WHEN 'advisor.lisa@test.com' THEN 'Chicago, IL'
  END
FROM temp_user_ids t
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  location = EXCLUDED.location;

-- Create provider profiles
DO $$
DECLARE
  health_type_id uuid;
  financial_type_id uuid;
  dr_sarah_id uuid;
  lisa_id uuid;
BEGIN
  -- Get provider type IDs
  SELECT id INTO health_type_id FROM provider_types WHERE name = 'health';
  SELECT id INTO financial_type_id FROM provider_types WHERE name = 'financial';
  
  -- Get user IDs
  SELECT user_id INTO dr_sarah_id FROM temp_user_ids WHERE email = 'dr.sarah@test.com';
  SELECT user_id INTO lisa_id FROM temp_user_ids WHERE email = 'advisor.lisa@test.com';

  -- Create provider profile for Dr. Sarah (health)
  INSERT INTO provider_profiles (
    id,
    provider_type_id,
    business_name,
    license_number,
    certifications,
    specializations,
    verified,
    verification_date
  ) VALUES (
    dr_sarah_id,
    health_type_id,
    'Johnson Physiotherapy Clinic',
    'PT-CA-123456',
    '["DPT", "OCS", "Sports Certified Specialist"]'::jsonb,
    ARRAY['Sports Rehabilitation', 'Orthopedic Physical Therapy', 'Manual Therapy'],
    true,
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    provider_type_id = EXCLUDED.provider_type_id,
    business_name = EXCLUDED.business_name,
    license_number = EXCLUDED.license_number,
    certifications = EXCLUDED.certifications,
    specializations = EXCLUDED.specializations,
    verified = EXCLUDED.verified,
    verification_date = EXCLUDED.verification_date;

  -- Create provider profile for Lisa (financial)
  INSERT INTO provider_profiles (
    id,
    provider_type_id,
    business_name,
    license_number,
    certifications,
    specializations,
    verified,
    verification_date
  ) VALUES (
    lisa_id,
    financial_type_id,
    'Rodriguez Financial Planning',
    'CFP-123456',
    '["Certified Financial Planner", "Series 65", "CPA"]'::jsonb,
    ARRAY['Retirement Planning', 'Investment Management', 'Tax Planning'],
    true,
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    provider_type_id = EXCLUDED.provider_type_id,
    business_name = EXCLUDED.business_name,
    license_number = EXCLUDED.license_number,
    certifications = EXCLUDED.certifications,
    specializations = EXCLUDED.specializations,
    verified = EXCLUDED.verified,
    verification_date = EXCLUDED.verification_date;
END $$;

-- Create sample provider-client relationship (Emma with Dr. Sarah)
DO $$
DECLARE
  health_type_id uuid;
  emma_id uuid;
  dr_sarah_id uuid;
  relationship_id uuid;
BEGIN
  SELECT id INTO health_type_id FROM provider_types WHERE name = 'health';
  SELECT user_id INTO emma_id FROM temp_user_ids WHERE email = 'emma.health@test.com';
  SELECT user_id INTO dr_sarah_id FROM temp_user_ids WHERE email = 'dr.sarah@test.com';
  
  INSERT INTO provider_client_relationships (
    provider_id,
    client_id,
    provider_type_id,
    status,
    consent_granted_at,
    access_scope
  ) VALUES (
    dr_sarah_id,
    emma_id,
    health_type_id,
    'active',
    now(),
    '{"health_data": true, "medical_history": true}'::jsonb
  )
  ON CONFLICT (provider_id, client_id, provider_type_id) 
  DO UPDATE SET
    status = 'active',
    consent_granted_at = now()
  RETURNING id INTO relationship_id;

  -- Create consent record
  INSERT INTO data_access_consents (
    user_id,
    provider_id,
    relationship_id,
    data_category,
    granted_at
  ) VALUES (
    emma_id,
    dr_sarah_id,
    relationship_id,
    'health',
    now()
  )
  ON CONFLICT DO NOTHING;
END $$;

-- Add sample social posts
DO $$
DECLARE
  emma_id uuid;
  james_id uuid;
  sophie_id uuid;
BEGIN
  SELECT user_id INTO emma_id FROM temp_user_ids WHERE email = 'emma.health@test.com';
  SELECT user_id INTO james_id FROM temp_user_ids WHERE email = 'james.finance@test.com';
  SELECT user_id INTO sophie_id FROM temp_user_ids WHERE email = 'sophie.style@test.com';

  INSERT INTO social_posts (id, user_id, content, vertical, privacy_level, created_at)
  VALUES
    (
      gen_random_uuid(),
      emma_id,
      'Just completed my first 5K run! Feeling amazing! 🏃‍♀️',
      'MaiHealth',
      'public',
      now()
    ),
    (
      gen_random_uuid(),
      james_id,
      'Installed new smart lighting throughout the house. Energy savings here I come! 💡',
      'MaiHome',
      'public',
      now()
    ),
    (
      gen_random_uuid(),
      sophie_id,
      'Found the perfect minimalist wardrobe pieces at the thrift store today! ✨',
      'MaiStyle',
      'public',
      now()
    )
  ON CONFLICT DO NOTHING;

  -- Add achievements (without points and rarity fields)
  INSERT INTO social_achievements (id, user_id, title, description, icon, vertical, is_shared, achieved_at)
  VALUES
    (
      gen_random_uuid(),
      emma_id,
      'First 5K',
      'Completed your first 5K run',
      '🏃‍♀️',
      'MaiHealth',
      true,
      now()
    ),
    (
      gen_random_uuid(),
      james_id,
      'Smart Home Starter',
      'Installed your first smart home device',
      '💡',
      'MaiHome',
      true,
      now()
    ),
    (
      gen_random_uuid(),
      sophie_id,
      'Sustainable Shopper',
      'Made 5 sustainable fashion purchases',
      '♻️',
      'MaiStyle',
      true,
      now()
    )
  ON CONFLICT DO NOTHING;
END $$;

-- Clean up temporary table
DROP TABLE temp_user_ids;
