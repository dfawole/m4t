import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, Building, Clock, Globe, MapPin } from "lucide-react";

// Job listing type
type JobListing = {
  id: number;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  description: string;
  requirements: string[];
  posted: string;
};

// Sample job listings
const jobListings: JobListing[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "We're looking for a Senior Frontend Developer to join our team and help build engaging, responsive user interfaces for our educational platform. You'll be working closely with our design and backend teams to create seamless learning experiences.",
    requirements: [
      "5+ years of experience with React and modern JavaScript",
      "Experience with TypeScript, state management libraries, and CSS frameworks",
      "Strong understanding of web accessibility standards",
      "Excellent problem-solving skills and attention to detail",
      "Bachelor's degree in Computer Science or equivalent experience"
    ],
    posted: "May 10, 2025"
  },
  {
    id: 2,
    title: "Curriculum Developer - Data Science",
    department: "Education",
    location: "Remote",
    type: "Full-time",
    description: "Join our curriculum team to develop cutting-edge data science courses. You'll create comprehensive learning paths, design interactive exercises, and collaborate with subject matter experts to ensure content quality and relevance.",
    requirements: [
      "3+ years of practical experience in data science or related field",
      "Proficiency in Python, SQL, and data visualization tools",
      "Experience with machine learning frameworks and statistical analysis",
      "Strong written and verbal communication skills",
      "Teaching or instructional design experience preferred"
    ],
    posted: "May 15, 2025"
  },
  {
    id: 3,
    title: "UX/UI Designer",
    department: "Design",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "We're seeking a talented UX/UI Designer to help create intuitive, accessible, and visually appealing interfaces for our learning platform. You'll work on user research, wireframing, prototyping, and collaborating with our development team.",
    requirements: [
      "3+ years of experience in UX/UI design for web and mobile applications",
      "Proficiency in design tools such as Figma, Adobe XD, or Sketch",
      "Experience conducting user research and usability testing",
      "Strong portfolio demonstrating your design process and problem-solving skills",
      "Excellent communication and collaboration abilities"
    ],
    posted: "May 18, 2025"
  },
  {
    id: 4,
    title: "Product Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    description: "As a Product Marketing Manager, you'll develop and execute marketing strategies for our educational products. You'll work closely with product, sales, and creative teams to craft compelling messaging, create marketing materials, and drive user acquisition.",
    requirements: [
      "5+ years of experience in product marketing, preferably in EdTech or SaaS",
      "Proven track record in developing successful marketing campaigns",
      "Strong analytical skills and data-driven decision making",
      "Excellent communication and cross-functional collaboration abilities",
      "Bachelor's degree in Marketing, Business, or related field"
    ],
    posted: "May 20, 2025"
  },
  {
    id: 5,
    title: "Customer Success Specialist",
    department: "Customer Success",
    location: "New York, NY",
    type: "Full-time",
    description: "We're looking for a Customer Success Specialist to ensure our users get the most value from our platform. You'll onboard new customers, provide product training, address inquiries, and work proactively to increase user satisfaction and retention.",
    requirements: [
      "2+ years of experience in customer success, support, or account management",
      "Strong interpersonal and communication skills",
      "Problem-solving mindset and attention to detail",
      "Experience with CRM software and support tools",
      "Background in education or EdTech is a plus"
    ],
    posted: "May 22, 2025"
  },
  {
    id: 6,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Join our infrastructure team to build and maintain our cloud-based platform. You'll work on CI/CD pipelines, infrastructure automation, monitoring, and ensuring system reliability and performance as we scale.",
    requirements: [
      "3+ years of experience in DevOps or Site Reliability Engineering",
      "Proficiency with cloud platforms (AWS, Azure, or GCP)",
      "Experience with containerization, Kubernetes, and infrastructure as code",
      "Strong knowledge of Linux systems and scripting",
      "Background in monitoring, logging, and security best practices"
    ],
    posted: "May 23, 2025"
  }
];

// Department filter options
const departments = ["All Departments", "Engineering", "Education", "Design", "Marketing", "Customer Success"];

// Location filter options
const locations = ["All Locations", "San Francisco, CA", "New York, NY", "Remote"];

export default function Careers() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header/Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Join Our Mission to Transform Education
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white text-opacity-90">
              Be part of a team that's building the future of learning. We're looking for passionate individuals who share our vision.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-neutral-lighter"
              onClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Open Positions
            </Button>
          </div>
        </div>
      </div>

      {/* Why Join Us Section */}
      <div className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Join M4T?</h2>
            <p className="text-lg text-neutral-medium max-w-3xl mx-auto">
              We're building something special, and we want you to be part of it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-neutral-lighter hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-light bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-lightbulb text-primary text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Meaningful Impact</h3>
              <p className="text-neutral-medium">
                Your work will directly help millions of learners develop new skills and advance their careers. We're transforming lives through education.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-neutral-lighter hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-light bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-chart-line text-primary text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Growth & Innovation</h3>
              <p className="text-neutral-medium">
                We're at the forefront of educational technology, constantly pushing boundaries and exploring new ways to enhance learning experiences.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-neutral-lighter hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-light bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-users text-primary text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Collaborative Culture</h3>
              <p className="text-neutral-medium">
                Join a diverse team of passionate professionals who value collaboration, creativity, and continuous learning.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 md:py-20 bg-neutral-lighter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Benefits & Perks</h2>
            <p className="text-lg text-neutral-medium max-w-3xl mx-auto">
              We take care of our team so they can focus on doing their best work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-light bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-heart-pulse text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Comprehensive Healthcare</h3>
              <p className="text-neutral-medium">
                Medical, dental, and vision coverage for you and your dependents.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-light bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-umbrella-beach text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Time Off</h3>
              <p className="text-neutral-medium">
                Generous PTO policy, paid holidays, and parental leave.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-light bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-graduation-cap text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Learning Stipend</h3>
              <p className="text-neutral-medium">
                Annual budget for courses, books, and conferences.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-light bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-laptop-house text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Remote-Friendly</h3>
              <p className="text-neutral-medium">
                Flexible work arrangements and home office stipend.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-light bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-piggy-bank text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">401(k) Matching</h3>
              <p className="text-neutral-medium">
                Competitive retirement plan with company matching.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-light bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-hand-holding-heart text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Wellness Programs</h3>
              <p className="text-neutral-medium">
                Mental health resources and fitness reimbursements.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-light bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-users-between-lines text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Team Events</h3>
              <p className="text-neutral-medium">
                Regular team-building activities and company retreats.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-light bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-handshake-angle text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Volunteer Time</h3>
              <p className="text-neutral-medium">
                Paid time off for volunteering and community service.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Open Positions Section */}
      <div id="open-positions" className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
            <p className="text-lg text-neutral-medium max-w-3xl mx-auto">
              Find your perfect role and join our team
            </p>
          </div>

          <Tabs defaultValue="All Departments" className="w-full">
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">Filter by Department</h3>
              <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {departments.map((dept) => (
                  <TabsTrigger key={dept} value={dept} className="text-sm">
                    {dept}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {departments.map((dept) => (
              <TabsContent key={dept} value={dept} className="mt-0">
                <div className="grid grid-cols-1 gap-6">
                  {jobListings
                    .filter(job => dept === "All Departments" || job.department === dept)
                    .map(job => (
                      <Card key={job.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-xl text-primary">{job.title}</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-neutral-medium">
                              <Clock className="h-4 w-4" />
                              <span>Posted {job.posted}</span>
                            </div>
                          </div>
                          <CardDescription className="flex flex-wrap gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <Building className="h-4 w-4 text-neutral-medium" />
                              {job.department}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-neutral-medium" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Globe className="h-4 w-4 text-neutral-medium" />
                              {job.type}
                            </span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <p className="text-neutral-medium">{job.description}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Requirements:</h4>
                            <ul className="list-disc pl-5 space-y-1 text-neutral-medium">
                              {job.requirements.map((req, idx) => (
                                <li key={idx}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4">
                          <Button className="w-full sm:w-auto bg-primary hover:bg-primary-dark">
                            Apply Now <ArrowUpRight className="ml-1 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* Our Hiring Process Section */}
      <div className="py-16 md:py-20 bg-neutral-lighter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Hiring Process</h2>
            <p className="text-lg text-neutral-medium max-w-3xl mx-auto">
              What to expect when you apply to join our team
            </p>
          </div>

          <div className="relative">
            {/* Timeline connecting line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-light hidden md:block"></div>
            
            {/* Process steps */}
            <div className="space-y-12 relative">
              <div className="md:flex items-center">
                <div className="md:w-1/2 pr-8 text-right hidden md:block">
                  <h3 className="text-xl font-semibold mb-2">Application Review</h3>
                  <p className="text-neutral-medium">
                    Our hiring team carefully reviews your application and resume to assess your qualifications and experience.
                  </p>
                </div>
                <div className="md:w-16 mx-auto flex justify-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center relative z-10 shadow-lg">
                    <span className="text-xl font-bold">1</span>
                  </div>
                </div>
                <div className="md:w-1/2 pl-8 md:hidden mt-4">
                  <h3 className="text-xl font-semibold mb-2">Application Review</h3>
                  <p className="text-neutral-medium">
                    Our hiring team carefully reviews your application and resume to assess your qualifications and experience.
                  </p>
                </div>
              </div>

              <div className="md:flex items-center">
                <div className="md:w-1/2 pr-8 text-right md:hidden">
                  <h3 className="text-xl font-semibold mb-2">Initial Interview</h3>
                  <p className="text-neutral-medium">
                    A video call with a member of our hiring team to discuss your background, experience, and interest in the role.
                  </p>
                </div>
                <div className="md:w-16 mx-auto flex justify-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center relative z-10 shadow-lg">
                    <span className="text-xl font-bold">2</span>
                  </div>
                </div>
                <div className="md:w-1/2 pl-8 hidden md:block mt-4">
                  <h3 className="text-xl font-semibold mb-2">Initial Interview</h3>
                  <p className="text-neutral-medium">
                    A video call with a member of our hiring team to discuss your background, experience, and interest in the role.
                  </p>
                </div>
              </div>

              <div className="md:flex items-center">
                <div className="md:w-1/2 pr-8 text-right hidden md:block">
                  <h3 className="text-xl font-semibold mb-2">Skills Assessment</h3>
                  <p className="text-neutral-medium">
                    Depending on the role, you may be asked to complete a practical assessment or project to demonstrate your skills.
                  </p>
                </div>
                <div className="md:w-16 mx-auto flex justify-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center relative z-10 shadow-lg">
                    <span className="text-xl font-bold">3</span>
                  </div>
                </div>
                <div className="md:w-1/2 pl-8 md:hidden mt-4">
                  <h3 className="text-xl font-semibold mb-2">Skills Assessment</h3>
                  <p className="text-neutral-medium">
                    Depending on the role, you may be asked to complete a practical assessment or project to demonstrate your skills.
                  </p>
                </div>
              </div>

              <div className="md:flex items-center">
                <div className="md:w-1/2 pr-8 text-right md:hidden">
                  <h3 className="text-xl font-semibold mb-2">Team Interviews</h3>
                  <p className="text-neutral-medium">
                    Meet with team members and stakeholders to discuss role-specific details and ensure team fit.
                  </p>
                </div>
                <div className="md:w-16 mx-auto flex justify-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center relative z-10 shadow-lg">
                    <span className="text-xl font-bold">4</span>
                  </div>
                </div>
                <div className="md:w-1/2 pl-8 hidden md:block mt-4">
                  <h3 className="text-xl font-semibold mb-2">Team Interviews</h3>
                  <p className="text-neutral-medium">
                    Meet with team members and stakeholders to discuss role-specific details and ensure team fit.
                  </p>
                </div>
              </div>

              <div className="md:flex items-center">
                <div className="md:w-1/2 pr-8 text-right hidden md:block">
                  <h3 className="text-xl font-semibold mb-2">Final Interview</h3>
                  <p className="text-neutral-medium">
                    A conversation with a senior leader to discuss your career goals and how you align with our mission and values.
                  </p>
                </div>
                <div className="md:w-16 mx-auto flex justify-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center relative z-10 shadow-lg">
                    <span className="text-xl font-bold">5</span>
                  </div>
                </div>
                <div className="md:w-1/2 pl-8 md:hidden mt-4">
                  <h3 className="text-xl font-semibold mb-2">Final Interview</h3>
                  <p className="text-neutral-medium">
                    A conversation with a senior leader to discuss your career goals and how you align with our mission and values.
                  </p>
                </div>
              </div>

              <div className="md:flex items-center">
                <div className="md:w-1/2 pr-8 text-right md:hidden">
                  <h3 className="text-xl font-semibold mb-2">Offer & Onboarding</h3>
                  <p className="text-neutral-medium">
                    Successful candidates receive an offer and begin our comprehensive onboarding process to set you up for success.
                  </p>
                </div>
                <div className="md:w-16 mx-auto flex justify-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center relative z-10 shadow-lg">
                    <span className="text-xl font-bold">6</span>
                  </div>
                </div>
                <div className="md:w-1/2 pl-8 hidden md:block mt-4">
                  <h3 className="text-xl font-semibold mb-2">Offer & Onboarding</h3>
                  <p className="text-neutral-medium">
                    Successful candidates receive an offer and begin our comprehensive onboarding process to set you up for success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 md:py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make an Impact?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join our team of passionate individuals working to transform education and empower learners worldwide.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-neutral-lighter"
            onClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View All Positions
          </Button>
        </div>
      </div>
    </div>
  );
}