// import { Demo } from './_components/demo'
// import { Footer } from './_components/footer'
import CTA from './_components/cta'
import DemoSection from './_components/demo-section'
import FAQ from './_components/faq'
import Features from './_components/features'
import Footer from './_components/footer'
import HeaderHero from './_components/HeaderHero'
import Testimonials from './_components/testimonials'
// import { Heading } from './_components/heading'
// import { Testimonials } from './_components/testimonials'
import TrustedBy from './_components/trusted-by'

const MarketingPage = () => {
  return (
    // <div className="min-h-full flex flex-col dark:bg-[#1F1F1F]">
    //   <Heading />
    //   <Demo />
    //   <Testimonials />
    //   <Footer />
    // </div>
    <main className="min-h-screen flex flex-col bg-white">
      <HeaderHero />
      <TrustedBy />
      <Features />
      <Testimonials />
      <DemoSection />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}

export default MarketingPage
