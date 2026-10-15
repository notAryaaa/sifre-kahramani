import { Header } from "@/components/sifre/Header";
import { Journey } from "@/components/sifre/Journey";
import { Footer } from "@/components/sifre/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Journey />
      </main>
      <Footer />
    </>
  );
}
