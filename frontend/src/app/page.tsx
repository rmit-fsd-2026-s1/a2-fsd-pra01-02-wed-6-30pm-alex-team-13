import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import InfoSection from "@/components/InfoSection";

export default function Home() {
  return (
    <>
      <Header />
      <Navbar />

      <main className="page-shell">
        
        <section className="glass-card p-8 mb-8">
          <h2 className="text-3xl font-bold text-black">
            Welcome to Venue Vendors
          </h2>
          <p className="mt-4 text-black leading-7">
            Venue Vendors is a web system designed to help hiring applicants and
            vendors manage event venue applications in a fast, simple, and
            professional way.
          </p>
        </section>
        <br /><br />
        <HeroSection />
        <InfoSection />
      </main>

      <Footer />
    </>
  );
}