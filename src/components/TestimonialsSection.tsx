import Image from "next/image";

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container px-8 md:px-16">
        <h2 className="text-4xl text-center text-balance font-semibold mb-16">
          What our learners are saying
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
              <div className="relative w-80 h-96 rounded-2xl overflow-hidden">
                <Image
                  src="/images/testimonial-person.webp"
                  alt="Tom Corey, Spanish language learner"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-6">
              <blockquote className="text-lg text-muted-foreground leading-relaxed">
                I had 2 months to prepare for my solo backpacking trip through
                Spain. I needed to learn practical Spanish fast - ordering
                food, asking for directions, booking hostels, and having real
                conversations with locals.
                <br />
                <br />
                These flashcards were perfect because I could focus on exactly
                what I&apos;d need while traveling. Way more effective than
                generic textbook phrases. My trip was incredible and I felt
                confident speaking Spanish!
              </blockquote>
              <div className="space-y-1">
                <div className="font-semibold text-foreground">Tom Corey</div>
                <div className="text-sm text-muted-foreground">
                  Spanish student 🇪🇸 (B1)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}