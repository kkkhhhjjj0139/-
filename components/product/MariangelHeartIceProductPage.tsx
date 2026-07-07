/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import {
  BadgePercent,
  Check,
  ChevronRight,
  Clock3,
  Heart,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Snowflake,
  Star,
  Truck
} from "lucide-react";
import {
  comparisonRows,
  faqs,
  product,
  productImageUrl,
  productOptions,
  productSourceUrl,
  reviewSignals
} from "@/components/product/mariangel-heart-ice-data";

const formatWon = (value: number) => `${value.toLocaleString("ko-KR")}원`;

export default function MariangelHeartIceProductPage() {
  const [selectedOptionId, setSelectedOptionId] = useState(productOptions[0].id);
  const selectedOption = useMemo(
    () => productOptions.find((option) => option.id === selectedOptionId) ?? productOptions[0],
    [selectedOptionId]
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fbfaf8] pb-24 text-slate-900 sm:pb-0">
      <header className="border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#top" className="text-lg font-semibold tracking-[0.18em] text-slate-900" aria-label="마리엔젤 상품 페이지 맨 위로 이동">
            MARIANGEL
          </a>
          <a
            href="#option-guide"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            옵션 먼저 보기
          </a>
        </div>
      </header>

      <section id="top" aria-labelledby="product-title" className="border-b border-stone-200 bg-gradient-to-b from-[#f5f1eb] to-[#fbfaf8]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8 lg:py-16">
          <div className="order-2 flex flex-col justify-center lg:order-1">
            <p className="mb-3 text-sm font-semibold tracking-[0.16em] text-sky-700">HEART-ICE SUMMER BEDDING</p>
            <h1 id="product-title" className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              더운 밤의 선택 기준을 먼저 정리한
              <span className="mt-2 block text-sky-800">mnl 하트-아이스 냉감패드</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              침대 크기와 필요한 구성만 고르면 됩니다. 하트 누빔 디자인, 고정밴드, SS·Q·K 옵션을 구매 전에 한 화면에서 비교해 보세요.
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-3" aria-label="핵심 상품 특징">
              {["하트 누빔 디자인", "침대 고정밴드", "SS·Q·K 구성"].map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 rounded-xl border border-white bg-white/80 px-3 py-3 text-sm font-semibold shadow-sm">
                  <Check className="h-4 w-4 shrink-0 text-sky-700" aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="mt-7 rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_14px_45px_rgba(15,23,42,0.08)] sm:p-6">
              <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                <span className="text-sm text-slate-500 line-through">소비자가 {formatWon(product.consumerPrice)}</span>
                <span className="text-3xl font-bold tracking-tight text-slate-950">{formatWon(product.salePrice)}</span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-rose-50 px-3 py-3 text-sm">
                <BadgePercent className="h-5 w-5 text-rose-600" aria-hidden="true" />
                <strong className="text-rose-700">최적할인가 {formatWon(product.bestPrice)}</strong>
                <span className="text-slate-600">판매가 대비 {formatWon(product.bestDiscount)} 할인</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                최적할인가는 쿠폰·옵션·적용 조건에 따라 달라질 수 있으며, 최종 결제 금액은 주문서에서 확인해야 합니다.
              </p>

              <label htmlFor="hero-option" className="mt-5 block text-sm font-semibold text-slate-800">
                내 침대와 필요한 구성 선택
              </label>
              <select
                id="hero-option"
                value={selectedOptionId}
                onChange={(event) => setSelectedOptionId(event.target.value)}
                className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-200"
              >
                {productOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm" aria-live="polite">
                <p className="font-semibold text-slate-900">{selectedOption.recommendation}</p>
                <p className="mt-1 text-slate-600">구성: {selectedOption.included}</p>
                <p className="mt-1 text-xs text-amber-700">{selectedOption.priceNote}</p>
              </div>

              <a
                href={productSourceUrl}
                data-mvp-event="hero_cta_click"
                className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-base font-bold text-white transition hover:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-700 focus:ring-offset-2"
              >
                {product.primaryCta}
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </a>

              <div className="mt-4 grid gap-2 text-xs text-slate-600 sm:grid-cols-3">
                <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-amber-500" aria-hidden="true" />리뷰 {product.reviewCount}건</span>
                <span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-sky-700" aria-hidden="true" />7만원 이상 무료배송</span>
                <span className="flex items-center gap-1.5"><RotateCcw className="h-4 w-4 text-emerald-700" aria-hidden="true" />수령 후 7일 이내</span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative mx-auto aspect-square max-w-2xl overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_24px_70px_rgba(15,23,42,0.13)]">
              <img
                src={productImageUrl}
                alt="화이트 컬러의 마리엔젤 mnl 하트-아이스 냉감패드 상품 이미지"
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/92 p-4 shadow-lg backdrop-blur">
                <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Snowflake className="h-5 w-5 text-sky-700" aria-hidden="true" />
                  냉감패드 선택에서 먼저 볼 기준
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-600">침대 사이즈 · 필요한 구성 · 고정 방식 · 배송 및 교환 조건</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="use-case-title" className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-sky-700">10초 사용 상황 확인</p>
            <h2 id="use-case-title" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">이런 경우에 먼저 비교해 보세요</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { icon: Snowflake, title: "밤에 침대 열감이 신경 쓰일 때", body: "공개 리뷰에서 닿을 때의 시원함과 촉감이 반복적으로 언급됩니다." },
              { icon: Heart, title: "기능뿐 아니라 침실 디자인도 볼 때", body: "화이트 컬러와 하트 누빔 패턴이 제품 선택 이유로 확인됩니다." },
              { icon: PackageCheck, title: "패드부터 여름이불까지 함께 맞출 때", body: "SS·Q·K별 패드 단품, 베개시트, 냉감이불 포함 구성을 선택할 수 있습니다." }
            ].map(({ icon: Icon, title, body }) => (
              <article key={title} className="rounded-2xl border border-stone-200 bg-[#fbfaf8] p-6">
                <Icon className="h-7 w-7 text-sky-700" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="comparison" aria-labelledby="comparison-title" className="border-y border-stone-200 bg-[#f5f1eb] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-sky-700">비교 후보와 볼 선택 기준</p>
              <h2 id="comparison-title" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">비슷해 보여도 확인할 항목은 다릅니다</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">마틸라 비교 후보는 사용자가 직접 입력한 참고값이며 실제 시장 1위 확정 데이터가 아닙니다.</p>
            </div>
            <span className="w-fit rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">비교 후보 데이터 재검증 필요</span>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="hidden grid-cols-[0.7fr_1.15fr_1.15fr] bg-slate-950 px-6 py-4 text-sm font-semibold text-white md:grid">
              <span>비교 기준</span><span>마리엔젤 하트-아이스</span><span>비교 후보</span>
            </div>
            <div className="divide-y divide-stone-200">
              {comparisonRows.map((row) => (
                <article key={row.criterion} className="grid gap-3 p-5 md:grid-cols-[0.7fr_1.15fr_1.15fr] md:gap-6 md:px-6">
                  <h3 className="font-bold text-slate-950">{row.criterion}</h3>
                  <div>
                    <p className="text-sm leading-6 text-slate-700">{row.ours}</p>
                    <span className="mt-2 inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">공식 페이지 확인</span>
                  </div>
                  <div>
                    <p className="text-sm leading-6 text-slate-700">{row.benchmark}</p>
                    <span className="mt-2 inline-block rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">{row.benchmarkStatus}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="option-guide" aria-labelledby="option-guide-title" className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-sky-700">옵션 선택 가이드</p>
            <h2 id="option-guide-title" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">사이즈를 고르고, 필요한 침구 범위를 선택하세요</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">옵션별 추가금과 정확한 규격은 공식 주문 화면에서 최종 확인해야 합니다.</p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {(["SS", "Q", "K"] as const).map((size) => (
              <section key={size} aria-labelledby={`size-${size}`} className="rounded-2xl border border-stone-200 bg-[#fbfaf8] p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 id={`size-${size}`} className="text-2xl font-black text-slate-950">{size}</h3>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">사이즈명 기준</span>
                </div>
                <div className="mt-5 space-y-3">
                  {productOptions.filter((option) => option.size === size).map((option) => {
                    const selected = selectedOptionId === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedOptionId(option.id)}
                        aria-pressed={selected}
                        className={`w-full rounded-xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
                          selected ? "border-sky-700 bg-sky-50 shadow-sm" : "border-stone-200 bg-white hover:border-slate-400"
                        }`}
                      >
                        <span className="flex items-center justify-between gap-3">
                          <strong className="text-sm text-slate-950">{option.configuration}</strong>
                          {selected ? <Check className="h-4 w-4 shrink-0 text-sky-700" aria-hidden="true" /> : null}
                        </span>
                        <span className="mt-2 block text-xs leading-5 text-slate-600">{option.included}</span>
                        <span className="mt-2 block text-xs font-medium text-amber-700">{option.priceNote}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-slate-950 p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] text-sky-300">현재 선택</p>
              <p className="mt-2 text-lg font-bold">{selectedOption.label}</p>
              <p className="mt-1 text-sm leading-6 text-slate-300">{selectedOption.recommendation}</p>
            </div>
            <a
              href={productSourceUrl}
              data-mvp-event="middle_cta_click"
              className="mt-5 inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-950 sm:mt-0 sm:w-auto"
            >
              {product.primaryCta}<ChevronRight className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section aria-labelledby="review-title" className="border-y border-stone-200 bg-[#f8fbfd] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-sky-700">공개 리뷰 요약</p>
            <h2 id="review-title" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">리뷰 {product.reviewCount}건에서 확인되는 선택 이유</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">후기 표현을 요약한 내용이며, 개인의 사용 환경에 따라 체감은 다를 수 있습니다.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {reviewSignals.map((signal, index) => (
              <article key={signal.title} className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-700" aria-label="공개 리뷰에서 확인된 주요 표현">
                  <Star className="h-4 w-4 text-amber-500" aria-hidden="true" />
                  공개 리뷰 키워드
                </div>
                <p className="mt-4 text-xs font-semibold text-sky-700">REVIEW SIGNAL {index + 1}</p>
                <h3 className="mt-2 text-lg font-bold">{signal.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{signal.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="assurance-title" className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-sky-700">구매 직전 확인</p>
            <h2 id="assurance-title" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">배송·교환 기준을 구매 버튼 가까이에서 확인하세요</h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Truck, title: "배송비", body: `${formatWon(product.shippingFee)} · ${formatWon(product.freeShippingThreshold)} 이상 무료` },
              { icon: Clock3, title: "배송 기간", body: product.shippingPeriod },
              { icon: RotateCcw, title: "교환·반품", body: `${product.returnWindow} · ${product.returnCondition}` },
              { icon: ShieldCheck, title: "최종 확인", body: "옵션 추가금·쿠폰·발송일은 주문서에서 확인" }
            ].map(({ icon: Icon, title, body }) => (
              <article key={title} className="rounded-2xl border border-stone-200 p-5">
                <Icon className="h-6 w-6 text-sky-700" aria-hidden="true" />
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
            도서·산간 지역 추가 배송비, 세부 반품 비용, 프로모션 종료일은 운영자 확인이 필요합니다.
          </p>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="border-t border-stone-200 bg-[#fbfaf8] py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold text-sky-700">FAQ</p>
            <h2 id="faq-title" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">구매 전 자주 확인하는 질문</h2>
          </div>
          <div className="mt-8 divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white px-5 sm:px-7">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
                  {faq.question}
                  <span className="text-xl text-slate-400 transition group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 pr-8 text-sm leading-7 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="final-cta-title" className="bg-sky-950 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Snowflake className="mx-auto h-9 w-9 text-sky-300" aria-hidden="true" />
          <h2 id="final-cta-title" className="mt-4 text-2xl font-bold tracking-tight sm:text-4xl">내 침대에 맞는 구성을 확인했다면</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-sky-100 sm:text-base">선택한 옵션의 추가금, 할인 적용 조건, 실제 발송 예정일을 공식 주문 화면에서 마지막으로 확인하세요.</p>
          <a
            href={productSourceUrl}
            data-mvp-event="bottom_cta_click"
            className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-white px-6 text-base font-bold text-slate-950 transition hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-950 sm:w-auto"
          >
            {product.primaryCta}<ChevronRight className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-200 bg-white/95 p-3 shadow-[0_-10px_30px_rgba(15,23,42,0.12)] backdrop-blur sm:hidden">
        <a
          href={productSourceUrl}
          data-mvp-event="mobile_sticky_cta_click"
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2"
        >
          {product.primaryCta}<ChevronRight className="h-5 w-5" aria-hidden="true" />
        </a>
      </div>
    </main>
  );
}
