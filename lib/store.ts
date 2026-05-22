import { promises as fs } from "fs";
import path from "path";
import { Client } from "@/types/client";
import { createDefaultEvents } from "@/lib/defaults";
import { seedClients } from "@/lib/seed";
import {
  createSupabaseClient,
  deleteSupabaseClient,
  getSupabaseClients,
  isSupabaseEnabled,
  saveSupabaseClient
} from "@/lib/supabase-store";
import { normalizeClient } from "@/lib/tag-utils";

const dataDir = process.env.DATA_DIR || path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "clients.json");

async function ensureDataFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(seedClients(), null, 2), "utf8");
  }
}

export async function getClients(): Promise<Client[]> {
  if (isSupabaseEnabled()) {
    return getSupabaseClients();
  }

  await ensureDataFile();
  const raw = await fs.readFile(dataFile, "utf8");
  return JSON.parse(raw) as Client[];
}

export async function saveClients(clients: Client[]) {
  if (isSupabaseEnabled()) {
    throw new Error("Supabase 저장소에서는 전체 저장을 지원하지 않습니다.");
  }

  await ensureDataFile();
  await fs.writeFile(dataFile, JSON.stringify(clients, null, 2), "utf8");
}

export async function getClientById(id: string) {
  const clients = await getClients();
  return clients.find((client) => client.id === id || client.clientId === id);
}

export async function createClient(input: Partial<Client>) {
  const clients = await getClients();
  const client = normalizeClient({ ...input, events: input.events?.length ? input.events : createDefaultEvents() });

  if (isSupabaseEnabled()) {
    return createSupabaseClient(client);
  }

  clients.unshift(client);
  await saveClients(clients);
  return client;
}

export async function updateClient(id: string, input: Partial<Client>) {
  const clients = await getClients();
  const index = clients.findIndex((client) => client.id === id);
  if (index < 0) return null;
  const updated = normalizeClient(input, clients[index]);

  if (isSupabaseEnabled()) {
    return saveSupabaseClient(updated);
  }

  clients[index] = updated;
  await saveClients(clients);
  return updated;
}

export async function deleteClient(id: string) {
  const clients = await getClients();
  if (isSupabaseEnabled()) {
    const exists = clients.some((client) => client.id === id);
    if (!exists) return false;
    await deleteSupabaseClient(id);
    return true;
  }

  const next = clients.filter((client) => client.id !== id);
  await saveClients(next);
  return next.length !== clients.length;
}
