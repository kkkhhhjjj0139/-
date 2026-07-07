import type { Metadata } from "next";
import MariangelHeartIceProductPage from "@/components/product/MariangelHeartIceProductPage";
import { product } from "@/components/product/mariangel-heart-ice-data";

export const metadata: Metadata = {
  title: `${product.name} 선택 가이드 | ${product.brand}`,
  description:
    "가격, 구성, 사용 상황, 배송·교환 기준을 한 화면에서 비교하는 마리엔젤 하트-아이스 냉감패드 구매 가이드입니다."
};

export default function MariangelHeartIcePage() {
  return <MariangelHeartIceProductPage />;
}
