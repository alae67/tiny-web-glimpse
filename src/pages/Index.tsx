
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="py-12 md:py-20 text-center">
          <div className="space-y-6 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 animate-fade-in">
              Welcome to Your Simple Page
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A clean, minimal design to showcase your content beautifully.
              Start building your amazing project with this foundation.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Button size="lg" className="transition-all hover:scale-105">
                Get Started
              </Button>
              <Button variant="outline" size="lg" className="transition-all hover:scale-105">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Simple Design",
                description: "Clean and minimal design that focuses on your content."
              },
              {
                title: "Responsive",
                description: "Looks great on any device - mobile, tablet, or desktop."
              },
              {
                title: "Customizable",
                description: "Easy to customize and extend with your own components."
              }
            ].map((feature, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="gap-2">
                    Learn more <ArrowRight size={16} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
            <p className="text-gray-600 text-lg">
              Join thousands of users who are already using our platform 
              to build amazing projects.
            </p>
            <Button size="lg" className="transition-all hover:scale-105">
              Sign Up Now
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 mt-12 border-t border-gray-200 text-center text-gray-600">
          <p>© 2025 Your Company. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
