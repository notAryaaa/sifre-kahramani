import { Header } from "@/components/sifre/Header";
import { Hero } from "@/components/sifre/Hero";
import { PasswordLab } from "@/components/sifre/PasswordLab";
import { LearnSection } from "@/components/sifre/LearnSection";
import { Game } from "@/components/sifre/Game";
import { GoldenRules } from "@/components/sifre/GoldenRules";
import { Footer } from "@/components/sifre/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <PasswordLab />
        <LearnSection />
        <Game />
        <GoldenRules />
      </main>
      <Footer />
    </>
  );
}
