import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const source = {
  page: readFileSync(resolve(root, "app/mariangel-heart-ice/page.tsx"), "utf8"),
  component: readFileSync(resolve(root, "components/product/MariangelHeartIceProductPage.tsx"), "utf8"),
  structuredData: readFileSync(resolve(root, "components/product/MariangelStructuredData.tsx"), "utf8"),
  data: readFileSync(resolve(root, "components/product/mariangel-heart-ice-data.ts"), "utf8")
};

const checks = [
  ["독립 상품 상세 경로 렌더링", source.page.includes("<MariangelHeartIceProductPage />")],
  ["Product 구조화 데이터", source.structuredData.includes('"@type": "Product"')],
  ["FAQPage 구조화 데이터", source.structuredData.includes('"@type": "FAQPage"') && source.structuredData.includes("faqs.map")],
  ["미확인 평점 데이터 미생성", !source.structuredData.includes("aggregateRating") && !source.structuredData.includes("ratingValue")],
  ["CTA 문구 통일", (source.component.match(/product\.primaryCta/g) ?? []).length >= 4],
  ["CTA 이벤트 구분", ["hero_cta_click", "middle_cta_click", "bottom_cta_click", "mobile_sticky_cta_click"].every((value) => source.component.includes(value))],
  ["상품 이미지 대체 텍스트", source.component.includes('alt="화이트 컬러의 마리엔젤')],
  ["h1 제목", source.component.includes("<h1")],
  ["옵션 label 연결", source.component.includes('htmlFor="hero-option"') && source.component.includes('id="hero-option"')],
  ["모바일 가로 스크롤 방지", source.component.includes("overflow-x-hidden")],
  ["비교 후보 주의 문구", source.component.includes("실제 시장 1위 확정 데이터가 아닙니다")],
  ["확인 필요 상태 표시", source.component.includes("운영자 확인 필요") || source.data.includes("확인 필요")],
  ["판매가 데이터", source.data.includes("salePrice: 34800")],
  ["리뷰 수 데이터", source.data.includes("reviewCount: 85")],
  ["배송 기준 데이터", source.data.includes("shippingFee: 4000") && source.data.includes("freeShippingThreshold: 70000")]
];

let failed = 0;
for (const [name, passed] of checks) {
  console.log(`${passed ? "PASS" : "FAIL"}  ${name}`);
  if (!passed) failed += 1;
}

if (failed > 0) process.exit(1);
console.log(`\n총 ${checks.length}개 MVP 정적 검증 통과`);
