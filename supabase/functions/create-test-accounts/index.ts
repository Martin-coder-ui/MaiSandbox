import { createClient } from 'npm:@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const testAccounts = [
      {
        email: 'emma.health@test.com',
        password: 'health123',
        full_name: 'Emma Thompson',
        bio: 'Fitness enthusiast focused on holistic health and wellness.',
        location: 'San Francisco, CA',
        isProvider: false
      },
      {
        email: 'james.finance@test.com',
        password: 'finance123',
        full_name: 'James Wilson',
        bio: 'Home improvement enthusiast and smart home technology lover.',
        location: 'Austin, TX',
        isProvider: false
      },
      {
        email: 'sophie.style@test.com',
        password: 'style123',
        full_name: 'Sophie Chen',
        bio: 'Fashion blogger and personal style consultant.',
        location: 'New York, NY',
        isProvider: false
      },
      {
        email: 'dr.sarah@test.com',
        password: 'provider123',
        full_name: 'Dr. Sarah Johnson',
        bio: 'Licensed physiotherapist with 15 years of experience in sports rehabilitation.',
        location: 'Los Angeles, CA',
        isProvider: true,
        providerType: 'health',
        businessName: 'Johnson Physiotherapy Clinic',
        licenseNumber: 'PT-CA-123456'
      },
      {
        email: 'advisor.lisa@test.com',
        password: 'provider123',
        full_name: 'Lisa Rodriguez',
        bio: 'Certified Financial Planner helping clients achieve their financial goals.',
        location: 'Chicago, IL',
        isProvider: true,
        providerType: 'financial',
        businessName: 'Rodriguez Financial Planning',
        licenseNumber: 'CFP-123456'
      }
    ];

    const results = [];

    for (const account of testAccounts) {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: {
          full_name: account.full_name
        }
      });

      if (authError) {
        results.push({
          email: account.email,
          success: false,
          error: authError.message
        });
        continue;
      }

      const userId = authData.user.id;

      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: userId,
          email: account.email,
          full_name: account.full_name,
          bio: account.bio,
          location: account.location,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${account.full_name.split(' ')[0]}`
        });

      if (profileError) {
        results.push({
          email: account.email,
          success: false,
          error: `Profile creation failed: ${profileError.message}`
        });
        continue;
      }

      if (account.isProvider) {
        const { data: providerTypeData } = await supabaseAdmin
          .from('provider_types')
          .select('id')
          .eq('name', account.providerType)
          .single();

        if (providerTypeData) {
          await supabaseAdmin
            .from('provider_profiles')
            .insert({
              id: userId,
              provider_type_id: providerTypeData.id,
              business_name: account.businessName,
              license_number: account.licenseNumber,
              certifications: [],
              specializations: [],
              verified: true,
              verification_date: new Date().toISOString()
            });
        }
      }

      results.push({
        email: account.email,
        success: true,
        userId: userId
      });
    }

    const emmaUser = results.find(r => r.email === 'emma.health@test.com');
    const jamesUser = results.find(r => r.email === 'james.finance@test.com');
    const sophieUser = results.find(r => r.email === 'sophie.style@test.com');

    if (emmaUser?.userId || jamesUser?.userId || sophieUser?.userId) {
      await supabaseAdmin
        .from('social_posts')
        .insert([
          emmaUser?.userId ? {
            user_id: emmaUser.userId,
            content: 'Just completed my first 5K run! Feeling amazing! 🏃‍♀️',
            vertical: 'MaiHealth',
            privacy_level: 'public'
          } : null,
          jamesUser?.userId ? {
            user_id: jamesUser.userId,
            content: 'Installed new smart lighting throughout the house. Energy savings here I come! 💡',
            vertical: 'MaiHome',
            privacy_level: 'public'
          } : null,
          sophieUser?.userId ? {
            user_id: sophieUser.userId,
            content: 'Found the perfect minimalist wardrobe pieces at the thrift store today! ✨',
            vertical: 'MaiStyle',
            privacy_level: 'public'
          } : null
        ].filter(Boolean));
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Test accounts created successfully',
        results: results
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});