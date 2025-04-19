import CTA from './_components/cta'
import DemoSection from './_components/demo-section'
import Features from './_components/features'
import Footer from './_components/footer'
import Hero from './_components/hero'
import Navbar from './_components/navbar'
import Testimonials from './_components/testimonials'
import TrustedBy from './_components/trusted-by'

const MarketingPage = () => {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <Testimonials />
      <DemoSection />
      {/* <FAQ /> */}
      <CTA />
      <Footer />
    </main>
  )
}

export default MarketingPage
