export const productSourceUrl =
  "https://mariangel.co.kr/product/mnl-%ED%95%98%ED%8A%B8-%EC%95%84%EC%9D%B4%EC%8A%A4-%EB%83%89%EA%B0%90%ED%8C%A8%EB%93%9C-%EC%97%AC%EB%A6%84%EC%9D%B4%EB%B6%88-%EC%B9%A8%EB%8C%80%ED%8C%A8%EB%93%9C-%EA%B3%A0%EC%A0%95%EB%B0%B4%EB%93%9C/8073/category/1/display/2/?icid=MAIN.product_listmain_1";

export const productImageUrl =
  "https://cafe24.poxo.com/ec01/agapanthus10/3Edgez7aTEs2uDezllWuL3LQ0H6iKzMTzYEZ0Mrr2jUo6pOswz/G4Ou9kVkLuTE%2BSZ4spIARWO3mwJa9FtXBwQ%3D%3D/_/web/product/small/202604/1932b069730c2e682f26196397b8b579.jpg";

export const product = {
  brand: "마리엔젤",
  name: "mnl 하트-아이스 냉감패드",
  fullName: "mnl 하트-아이스 냉감패드 여름이불 침대패드 고정밴드",
  category: "침구/홈패브릭",
  consumerPrice: 82000,
  salePrice: 34800,
  bestPrice: 24360,
  bestDiscount: 10440,
  reward: "300원 (1%)",
  reviewCount: 85,
  shippingFee: 4000,
  freeShippingThreshold: 70000,
  shippingPeriod: "결제·입금 확인 후 통상 2~10일",
  returnWindow: "상품 수령 후 7일 이내",
  returnCondition: "세탁 전·사용 전 상품에 한해 가능",
  primaryCta: "내 옵션 확인하고 구매하기"
} as const;

export type ProductOption = {
  id: string;
  size: "SS" | "Q" | "K";
  configuration: "패드 단품" | "패드+베개시트" | "풀세트";
  label: string;
  recommendation: string;
  included: string;
  priceNote: string;
};

export const productOptions: ProductOption[] = [
  {
    id: "ss-pad",
    size: "SS",
    configuration: "패드 단품",
    label: "SS 단품패드",
    recommendation: "싱글 침대에서 패드만 교체하려는 경우",
    included: "SS 패드 1장",
    priceNote: "기본 판매가 기준 · 최종가는 주문서 확인"
  },
  {
    id: "ss-pillow",
    size: "SS",
    configuration: "패드+베개시트",
    label: "SS 패드 + 베개시트 1장",
    recommendation: "싱글 침대의 패드와 베개 커버를 함께 맞추는 경우",
    included: "SS 패드 1장 + 베개시트 1장",
    priceNote: "구성별 추가금 확인 필요"
  },
  {
    id: "ss-full",
    size: "SS",
    configuration: "풀세트",
    label: "SS 패드 + 베개시트 1장 + SS 냉감이불",
    recommendation: "싱글 침대 여름 침구 구성을 한 번에 준비하는 경우",
    included: "SS 패드 1장 + 베개시트 1장 + SS 냉감이불 1장",
    priceNote: "옵션명에 10% 할인 표시 · 최종가는 주문서 확인"
  },
  {
    id: "q-pad",
    size: "Q",
    configuration: "패드 단품",
    label: "Q 단품패드",
    recommendation: "퀸 침대에서 패드만 교체하려는 경우",
    included: "Q 패드 1장",
    priceNote: "구성별 추가금 확인 필요"
  },
  {
    id: "q-pillow",
    size: "Q",
    configuration: "패드+베개시트",
    label: "Q 패드 + 베개시트 2장",
    recommendation: "퀸 침대의 패드와 베개 커버를 함께 맞추는 경우",
    included: "Q 패드 1장 + 베개시트 2장",
    priceNote: "구성별 추가금 확인 필요"
  },
  {
    id: "q-full",
    size: "Q",
    configuration: "풀세트",
    label: "Q 패드 + 베개시트 2장 + QK 냉감이불",
    recommendation: "퀸 침대 여름 침구 구성을 한 번에 준비하는 경우",
    included: "Q 패드 1장 + 베개시트 2장 + QK 냉감이불 1장",
    priceNote: "옵션명에 10% 할인 표시 · 최종가는 주문서 확인"
  },
  {
    id: "k-pad",
    size: "K",
    configuration: "패드 단품",
    label: "K 단품패드",
    recommendation: "킹 침대에서 패드만 교체하려는 경우",
    included: "K 패드 1장",
    priceNote: "구성별 추가금 확인 필요"
  },
  {
    id: "k-pillow",
    size: "K",
    configuration: "패드+베개시트",
    label: "K 패드 + 베개시트 2장",
    recommendation: "킹 침대의 패드와 베개 커버를 함께 맞추는 경우",
    included: "K 패드 1장 + 베개시트 2장",
    priceNote: "구성별 추가금 확인 필요"
  },
  {
    id: "k-full",
    size: "K",
    configuration: "풀세트",
    label: "K 패드 + 베개시트 2장 + QK 냉감이불",
    recommendation: "킹 침대 여름 침구 구성을 한 번에 준비하는 경우",
    included: "K 패드 1장 + 베개시트 2장 + QK 냉감이불 1장",
    priceNote: "옵션명에 10% 할인 표시 · 최종가는 주문서 확인"
  }
];

export const comparisonRows = [
  {
    criterion: "가격 기준",
    ours: "소비자가 82,000원 / 판매가 34,800원 / 최적할인가 24,360원",
    benchmark: "116,500원",
    benchmarkStatus: "직접 입력값 · 재확인 필요"
  },
  {
    criterion: "구성 선택",
    ours: "SS·Q·K 패드 단품, 베개시트 구성, 냉감이불 포함 구성",
    benchmark: "옵션 구성 확인 필요",
    benchmarkStatus: "운영자 확인 필요"
  },
  {
    criterion: "사용 상황",
    ours: "침대 크기와 필요한 침구 범위에 따라 9개 옵션 선택",
    benchmark: "추천 상황 확인 필요",
    benchmarkStatus: "운영자 확인 필요"
  },
  {
    criterion: "확인된 차이",
    ours: "하트 누빔 디자인, 침대 고정밴드, 리뷰 85건",
    benchmark: "소재·고정 방식·후기 근거 확인 필요",
    benchmarkStatus: "시장 1위 확정 비교 아님"
  },
  {
    criterion: "배송 조건",
    ours: "배송비 4,000원 / 70,000원 이상 무료배송",
    benchmark: "배송 조건 확인 필요",
    benchmarkStatus: "운영자 확인 필요"
  }
] as const;

export const reviewSignals = [
  {
    title: "닿을 때 느껴지는 시원함",
    description: "공개 리뷰에서 시원함과 촉감에 대한 표현이 반복적으로 확인됩니다."
  },
  {
    title: "하트 누빔 디자인",
    description: "일반적인 냉감패드와 다른 하트 패턴이 구매 이유로 언급됩니다."
  },
  {
    title: "밀림을 줄이는 고정밴드",
    description: "매트리스에 끼우는 밴드가 편리하다는 후기가 확인됩니다."
  }
] as const;

export const faqs = [
  {
    question: "배송비와 무료배송 기준은 어떻게 되나요?",
    answer: "기본 배송비는 4,000원이며, 70,000원 이상 구매 시 무료배송으로 표시됩니다. 도서·산간 지역은 추가 비용이 발생할 수 있습니다."
  },
  {
    question: "배송은 얼마나 걸리나요?",
    answer: "공식 페이지에는 결제·입금 확인 후 통상 2~10일로 안내되어 있습니다. 상품 종류와 주문 시점에 따라 달라질 수 있으므로 주문 화면의 발송 안내를 함께 확인해야 합니다."
  },
  {
    question: "교환이나 반품은 언제까지 가능한가요?",
    answer: "상품 수령 후 7일 이내이며, 세탁 전·사용 전 상품에 한해 가능합니다. 단순 변심에 따른 반송 비용은 고객 부담으로 안내되어 있습니다."
  },
  {
    question: "어떤 옵션을 선택해야 하나요?",
    answer: "침대 크기에 따라 SS·Q·K를 먼저 고른 뒤, 패드만 필요한지, 베개시트까지 필요한지, 냉감이불을 포함한 구성이 필요한지 선택하면 됩니다. 옵션별 추가금과 최종 할인가는 주문서에서 확인해야 합니다."
  },
  {
    question: "24,360원은 모든 옵션의 확정 결제 금액인가요?",
    answer: "공식 페이지에 표시된 최적할인가이며 쿠폰, 옵션 추가금, 적용 조건에 따라 최종 결제 금액이 달라질 수 있습니다. 실제 결제 금액은 주문서에서 확인해야 합니다."
  }
] as const;
