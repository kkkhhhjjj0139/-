import { Client } from "@/types/client";

interface ClientRow {
  id: string;
  client_id: string;
  name: string;
  site_url: string;
  mall_platform: Client["mallPlatform"];
  memo: string;
  install_status: Client["installStatus"];
  last_checked_at: string | null;
  tags: Client["tags"];
  events: Client["events"];
  created_at: string;
  updated_at: string;
}

const tableName = "clients";

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

export function isSupabaseEnabled() {
  return Boolean(getSupabaseConfig());
}

async function requestSupabase<T>(path: string, init?: RequestInit): Promise<T> {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Supabase 환경변수가 설정되지 않았습니다.");

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init?.headers || {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase 요청 실패: ${response.status} ${detail}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function getSupabaseClients(): Promise<Client[]> {
  const rows = await requestSupabase<ClientRow[]>(`${tableName}?select=*&order=created_at.desc`);
  return rows.map(rowToClient);
}

export async function saveSupabaseClient(client: Client) {
  const rows = await requestSupabase<ClientRow[]>(`${tableName}?id=eq.${encodeURIComponent(client.id)}`, {
    method: "PATCH",
    body: JSON.stringify(clientToRow(client))
  });
  return rowToClient(rows[0]);
}

export async function createSupabaseClient(client: Client) {
  const rows = await requestSupabase<ClientRow[]>(tableName, {
    method: "POST",
    body: JSON.stringify(clientToRow(client))
  });
  return rowToClient(rows[0]);
}

export async function deleteSupabaseClient(id: string) {
  await requestSupabase(`${tableName}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE"
  });
  return true;
}

function rowToClient(row: ClientRow): Client {
  return {
    id: row.id,
    clientId: row.client_id,
    name: row.name,
    siteUrl: row.site_url,
    mallPlatform: row.mall_platform,
    memo: row.memo,
    installStatus: row.install_status,
    lastCheckedAt: row.last_checked_at,
    tags: row.tags,
    events: row.events,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function clientToRow(client: Client): ClientRow {
  return {
    id: client.id,
    client_id: client.clientId,
    name: client.name,
    site_url: client.siteUrl,
    mall_platform: client.mallPlatform,
    memo: client.memo,
    install_status: client.installStatus,
    last_checked_at: client.lastCheckedAt,
    tags: client.tags,
    events: client.events,
    created_at: client.createdAt,
    updated_at: client.updatedAt
  };
}
