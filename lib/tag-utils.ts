import { Client, EventConfig, TagsConfig } from "@/types/client";

export function generateClientId(name?: string) {
  const cleaned = (name || "client")
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/gi, "")
    .slice(0, 12);
  const random = Math.random().toString(36).slice(2, 8);
  return `cli_${cleaned || "client"}_${random}`;
}

export function countEnabledTags(tags: TagsConfig) {
  return Object.values(tags).filter((tag) => tag.enabled).length;
}

export function createInstallScript(clientId: string, host = "http://localhost:3000") {
  return `<script src="${host}/tag-loader.js" data-client-id="${clientId}"></script>`;
}

export function normalizeClient(input: Partial<Client>, previous?: Client): Client {
  const now = new Date().toISOString();
  return {
    id: previous?.id || crypto.randomUUID(),
    clientId: previous?.clientId || input.clientId || generateClientId(input.name),
    name: input.name?.trim() || previous?.name || "신규 광고주",
    siteUrl: input.siteUrl?.trim() || previous?.siteUrl || "",
    mallPlatform: input.mallPlatform || previous?.mallPlatform || "기타",
    memo: input.memo ?? previous?.memo ?? "",
    installStatus: input.installStatus || previous?.installStatus || "미설치",
    lastCheckedAt: input.lastCheckedAt ?? previous?.lastCheckedAt ?? null,
    tags: input.tags || previous?.tags || {
      ga4: { enabled: false, measurementId: "" },
      googleAds: { enabled: false, conversionId: "", conversionLabel: "" },
      naver: { enabled: false, scriptIdOrCode: "" },
      meta: { enabled: false, pixelId: "" },
      danggeun: { enabled: false, scriptIdOrCode: "" }
    },
    events: input.events || previous?.events || [],
    createdAt: previous?.createdAt || now,
    updatedAt: now
  };
}

export function hasRunnableCondition(event: EventConfig) {
  return event.key === "PageView" || event.urlContains.trim().length > 0;
}
