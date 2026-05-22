export type MallPlatform =
  | "카페24"
  | "고도몰"
  | "메이크샵"
  | "아임웹"
  | "식스샵"
  | "Shopify"
  | "기타";

export type InstallStatus = "설치 완료" | "미설치" | "검수 필요" | "오류";

export type MediaKey = "ga4" | "googleAds" | "naver" | "meta" | "danggeun";

export type EventKey =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "BeginCheckout"
  | "Purchase"
  | "CompleteRegistration"
  | "Lead";

export interface Ga4TagConfig {
  enabled: boolean;
  measurementId: string;
}

export interface GoogleAdsTagConfig {
  enabled: boolean;
  conversionId: string;
  conversionLabel: string;
}

export interface ScriptTagConfig {
  enabled: boolean;
  scriptIdOrCode: string;
}

export interface PixelTagConfig {
  enabled: boolean;
  pixelId: string;
}

export interface TagsConfig {
  ga4: Ga4TagConfig;
  googleAds: GoogleAdsTagConfig;
  naver: ScriptTagConfig;
  meta: PixelTagConfig;
  danggeun: ScriptTagConfig;
}

export interface EventConfig {
  key: EventKey;
  enabled: boolean;
  urlContains: string;
  useValue: boolean;
  revenueVariableName: string;
  orderIdVariableName: string;
}

export interface Client {
  id: string;
  clientId: string;
  name: string;
  siteUrl: string;
  mallPlatform: MallPlatform;
  memo: string;
  installStatus: InstallStatus;
  lastCheckedAt: string | null;
  tags: TagsConfig;
  events: EventConfig[];
  createdAt: string;
  updatedAt: string;
}

export interface ValidationRequest {
  clientId?: string;
  url?: string;
  html?: string;
}

export interface ValidationItem {
  label: string;
  status: "pass" | "warn" | "fail";
  message: string;
}
