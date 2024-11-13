import Image from "next/image";

export function BrandLogo() {
  return (
    <span className="flex items-center gap-2 font-semibold flex-shrink-0 mr-auto text-lg">
      <Image src="/images/logo.webp" alt="logo" width={100} height={100} />
      <span>Language Islands</span>
    </span>
  );
}
