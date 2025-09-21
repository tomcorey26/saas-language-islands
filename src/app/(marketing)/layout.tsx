import { NavBar } from "@/app/(marketing)/_components/Navbar";
import { Footer } from "@/components/Footer";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="selection:bg-[hsl(320,65%, 52%, 20%)]">
      <NavBar />
      {children}
      <Footer />
    </div>
  );
}
