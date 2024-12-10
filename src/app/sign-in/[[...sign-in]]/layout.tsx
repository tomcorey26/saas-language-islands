import React from "react";

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="text-center">{children}</div>
    </div>
  );
}
