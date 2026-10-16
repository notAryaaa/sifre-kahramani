import type { Metadata } from "next";
import { Header } from "@/components/sifre/Header";
import { Footer } from "@/components/sifre/Footer";
import { ResultsBoard } from "@/components/sifre/ResultsBoard";

export const metadata: Metadata = {
  title: "Sonuçlar — Şifre Kahramanı",
  robots: { index: false, follow: false },
};

export default function ResultsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <ResultsBoard />
      </main>
      <Footer />
    </>
  );
}
