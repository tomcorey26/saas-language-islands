import { ClerkIcon } from '@/app/(marketing)/_icons/Clerk';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { subscriptionTiersInOrder } from '@/data/subscriptionTiers';
import { formatCompactNumber } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { SignUpButton } from '@clerk/nextjs';
import { ArrowRightIcon, CheckIcon } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  // text-balance makes the text break into even lines when the container is resized
  return (
    <>
      <section className="min-h-screen bg-[radial-gradient(hsl(180,72%,65%,40%),hsl(190,62%,73%,40%),hsl(var(--background))_60%)] flex items-center justify-center text-center text-balance flex-col gap-8 px-4">
        {/* Tracking makes the spacing closer between letters because in large font sizes it makes it easier to read */}
        <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight m-4">
          Welcome to Language Islands
        </h1>
        <p className="text-lg lg:text-3xl max-w-screen-xl">
          Generate flashcards to master real conversations faster than ever and
          become conversational in no time—start your language journey now!
        </p>
        <div className="flex flex-row gap-4">
          <Link href="/create">
            <Button
              variant="outline"
              className="text-lg p-6 rounded-xl flex gap-2"
            >
              Try it out
            </Button>
          </Link>
          <SignUpButton>
            <Button className="text-lg p-6 rounded-xl flex gap-2">
              Get started for free <ArrowRightIcon className="size-5" />
            </Button>
          </SignUpButton>
        </div>
      </section>
      <section className="bg-primary text-primary-foreground">
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-screen-xl mx-auto">
          {subscriptionTiersInOrder.map((tier) => (
            <PricingCard {...tier} key={tier.name} />
          ))}
        </div>
      </section>
    </>
  );
}

function PricingCard({
  name,
  maxNumberOfGenerationsPerMonth,
  priceInCents,
  maxNumberOfLanguages,
  canAccessCommunityFlashCards,
  canSaveFlashcards,
  canAccessMemorizationPractice,
  canDownloadAudio,
}: (typeof subscriptionTiersInOrder)[number]) {
  const isMostPopular = name === 'Pro';

  return (
    <Card>
      <CardHeader>
        <div className="text-accent font-semibold mb-8">{name}</div>
        <CardTitle className="text-xl font-bold">
          ${priceInCents / 100} /mo
        </CardTitle>
        <CardDescription>
          {formatCompactNumber(maxNumberOfGenerationsPerMonth)} flashcards
          generations a month{' '}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpButton>
          <Button
            className="text-lg w-full rounded-lg"
            variant={isMostPopular ? 'accent' : 'default'}
          >
            Get started
          </Button>
        </SignUpButton>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 items-start">
        <Feature className="font-bold">
          {maxNumberOfLanguages === Infinity
            ? 'Unlimited languages'
            : `${maxNumberOfLanguages} language${
                maxNumberOfLanguages > 1 ? 's' : ''
              }`}
        </Feature>
        {canAccessMemorizationPractice && <Feature>Speaking Drills</Feature>}
        {canSaveFlashcards && <Feature>Save and export flashcards</Feature>}
        {canDownloadAudio && <Feature>Download audio</Feature>}
        {canAccessCommunityFlashCards && (
          <Feature>Community flashcards</Feature>
        )}
      </CardFooter>
    </Card>
  );
}

function Feature({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <CheckIcon className="size-4 stroke-accent bg-accent/25 p-0.5 rounded-full" />
      <span>{children}</span>
    </div>
  );
}
