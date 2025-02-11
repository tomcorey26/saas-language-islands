export default function FlashCardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6`}
    >
      {children}
    </div>
  );
}
