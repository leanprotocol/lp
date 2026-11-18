import GetStartedPage from "@/components/get-started/get-started-page";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import type { Metadata } from "next";

// An older page that is no longer in the menu. Kept reachable by link, hidden from search.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <GetStartedPage />
      <Footer />
    </main>
  );
}