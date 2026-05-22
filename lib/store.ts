import { promises as fs } from "fs";
import path from "path";
import { Client } from "@/types/client";
import { createDefaultEvents } from "@/lib/defaults";
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
  await ensureDataFile();
  const raw = await fs.readFile(dataFile, "utf8");
  return JSON.parse(raw) as Client[];
}

export async function saveClients(clients: Client[]) {
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
  clients.unshift(client);
  await saveClients(clients);
  return client;
}

export async function updateClient(id: string, input: Partial<Client>) {
  const clients = await getClients();
  const index = clients.findIndex((client) => client.id === id);
  if (index < 0) return null;
  const updated = normalizeClient(input, clients[index]);
  clients[index] = updated;
  await saveClients(clients);
  return updated;
}

export async function deleteClient(id: string) {
  const clients = await getClients();
  const next = clients.filter((client) => client.id !== id);
  await saveClients(next);
  return next.length !== clients.length;
}

function seedClients(): Client[] {
  const now = new Date().toISOString();
  return [
    {
      id: "seed-parfait",
      clientId: "cli_parfait_a11mng",
      name: "파르페by알레르망",
      siteUrl: "https://example-parfait.co.kr",
      mallPlatform: "카페24",
      memo: "침구 카테고리. 구매완료 URL 확인 필요.",
      installStatus: "검수 필요",
      lastCheckedAt: null,
      tags: {
        ga4: { enabled: true, measurementId: "G-PARFAIT01" },
        googleAds: { enabled: true, conversionId: "AW-123456789", conversionLabel: "abcDeFgH" },
        naver: { enabled: false, scriptIdOrCode: "" },
        meta: { enabled: true, pixelId: "123456789012345" },
        danggeun: { enabled: false, scriptIdOrCode: "" }
      },
      events: createDefaultEvents().map((event) => event.key === "Purchase" ? { ...event, enabled: true, urlContains: "/order/order_result" } : event),
      createdAt: now,
      updatedAt: now
    },
    {
      id: "seed-nzorigin",
      clientId: "cli_nzorigin_2026aa",
      name: "엔젯오리진",
      siteUrl: "https://example-nzorigin.co.kr",
      mallPlatform: "Shopify",
      memo: "글로벌몰 확장 가능성 있음.",
      installStatus: "설치 완료",
      lastCheckedAt: now,
      tags: {
        ga4: { enabled: true, measurementId: "G-NZORIGIN1" },
        googleAds: { enabled: false, conversionId: "", conversionLabel: "" },
        naver: { enabled: true, scriptIdOrCode: "wcslog123456" },
        meta: { enabled: false, pixelId: "" },
        danggeun: { enabled: false, scriptIdOrCode: "" }
      },
      events: createDefaultEvents(),
      createdAt: now,
      updatedAt: now
    },
    {
      id: "seed-housetailor",
      clientId: "cli_housetailor_77qq",
      name: "하우스테일러",
      siteUrl: "https://example-housetailor.co.kr",
      mallPlatform: "아임웹",
      memo: "리드 이벤트 중심.",
      installStatus: "미설치",
      lastCheckedAt: null,
      tags: {
        ga4: { enabled: false, measurementId: "" },
        googleAds: { enabled: false, conversionId: "", conversionLabel: "" },
        naver: { enabled: false, scriptIdOrCode: "" },
        meta: { enabled: true, pixelId: "998877665544332" },
        danggeun: { enabled: true, scriptIdOrCode: "danggeun_pixel_001" }
      },
      events: createDefaultEvents().map((event) => event.key === "Lead" ? { ...event, enabled: true, urlContains: "/contact/complete" } : event),
      createdAt: now,
      updatedAt: now
    }
  ];
}
