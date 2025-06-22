import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header/Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Transforming Education Through Technology
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white text-opacity-90">
              M4T is on a mission to make high-quality education accessible to everyone, everywhere.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex items-center gap-12">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-6 text-neutral-dark">Our Story</h2>
              <p className="text-neutral-medium mb-4">
                Founded in 2020, M4T began with a simple idea: learning should be accessible, engaging, and tailored to each individual's needs. What started as a small team of passionate educators and technologists has grown into a global platform serving millions of learners.
              </p>
              <p className="text-neutral-medium mb-4">
                Our journey has been driven by a commitment to innovation in education technology. We pioneered the use of adaptive learning algorithms, gamification, and personalized learning paths to make education more effective and enjoyable.
              </p>
              <p className="text-neutral-medium">
                Today, we partner with industry-leading experts, companies, and educational institutions to deliver cutting-edge content that prepares learners for the challenges of the modern workplace.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400" 
                    alt="Team collaboration" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md mt-8">
                  <img 
                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400" 
                    alt="Office space" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400" 
                    alt="Product development" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md mt-8">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400" 
                    alt="Team meeting" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Values Section */}
      <div className="py-16 md:py-20 bg-neutral-lighter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission & Values</h2>
            <p className="text-lg text-neutral-medium max-w-3xl mx-auto">
              We're driven by a core set of principles that guide everything we do.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary-light bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-lightbulb text-primary text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-neutral-medium">
                We continuously push the boundaries of what's possible in education technology, developing new ways to make learning more effective and engaging.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary-light bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-users text-primary text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Inclusivity</h3>
              <p className="text-neutral-medium">
                We believe education should be accessible to everyone, regardless of background, location, or circumstances. We design our platform to accommodate diverse learning needs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary-light bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-chart-line text-primary text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Impact</h3>
              <p className="text-neutral-medium">
                We measure our success by the tangible difference we make in our learners' lives, helping them achieve their career goals and personal aspirations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership Team Section */}
      <div className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Leadership Team</h2>
            <p className="text-lg text-neutral-medium max-w-3xl mx-auto">
              Meet the passionate individuals guiding our mission.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300"
                  alt="Sarah Johnson"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">Sarah Johnson</h3>
              <p className="text-primary font-medium mb-2">CEO & Co-Founder</p>
              <p className="text-neutral-medium text-sm">
                Former education technology executive with 15+ years experience transforming how people learn.
              </p>
            </div>

            <div className="text-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300"
                  alt="Michael Chen"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">Michael Chen</h3>
              <p className="text-primary font-medium mb-2">CTO & Co-Founder</p>
              <p className="text-neutral-medium text-sm">
                AI and machine learning expert focused on creating adaptive learning technology.
              </p>
            </div>

            <div className="text-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300"
                  alt="Elena Rodriguez"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">Elena Rodriguez</h3>
              <p className="text-primary font-medium mb-2">Chief Learning Officer</p>
              <p className="text-neutral-medium text-sm">
                PhD in Educational Psychology with expertise in curriculum design and learning outcomes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300"
                  alt="James Wilson"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">James Wilson</h3>
              <p className="text-primary font-medium mb-2">Chief Product Officer</p>
              <p className="text-neutral-medium text-sm">
                Former Silicon Valley product leader specializing in user experience and product innovation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Join Us CTA Section */}
      <div className="py-16 md:py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Us on Our Mission</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Whether you're a learner, educator, or organization, be part of our journey to transform education.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/courses">
              <Button size="lg" className="bg-white text-primary hover:bg-neutral-lighter">
                Explore Courses
              </Button>
            </Link>
            <Link href="/careers">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-primary-dark">
                Join Our Team
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-primary-dark">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
