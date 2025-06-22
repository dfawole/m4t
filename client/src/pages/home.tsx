import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = 6; // Total number of course cards
  const sliderRef = useRef<HTMLDivElement>(null);

  // Slide control functions
  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update scroll position when activeSlide changes
  useEffect(() => {
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.clientWidth / Math.min(3, totalSlides);
      sliderRef.current.scrollTo({
        left: activeSlide * slideWidth,
        behavior: 'smooth',
      });
    }
  }, [activeSlide]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="md:flex md:items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Advance Your Career with Professional Learning
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white text-opacity-90">
                Access thousands of courses taught by industry experts and take your professional skills to the next level.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/courses">
                  <Button size="lg" className="bg-white text-primary hover:bg-neutral-lighter">
                    Explore Courses
                  </Button>
                </Link>
                {!isAuthenticated && (
                  <a href="/api/login">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-white text-white hover:bg-primary-dark"
                    >
                      Get Started
                    </Button>
                  </a>
                )}
              </div>
            </div>
            <div className="md:w-1/2 md:pl-12">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&h=700" 
                  alt="Professional learning environment" 
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Learning Path Showcase */}
      <div className="py-12 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-purple-100 transform transition-all hover:scale-[1.01] duration-300">
            <div className="md:flex">
              <div className="md:w-1/2 p-8">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                    PERSONALIZED LEARNING
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                    UNLOCK ACHIEVEMENTS
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Your Unique Learning Adventure</h3>
                <p className="text-neutral-medium mb-6">
                  Discover your personalized learning path with interactive skill trees, achievement badges, and progress tracking. Our AI-powered system adapts to your learning style and pace.
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center space-x-1 text-sm text-neutral-medium">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span>Beginner-friendly</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-neutral-medium">
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <span>Intermediate</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-neutral-medium">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <span>Advanced</span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Link href="/course-skill-tree-demo">
                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      Explore 3D Skill Tree <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-700 p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="text-xl font-semibold mb-6">Earn as You Learn:</h4>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {/* Achievement Badges */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center transform transition-all hover:scale-105 hover:bg-white/20 cursor-pointer">
                      <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-award text-white text-xl"></i>
                      </div>
                      <span className="text-sm font-medium">First Course</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center transform transition-all hover:scale-105 hover:bg-white/20 cursor-pointer">
                      <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-fire-flame-curved text-white text-xl"></i>
                      </div>
                      <span className="text-sm font-medium">7-Day Streak</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center transform transition-all hover:scale-105 hover:bg-white/20 cursor-pointer">
                      <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-certificate text-white text-xl"></i>
                      </div>
                      <span className="text-sm font-medium">Quiz Master</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Current Level: 5</span>
                      <span className="text-sm font-medium">2,400 XP</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <div className="text-xs mt-1 text-white/80 text-right">Next level: 900 XP needed</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center border-2 border-white text-xs font-bold">JS</div>
                      <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center border-2 border-white text-xs font-bold">PY</div>
                      <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center border-2 border-white text-xs font-bold">DS</div>
                      <div className="w-8 h-8 rounded-full bg-indigo-400 flex items-center justify-center border-2 border-white text-xs font-bold">+4</div>
                    </div>
                    <span className="text-sm">Skills unlocked</span>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose M4T</h2>
            <p className="text-lg text-neutral-medium max-w-3xl mx-auto">
              Our platform offers a comprehensive learning experience designed for professionals like you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-light bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-laptop-code text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Industry-Relevant Skills</h3>
              <p className="text-neutral-medium">
                Learn skills that matter in today's workplace, taught by industry professionals.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-light bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-building-user text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Company Solutions</h3>
              <p className="text-neutral-medium">
                Tailored learning programs for organizations of all sizes with team management.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-light bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-medal text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Recognized Certificates</h3>
              <p className="text-neutral-medium">
                Earn certificates that showcase your expertise and boost your credentials.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Courses Section */}
      <div className="py-16 bg-neutral-lighter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Courses</h2>
            <Link href="/courses">
              <div className="text-primary hover:text-primary-dark font-medium flex items-center cursor-pointer">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </Link>
          </div>

          {/* Carousel slider container */}
          <div className="relative overflow-hidden">
            <div 
              ref={sliderRef}
              className="flex overflow-x-hidden scroll-smooth transition-all duration-300"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {/* Card 1 - Business */}
              <div className="min-w-[100%] md:min-w-[33.33%] px-2 scroll-snap-align-start">
                <Card className="overflow-hidden h-full">
                  <img 
                    className="h-48 w-full object-cover" 
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=300" 
                    alt="Business Strategy Fundamentals course"
                  />
                  <CardContent className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light bg-opacity-10 text-primary mb-2">
                      Business
                    </span>
                    <h3 className="text-lg font-semibold mb-1">Business Strategy Fundamentals</h3>
                    <p className="text-sm text-neutral-medium mb-4">
                      Learn the essentials of creating effective business strategies.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">6 hours</span>
                      <Link href="/courses/1">
                        <Button>View Course</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Card 2 - Technology */}
              <div className="min-w-[100%] md:min-w-[33.33%] px-2 scroll-snap-align-start">
                <Card className="overflow-hidden h-full">
                  <img 
                    className="h-48 w-full object-cover" 
                    src="https://images.unsplash.com/photo-1573167157471-1c7c8e02fef3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=300" 
                    alt="Data Analysis with Python course"
                  />
                  <CardContent className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary bg-opacity-10 text-secondary mb-2">
                      Technology
                    </span>
                    <h3 className="text-lg font-semibold mb-1">Data Analysis with Python</h3>
                    <p className="text-sm text-neutral-medium mb-4">
                      Master the fundamentals of data analysis using Python.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">8 hours</span>
                      <Link href="/courses/2">
                        <Button>View Course</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Card 3 - Design */}
              <div className="min-w-[100%] md:min-w-[33.33%] px-2 scroll-snap-align-start">
                <Card className="overflow-hidden h-full">
                  <img 
                    className="h-48 w-full object-cover" 
                    src="https://images.unsplash.com/photo-1517502884489-da1d46e8c020?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=300" 
                    alt="UX Design Principles course"
                  />
                  <CardContent className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-dark bg-opacity-10 text-primary-dark mb-2">
                      Design
                    </span>
                    <h3 className="text-lg font-semibold mb-1">UX Design Principles</h3>
                    <p className="text-sm text-neutral-medium mb-4">
                      Learn to create exceptional user experiences for digital products.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">10 hours</span>
                      <Link href="/courses/3">
                        <Button>View Course</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Card 4 - Marketing */}
              <div className="min-w-[100%] md:min-w-[33.33%] px-2 scroll-snap-align-start">
                <Card className="overflow-hidden h-full">
                  <img 
                    className="h-48 w-full object-cover" 
                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=300" 
                    alt="Digital Marketing Strategy course"
                  />
                  <CardContent className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400 bg-opacity-10 text-yellow-700 mb-2">
                      Marketing
                    </span>
                    <h3 className="text-lg font-semibold mb-1">Digital Marketing Strategy</h3>
                    <p className="text-sm text-neutral-medium mb-4">
                      Develop comprehensive digital marketing strategies that drive results.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">7 hours</span>
                      <Link href="/courses/4">
                        <Button>View Course</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Card 5 - Leadership */}
              <div className="min-w-[100%] md:min-w-[33.33%] px-2 scroll-snap-align-start">
                <Card className="overflow-hidden h-full">
                  <img 
                    className="h-48 w-full object-cover" 
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=300" 
                    alt="Leadership and Management course"
                  />
                  <CardContent className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-400 bg-opacity-10 text-blue-700 mb-2">
                      Leadership
                    </span>
                    <h3 className="text-lg font-semibold mb-1">Leadership and Management</h3>
                    <p className="text-sm text-neutral-medium mb-4">
                      Develop the skills to lead teams effectively in any organization.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">9 hours</span>
                      <Link href="/courses/5">
                        <Button>View Course</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Card 6 - Finance */}
              <div className="min-w-[100%] md:min-w-[33.33%] px-2 scroll-snap-align-start">
                <Card className="overflow-hidden h-full">
                  <img 
                    className="h-48 w-full object-cover" 
                    src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=300" 
                    alt="Financial Planning and Analysis course"
                  />
                  <CardContent className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400 bg-opacity-10 text-green-700 mb-2">
                      Finance
                    </span>
                    <h3 className="text-lg font-semibold mb-1">Financial Planning and Analysis</h3>
                    <p className="text-sm text-neutral-medium mb-4">
                      Master the essentials of financial planning for business success.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">11 hours</span>
                      <Link href="/courses/6">
                        <Button>View Course</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === activeSlide ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation arrows for larger screens */}
            <div className="hidden md:block">
              <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
                aria-label="Previous slide"
              >
                <i className="fa-solid fa-chevron-left text-primary"></i>
              </button>
              <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
                aria-label="Next slide"
              >
                <i className="fa-solid fa-chevron-right text-primary"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Advance Your Career?</h2>
          <p className="text-lg max-w-3xl mx-auto mb-8">
            Join thousands of professionals who are already learning and growing with M4T.
          </p>
          <Link href="/courses">
            <Button size="lg" className="bg-white text-primary hover:bg-neutral-lighter">
              Browse All Courses
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
