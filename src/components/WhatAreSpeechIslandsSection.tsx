export function WhatAreSpeechIslandsSection() {
  return (
    <section className="py-16 bg-accent/10">
      <div className="container px-8 md:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl text-balance font-semibold mb-6">
            What are Speech Islands?
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Speech Islands are focused conversation scenarios that help you
            master real-world situations. Watch this quick explanation to see
            how this revolutionary approach transforms language learning.
          </p>
          <div className="relative w-full max-w-3xl mx-auto">
            <div className="relative pb-[56.25%] h-0 rounded-xl overflow-hidden shadow-2xl">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/_g1s25Zmp3w"
                title="What are Speech Islands?"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-8 max-w-2xl mx-auto">
            Instead of memorizing random vocabulary, Speech Islands help you
            learn complete conversation flows for specific situations—like
            ordering at a restaurant, asking for directions, or booking a
            hotel.
          </p>
        </div>
      </div>
    </section>
  );
}