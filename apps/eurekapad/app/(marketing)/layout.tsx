import { Navbar } from './_components/navbar'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark:bg-[#1F1F1F]">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}
