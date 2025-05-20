import { Search, Database, BarChart4, Users } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: <Search className="h-10 w-10 text-orange-500" />,
      title: "Dataset Exploration",
      description: "Browse and search through thousands of public datasets from Hugging Face.",
    },
    {
      icon: <Database className="h-10 w-10 text-orange-500" />,
      title: "Dataset Combination",
      description: "Combine multiple datasets to create custom datasets for your AI models.",
    },
    {
      icon: <BarChart4 className="h-10 w-10 text-orange-500" />,
      title: "Impact Assessment",
      description: "Analyze the potential impact of datasets on your AI systems with advanced metrics.",
    },
    {
      icon: <Users className="h-10 w-10 text-orange-500" />,
      title: "Collaboration",
      description: "Follow datasets and share insights with your team to improve your AI models.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Powerful Features</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform provides everything you need to explore and leverage Hugging Face datasets for your AI
              systems.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              {feature.icon}
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-gray-500 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
