import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  withText?: boolean;
  size?: number;
}

export function BrandLogo({
  className = "",
  withText = false,
  size = 32,
}: BrandLogoProps) {
  return withText ? (
    <div className={`flex items-center gap-2 flex-shrink-0 ${className}`}>
      <Image
        src="/images/logo.webp"
        alt="Speech Islands"
        width={size}
        height={size}
        className="flex-shrink-0"
      />
      <span className="font-semibold text-lg">Speech Islands</span>
    </div>
  ) : (
    <Image
      src="/images/logo.webp"
      alt="Speech Islands"
      width={size}
      height={size}
      className="flex-shrink-0"
    />
  );
}
