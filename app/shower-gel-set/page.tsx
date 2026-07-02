import type { Metadata } from "next";
import { ShowerGelProductPage } from "@/components/product/ShowerGelProductPage";

export const metadata: Metadata = {
  title: "샤워젤 2+1 향기 선택 세트 | 온유어데이",
  description:
    "시트러스, 우디, 플로럴 중 원하는 향 3개를 선택하는 온유어데이 샤워젤 2+1 세트입니다. 가격, 구성, 배송, 교환 기준을 한 화면에서 확인하세요."
};

export default function ShowerGelSetPage() {
  return <ShowerGelProductPage />;
}
