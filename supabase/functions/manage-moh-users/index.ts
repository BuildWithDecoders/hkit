// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  try {
    // 1. Authenticate the caller (ensure an MoH user is making the request)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized: Missing Authorization header" }), { status: 401, headers: corsHeaders });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user: callerUser }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !callerUser) {
        return new Response(JSON.stringify({ error: "Unauthorized: Invalid token" }), { status: 401, headers: corsHeaders });
    }
    
    // Check if the caller has the MoH role
    const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', callerUser.id)
        .single();

    if (profileError || profile?.role !== 'MoH') {
        return new Response(JSON.stringify({ error: "Forbidden: Caller is not an MoH Administrator" }), { status: 403, headers: corsHeaders });
    }

    // 2. Handle GET request (Fetch all MoH users)
    if (req.method === 'GET') {
      const { data: profiles, error: fetchError } = await supabaseAdmin
        .from('profiles')
        .select('id, first_name, last_name, role, updated_at, auth_user:auth.users(email, last_sign_in_at)')
        .in('role', ['MoH', 'DataAnalyst', 'SystemDeveloper']) // Fetch all internal MoH roles
        .order('updated_at', { ascending: false });

      if (fetchError) {
        console.error("Error fetching MoH profiles:", fetchError);
        return new Response(JSON.stringify({ error: fetchError.message }), { status: 500, headers: corsHeaders });
      }
      
      // Flatten the structure for the client, ensuring robust handling of null auth_user
      const users = profiles.map(p => {
          const authUser = p.auth_user;
          
          return {
              id: p.id,
              firstName: p.first_name,
              lastName: p.last_name,
              email: authUser ? authUser.email : 'N/A (Auth Missing)',
              role: p.role,
              status: authUser && authUser.last_sign_in_at ? 'Active' : 'Inactive',
              lastSignIn: authUser ? authUser.last_sign_in_at : null,
          };
      });

      return new Response(JSON.stringify(users), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    
    // 3. Handle POST requests (CREATE, UPDATE, DELETE)
    const { action, payload } = await req.json();

    if (action === 'CREATE_USER') {
        const { email, password, firstName, lastName, role: newRole } = payload;
        
        if (!email || !password || !firstName || !lastName || !newRole) {
            return new Response(JSON.stringify({ error: "Missing required fields for user creation" }), { status: 400, headers: corsHeaders });
        }
        
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                first_name: firstName,
                last_name: lastName,
            },
        });

        if (authError) {
            console.error("Auth user creation failed:", authError);
            return new Response(JSON.stringify({ error: `Auth user creation failed: ${authError.message}` }), { status: 500, headers: corsHeaders });
        }
        
        const userId = authData.user.id;
        
        const { error: profileUpdateError } = await supabaseAdmin
            .from("profiles")
            .update({
                role: newRole,
                first_name: firstName,
                last_name: lastName,
            })
            .eq("id", userId);

        if (profileUpdateError) {
            console.error("Failed to set role:", profileUpdateError);
            await supabaseAdmin.auth.admin.deleteUser(userId);
            return new Response(JSON.stringify({ error: "User created, but failed to assign role. User rolled back." }), { status: 500, headers: corsHeaders });
        }
        
        return new Response(JSON.stringify({ success: true, userId }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    }
    
    if (action === 'UPDATE_USER') {
        const { id, email, firstName, lastName, role: newRole, password } = payload;
        
        if (!id || !email || !firstName || !lastName || !newRole) {
            return new Response(JSON.stringify({ error: "Missing required fields for user update" }), { status: 400, headers: corsHeaders });
        }
        
        const authUpdatePayload = {
            email: email,
            user_metadata: {
                first_name: firstName,
                last_name: lastName,
            },
        };
        
        if (password) {
            authUpdatePayload.password = password;
        }
        
        const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(id, authUpdatePayload);
        
        if (authUpdateError) {
            console.error("Auth user update failed:", authUpdateError);
            return new Response(JSON.stringify({ error: `Auth user update failed: ${authUpdateError.message}` }), { status: 500, headers: corsHeaders });
        }
        
        const { error: profileUpdateError } = await supabaseAdmin
            .from("profiles")
            .update({
                role: newRole,
                first_name: firstName,
                last_name: lastName,
            })
            .eq("id", id);

        if (profileUpdateError) {
            console.error("Failed to update profile role/name:", profileUpdateError);
            return new Response(JSON.stringify({ error: "Failed to update profile role/name." }), { status: 500, headers: corsHeaders });
        }
        
        return new Response(JSON.stringify({ success: true, userId: id }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    }
    
    if (action === 'DELETE_USER') {
        const { id } = payload;
        
        if (!id) {
            return new Response(JSON.stringify({ error: "Missing user ID for deletion" }), { status: 400, headers: corsHeaders });
        }
        
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(id);

        if (deleteError) {
            console.error("Auth user deletion failed:", deleteError);
            return new Response(JSON.stringify({ error: `Auth user deletion failed: ${deleteError.message}` }), { status: 500, headers: corsHeaders });
        }
        
        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    }


    return new Response(JSON.stringify({ error: "Invalid action or method" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Edge Function Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});