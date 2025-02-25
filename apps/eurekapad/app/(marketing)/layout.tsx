const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    // <div className="dark:bg-[#1F1F1F]">
    //   <Navbar />
    //   <main>{children}</main>
    // </div>
    <div className="bg-white text-black">{children}</div>
  )
}

export default MarketingLayout
