import { Client, ValidationItem } from "@/types/client";
import { hasRunnableCondition } from "@/lib/tag-utils";

export function validateClientSettings(client?: Client, html?: string): ValidationItem[] {
  const items: ValidationItem[] = [];
  const source = html || "";
  const scriptMatches = source.match(/tag-loader\.js/g) || [];
  const hasClientId = client ? source.includes(`data-client-id="${client.clientId}"`) || source.includes(`data-client-id='${client.clientId}'`) : /data-client-id\s*=/.test(source);

  items.push({
    label: "통합 스크립트 설치 여부",
    status: source ? (scriptMatches.length > 0 ? "pass" : "fail") : "warn",
    message: source ? (scriptMatches.length > 0 ? "tag-loader.js가 확인되었습니다." : "HTML에서 tag-loader.js를 찾지 못했습니다.") : "URL 검수는 서버 접근 가능 여부에 따라 제한될 수 있습니다."
  });

  items.push({
    label: "data-client-id 존재 여부",
    status: source ? (hasClientId ? "pass" : "fail") : "warn",
    message: source ? (hasClientId ? "Client ID 속성이 확인되었습니다." : "data-client-id 속성이 없거나 선택한 광고주와 다릅니다.") : "HTML을 붙여넣으면 더 정확히 확인할 수 있습니다."
  });

  items.push({
    label: "중복 설치 여부",
    status: scriptMatches.length <= 1 ? "pass" : "fail",
    message: scriptMatches.length <= 1 ? "중복 설치 징후가 없습니다." : `${scriptMatches.length}개의 통합 스크립트가 발견되었습니다.`
  });

  if (!client) {
    items.push({
      label: "광고주 설정",
      status: "warn",
      message: "Client ID와 매칭되는 광고주 설정을 찾지 못했습니다."
    });
    return items;
  }

  items.push({
    label: "GA4 Measurement ID 형식",
    status: !client.tags.ga4.enabled || /^G-[A-Z0-9]+$/i.test(client.tags.ga4.measurementId) ? "pass" : "fail",
    message: client.tags.ga4.enabled ? "G- 형식의 Measurement ID를 검사했습니다." : "GA4가 비활성화되어 있습니다."
  });

  items.push({
    label: "Google Ads Conversion ID 형식",
    status: !client.tags.googleAds.enabled || /^AW-\d+$/i.test(client.tags.googleAds.conversionId) ? "pass" : "fail",
    message: client.tags.googleAds.enabled ? "AW-숫자 형식의 Conversion ID를 검사했습니다." : "Google Ads가 비활성화되어 있습니다."
  });

  items.push({
    label: "Meta Pixel ID 형식",
    status: !client.tags.meta.enabled || /^\d{5,}$/.test(client.tags.meta.pixelId) ? "pass" : "fail",
    message: client.tags.meta.enabled ? "숫자 기반 Pixel ID를 검사했습니다." : "Meta Pixel이 비활성화되어 있습니다."
  });

  const enabledEvents = client.events.filter((event) => event.enabled);
  items.push({
    label: "이벤트 URL 조건 설정",
    status: enabledEvents.every(hasRunnableCondition) ? "pass" : "warn",
    message: enabledEvents.every(hasRunnableCondition) ? "활성 이벤트의 실행 조건이 준비되었습니다." : "일부 활성 이벤트에 URL 조건이 없습니다."
  });

  const purchaseEvent = client.events.find((event) => event.key === "Purchase");
  items.push({
    label: "구매완료 이벤트 설정",
    status: purchaseEvent?.enabled && purchaseEvent.urlContains ? "pass" : "warn",
    message: purchaseEvent?.enabled && purchaseEvent.urlContains ? "Purchase 이벤트 조건이 설정되었습니다." : "구매완료 페이지 URL 조건을 설정하세요."
  });

  return items;
}
