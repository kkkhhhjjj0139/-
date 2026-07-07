import Script from "next/script";
import { faqs, product, productImageUrl, productSourceUrl } from "@/components/product/mariangel-heart-ice-data";

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.fullName,
  image: [productImageUrl],
  category: product.category,
  brand: { "@type": "Brand", name: product.brand },
  offers: {
    "@type": "Offer",
    url: productSourceUrl,
    priceCurrency: "KRW",
    price: product.salePrice,
    seller: { "@type": "Organization", name: `${product.brand} 공식몰` }
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer }
  }))
};

export default function MariangelStructuredData() {
  return (
    <>
      <Script id="mariangel-product-schema" type="application/ld+json">{JSON.stringify(productSchema)}</Script>
      <Script id="mariangel-faq-schema" type="application/ld+json">{JSON.stringify(faqSchema)}</Script>
    </>
  );
}
