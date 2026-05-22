import { Client, EventConfig, EventKey, TagsConfig } from "@/types/client";

export const eventKeys: EventKey[] = [
  "PageView",
  "ViewContent",
  "AddToCart",
  "BeginCheckout",
  "Purchase",
  "CompleteRegistration",
  "Lead"
];

export const defaultTags: TagsConfig = {
  ga4: { enabled: false, measurementId: "" },
  googleAds: { enabled: false, conversionId: "", conversionLabel: "" },
  naver: { enabled: false, scriptIdOrCode: "" },
  meta: { enabled: false, pixelId: "" },
  danggeun: { enabled: false, scriptIdOrCode: "" }
};

export function createDefaultEvents(): EventConfig[] {
  return eventKeys.map((key) => ({
    key,
    enabled: key === "PageView",
    urlContains: key === "PageView" ? "/" : "",
    useValue: key === "Purchase",
    revenueVariableName: key === "Purchase" ? "orderAmount" : "",
    orderIdVariableName: key === "Purchase" ? "orderId" : ""
  }));
}

export function createEmptyClient(): Omit<Client, "id" | "clientId" | "createdAt" | "updatedAt"> {
  return {
    name: "",
    siteUrl: "",
    mallPlatform: "기타",
    memo: "",
    installStatus: "미설치",
    lastCheckedAt: null,
    tags: structuredClone(defaultTags),
    events: createDefaultEvents()
  };
}
