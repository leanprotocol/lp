import GetStartedPage from "@/components/get-started/get-started-page";
import { Header } from "@/components/header";
import Footer from "@/components/footer";

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <GetStartedPage />
      <Footer />
    </main>
  );
}