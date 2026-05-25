import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

const supabaseKey = env.supabaseServiceRoleKey || env.supabasePublishableKey;

export const supabaseConfig = {
  isConfigured: Boolean(env.supabaseUrl && supabaseKey),
  keyType: env.supabaseServiceRoleKey ? "service_role" : "publishable",
  table: env.supabaseTable
};

export const supabaseClient = supabaseConfig.isConfigured
  ? createClient(env.supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : null;
