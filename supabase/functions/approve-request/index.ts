/// <reference lib="deno.ns" />
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

  // Initialize Supabase client with Service Role Key
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
    const { requestId, requestType, requestData, email, password, name, role, mohUserId } = await req.json();

    if (!requestId || !email || !password || !name || !role || !mohUserId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Create the user in Supabase Auth (Requires Service Role Key)
    const [firstName, ...lastNameParts] = name.split(" ");
    const lastName = lastNameParts.join(" ");

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
      return new Response(JSON.stringify({ error: `Auth user creation failed: ${authError.message}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = authData.user.id;
    let facilityId: number | null = null;

    // 2. Handle Facility-specific logic: Create facility record and get its ID
    if (requestType === "facility") {
      const { data: facilityData, error: facilityInsertError } = await supabaseAdmin
        .from("facilities")
        .insert({
          name: requestData.facilityName,
          lga: requestData.lga,
          type: requestData.facilityType,
          status: "verified",
          administrators: 1,
          compliance: 0,
          api_activity: "None",
          last_sync: null,
        })
        .select("id")
        .single();

      if (facilityInsertError) {
        console.error("Error inserting new facility:", facilityInsertError);
        // Attempt to delete the auth user if facility creation fails
        await supabaseAdmin.auth.admin.deleteUser(userId);
        return new Response(JSON.stringify({ error: "Failed to create new facility record. User rolled back." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      facilityId = facilityData.id;
    }

    // 3. Update the user's profile with the correct role and facility ID
    const { error: profileUpdateError } = await supabaseAdmin
      .from("profiles")
      .update({
        role: role,
        facility_id: facilityId,
        first_name: firstName,
        last_name: lastName,
      })
      .eq("id", userId);

    if (profileUpdateError) {
      console.error("Failed to set role/facility ID:", profileUpdateError);
      // Attempt to delete the auth user if profile update fails
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return new Response(JSON.stringify({ error: "User created, but failed to assign role/facility ID. User rolled back." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 4. Mark the registration request as approved
    const { error: updateRequestError } = await supabaseAdmin
      .from("registration_requests")
      .update({ status: "approved", approved_by: mohUserId })
      .eq("id", requestId);

    if (updateRequestError) {
      console.error("Error updating request status:", updateRequestError);
      // Note: We don't roll back user/facility here, as the core approval happened.
      return new Response(JSON.stringify({ error: "Failed to mark request as approved, but user/facility created." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Success response
    return new Response(JSON.stringify({ success: true, userId, facilityId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Edge Function Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});