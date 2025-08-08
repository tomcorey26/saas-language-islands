import { WhatAreSpeechIslandsSection } from "@/components/WhatAreSpeechIslandsSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { TryItOutDemo } from "@/components/TryItOutDemo";
import { DemoErrorBoundary } from "@/components/DemoErrorBoundary";

// TODO: add example of flashcards generated

export default function Home() {
  return (
    <>
      <DemoErrorBoundary>
        <TryItOutDemo />
      </DemoErrorBoundary>
      <WhatAreSpeechIslandsSection />
      <FeaturesSection />
      <TestimonialsSection />
      {/* <section className="bg-primary text-primary-foreground">
        <div className="container py-16 flex flex-col gap-16 px-8 md:px-16">
          <h2 className="text-3xl text-center text-balance">
            Trusted by the top modern companies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-16">
            <Link href="https://clerk.com/">
              <ClerkIcon />
            </Link>
            <Link href="https://clerk.com/">
              <ClerkIcon />
            </Link>
            <Link href="https://clerk.com/">
              <ClerkIcon />
            </Link>
            <Link href="https://clerk.com/">
              <ClerkIcon />
            </Link>
            <Link href="https://clerk.com/">
              <ClerkIcon />
            </Link>
            <Link href="https://clerk.com/">
              <ClerkIcon />
            </Link>
            <Link href="https://clerk.com/">
              <ClerkIcon />
            </Link>
            <Link href="https://clerk.com/">
              <ClerkIcon />
            </Link>
            <Link href="https://clerk.com/">
              <ClerkIcon />
            </Link>
            <Link className="md:max-xl:hidden" href="https://clerk.com/">
              <ClerkIcon />
            </Link>
          </div>
        </div>
      </section> 
      
      <section id="pricing" className="px-8 py-16 bg-accent/5">
        <h2 className="text-4xl text-center text-balance font-semibold mb-8">
          Save time and money from expensive tutors and courses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-screen-xl mx-auto">
          {subscriptionTiersInOrder.map((tier) => (
            <PricingCard {...tier} key={tier.name} />
          ))}
        </div>
      </section>
      */}
    </>
  );
}

// function PricingCard({
//   name,
//   creditCount: generationCount,
//   priceInCents,
//   maxNumberOfLanguages,
//   canAccessCommunityFlashCards,
//   canSaveFlashcards,
//   canAccessMemorizationPractice,
//   canDownloadAudio,
// }: (typeof subscriptionTiersInOrder)[number]) {
//   const isMostPopular = name === "1K tokens";

//   const description =
//     generationCount === Infinity
//       ? "Unlimited flashcards generations"
//       : `${formatCompactNumber(generationCount)} flashcard generations`;

//   return (
//     <Card>
//       <CardHeader>
//         <div className="text-accent font-semibold mb-8">{name}</div>
//         <CardTitle className="text-xl font-bold">
//           ${priceInCents / 100}
//         </CardTitle>
//         <CardDescription>{description}</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <SignUpButton>
//           <Button
//             className={`text-lg w-full rounded-lg ${
//               isMostPopular
//                 ? "bg-gradient-to-r from-blue-800 to-teal-500 border-0 text-white hover:from-blue-900 hover:to-teal-600 shadow-lg"
//                 : ""
//             }`}
//             variant={isMostPopular ? "default" : "default"}
//           >
//             Get started
//           </Button>
//         </SignUpButton>
//       </CardContent>
//       <CardFooter className="flex flex-col gap-4 items-start">
//         <Feature className="font-bold">
//           {maxNumberOfLanguages === Infinity
//             ? "Unlimited languages"
//             : `${maxNumberOfLanguages} language${
//                 maxNumberOfLanguages > 1 ? "s" : ""
//               }`}
//         </Feature>
//         {canAccessMemorizationPractice && (
//           <Feature>Spaced Repetition Drills</Feature>
//         )}
//         {canDownloadAudio && <Feature>Download audio</Feature>}
//         {canSaveFlashcards && <Feature>Save and export flashcards</Feature>}
//         {canAccessCommunityFlashCards && (
//           <Feature>Community flashcards</Feature>
//         )}
//       </CardFooter>
//     </Card>
//   );
// }

// function Feature({
//   children,
//   className,
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) {
//   return (
//     <div className={cn("flex items-center gap-2", className)}>
//       <CheckIcon className="size-4 stroke-accent bg-accent/25 p-0.5 rounded-full" />
//       <span>{children}</span>
//     </div>
//   );
// }
