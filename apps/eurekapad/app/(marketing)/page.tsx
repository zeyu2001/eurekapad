import { Demo } from './_components/demo'
import { Footer } from './_components/footer'
import { Heading } from './_components/heading'
import { Testimonials } from './_components/testimonials'

const MarketingPage = () => {
  return (
    <div className="flex min-h-full flex-col dark:bg-[#1F1F1F]">
      <Heading />
      <Demo />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default MarketingPage
