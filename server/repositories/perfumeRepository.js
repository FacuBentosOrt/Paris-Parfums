import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "../config/env.js";
import { supabaseClient, supabaseConfig } from "../config/supabase.js";
import { HttpError } from "../utils/httpError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "..", "data");
const seedFile = path.join(dataDir, "perfumes.seed.json");
const perfumesTable = env.supabaseTable;

async function readJsonFile(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error(`El archivo ${path.basename(filePath)} no contiene un array valido.`);
  }

  return parsed;
}

async function readSeedPerfumes() {
  return readJsonFile(seedFile);
}

function ensureSupabaseConfigured() {
  if (!supabaseConfig.isConfigured || !supabaseClient) {
    throw new HttpError(
      500,
      "Supabase no esta configurado en el backend. Define SUPABASE_URL y una clave valida."
    );
  }
}

function toRepositoryError(error) {
  if (!error) {
    return null;
  }

  if (error.code === "42P01" || error.code === "PGRST205") {
    return new HttpError(
      500,
      `La tabla '${perfumesTable}' no existe en Supabase. Ejecuta el script SQL de setup.`
    );
  }

  if (error.code === "42501") {
    return new HttpError(
      403,
      "La clave de Supabase no tiene permisos sobre la tabla de perfumes."
    );
  }

  if (error.code === "23505") {
    return new HttpError(409, "Ya existe un perfume con ese slug.");
  }

  return new HttpError(500, error.message || "Error de base de datos en Supabase.");
}

export async function getDatabaseHealthFromStore() {
  if (!supabaseConfig.isConfigured || !supabaseClient) {
    return {
      configured: false,
      connected: false,
      keyType: supabaseConfig.keyType,
      table: supabaseConfig.table,
      message: "Faltan variables de Supabase en el backend."
    };
  }

  const { error } = await supabaseClient
    .from(perfumesTable)
    .select("slug")
    .limit(1);

  if (error) {
    return {
      configured: true,
      connected: false,
      keyType: supabaseConfig.keyType,
      table: supabaseConfig.table,
      message: toRepositoryError(error).message
    };
  }

  return {
    configured: true,
    connected: true,
    keyType: supabaseConfig.keyType,
    table: supabaseConfig.table,
    message: "Conexion con Supabase OK."
  };
}

export async function listPerfumesFromStore() {
  ensureSupabaseConfigured();

  const primaryQuery = await supabaseClient
    .from(perfumesTable)
    .select("*")
    .order("createdAt", { ascending: true });

  if (!primaryQuery.error) {
    return primaryQuery.data ?? [];
  }

  const fallbackQuery = await supabaseClient.from(perfumesTable).select("*").order("slug");
  if (fallbackQuery.error) {
    throw toRepositoryError(primaryQuery.error);
  }

  return fallbackQuery.data ?? [];
}

export async function getPerfumeBySlugFromStore(slug) {
  ensureSupabaseConfigured();

  const { data, error } = await supabaseClient
    .from(perfumesTable)
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw toRepositoryError(error);
  }

  if (!data) {
    throw new HttpError(404, "Perfume no encontrado.");
  }

  return data;
}

export async function createPerfumeInStore(perfume) {
  ensureSupabaseConfigured();

  const { data, error } = await supabaseClient
    .from(perfumesTable)
    .insert(perfume)
    .select("*")
    .single();

  if (error) {
    throw toRepositoryError(error);
  }

  return data;
}

export async function updatePerfumeInStore(slug, perfume) {
  ensureSupabaseConfigured();

  const { data, error } = await supabaseClient
    .from(perfumesTable)
    .update(perfume)
    .eq("slug", slug)
    .select("*")
    .maybeSingle();

  if (error) {
    throw toRepositoryError(error);
  }

  if (!data) {
    throw new HttpError(404, "Perfume no encontrado.");
  }

  return data;
}

export async function deletePerfumeFromStore(slug) {
  ensureSupabaseConfigured();

  const { data, error } = await supabaseClient
    .from(perfumesTable)
    .delete()
    .eq("slug", slug)
    .select("slug")
    .maybeSingle();

  if (error) {
    throw toRepositoryError(error);
  }

  if (!data) {
    throw new HttpError(404, "Perfume no encontrado.");
  }
}

export async function resetPerfumesStore() {
  ensureSupabaseConfigured();

  const seedPerfumes = await readSeedPerfumes();

  const { error: deleteError } = await supabaseClient
    .from(perfumesTable)
    .delete()
    .not("slug", "is", null);

  if (deleteError) {
    throw toRepositoryError(deleteError);
  }

  const { error: insertError } = await supabaseClient.from(perfumesTable).insert(seedPerfumes);
  if (insertError) {
    throw toRepositoryError(insertError);
  }

  return listPerfumesFromStore();
}
