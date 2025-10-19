const steps = [
  {
    number: 1,
    title: "Submit Your Release",
    description: "Post your press release, add company information, and choose necessary categories with our simple online form."
  },
  {
    number: 2,
    title: "Review & Approval",
    description: "Our editorial team promptly checks your work for clarity, formatting, and publishing standards."
  },
  {
    number: 3,
    title: "Publish & Distribute",
    description: "Your release goes live on News Today and is broadcast across our media network for extensive coverage."
  },
  {
    number: 4,
    title: "Track Performance",
    description: "Premium users access analytics on views, reach, and engagement to measure success."
  }
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Four simple steps to amplify your message
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
