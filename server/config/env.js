import "dotenv/config";

export const env = {
  port: Number(process.env.PORT) || 4000,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  adminPassword: process.env.ADMIN_PASSWORD || "paris-admin-2026",
  jsonLimit: "3mb",
  supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  supabasePublishableKey:
    process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "",
  supabaseTable: process.env.SUPABASE_PERFUMES_TABLE || "perfumes"
};
