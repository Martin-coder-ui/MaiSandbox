/*
  # Fix profiles INSERT policy for signup

  1. Changes
    - Drop existing restrictive INSERT policy on profiles table
    - Create new INSERT policy that allows users to create their own profile during signup
    - The policy now checks if the inserting user's ID matches the profile ID being created
    
  2. Security
    - Maintains security by ensuring users can only create profiles for their own user ID
    - Allows signup flow to complete successfully by permitting authenticated user creation
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Create a new INSERT policy that works during signup
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
