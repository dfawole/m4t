import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import SkillTreeGraph from '@/components/course/SkillTreeGraph';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, BookOpen, Users, Star, ChevronRight, CheckCircle, BarChart, TrendingUp, Zap, Lock } from 'lucide-react';

// Sample course data for development (when API is connected, this will come from backend)
const courseData = {
  id: 123,
  title: "Mastering Modern Web Development",
  instructor: "Jane Smith",
  rating: 4.8,
  totalStudents: 2845,
  totalLessons: 42,
  estimatedHours: 28,
  level: "Intermediate",
  lastUpdated: "2025-04-15",
  description: "Learn modern web development from the ground up. This comprehensive course covers HTML, CSS, JavaScript, React, and Node.js to give you a solid foundation in building modern web applications.",
  whatYouWillLearn: [
    "Build responsive websites using HTML5 and CSS3",
    "Create interactive user interfaces with JavaScript",
    "Develop single-page applications with React",
    "Build RESTful APIs with Node.js and Express",
    "Connect to databases and handle user authentication",
    "Deploy your web applications to production"
  ],
  prerequisites: [
    "Basic understanding of HTML and CSS",
    "Familiarity with programming concepts",
    "No prior JavaScript experience required"
  ],
  modules: [
    {
      id: 1,
      title: "HTML & CSS Fundamentals",
      lessons: 8,
      totalHours: 4.5
    },
    {
      id: 2,
      title: "JavaScript Essentials",
      lessons: 12,
      totalHours: 7
    },
    {
      id: 3,
      title: "React Fundamentals",
      lessons: 15,
      totalHours: 10
    },
    {
      id: 4,
      title: "Backend Development with Node.js",
      lessons: 10,
      totalHours: 6.5
    }
  ],
  tags: ["Web Development", "JavaScript", "React", "Node.js", "Frontend", "Backend"]
};

const CoursePreviewPage: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Typically you would fetch course data based on route params
  // const { id } = useParams();
  // const { data: course, isLoading } = useQuery({
  //   queryKey: ['/api/courses', id],
  //   enabled: !!id
  // });
  
  // Using sample data instead 
  const course = courseData;
  const isLoading = false;
  
  // Enrollment status would normally come from API
  const isEnrolled = false;
  
  if (isLoading || isAuthLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  
  return (
    <div className="pb-16">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-gray-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Course info */}
            <div className="lg:col-span-3 space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
                <div className="flex items-center gap-4 text-gray-300 mb-4">
                  <span className="flex items-center">
                    <Star className="text-yellow-400 w-4 h-4 mr-1" /> 
                    {course.rating} (324 reviews)
                  </span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" /> 
                    {course.totalStudents.toLocaleString()} students
                  </span>
                </div>
                <p className="text-gray-300">
                  Created by <span className="text-blue-400">{course.instructor}</span>
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-1" /> 
                  Last updated: {new Date(course.lastUpdated).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-1" /> 
                  {course.estimatedHours} hours total
                </div>
                <div className="flex items-center text-sm">
                  <BookOpen className="w-4 h-4 mr-1" /> 
                  {course.totalLessons} lessons
                </div>
                <div className="flex items-center text-sm">
                  <BarChart className="w-4 h-4 mr-1" /> 
                  {course.level} level
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-blue-900/30 text-blue-200 hover:bg-blue-900/40">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Enrollment card */}
            <div className="lg:col-span-2">
              <Card className="bg-white/10 backdrop-blur-sm text-white border-none overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl">Preview this course</CardTitle>
                  <CardDescription className="text-gray-300">
                    Explore the curriculum and learning path
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-2" />
                        {course.totalLessons} lessons
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {course.estimatedHours} hours
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        {course.level} level
                      </span>
                      <span className="flex items-center">
                        <Zap className="w-4 h-4 mr-2" />
                        Full lifetime access
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-white/10 pt-4 flex flex-col gap-3">
                  {isEnrolled ? (
                    <Button className="w-full" variant="default">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Continue Learning
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      variant="default"
                      onClick={() => setLocation('/subscription-example')}
                    >
                      Enroll Now
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full border-white/20 text-white hover:bg-white/10"
                    onClick={() => setActiveTab('curriculum')}
                  >
                    View Curriculum
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs 
          defaultValue="overview" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full max-w-3xl grid grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="skill-tree">Skill Tree</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="max-w-4xl">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">About This Course</h2>
                <p className="text-gray-700">{course.description}</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {course.prerequisites.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-4">Course Modules</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.modules.map((module) => (
                    <Card key={module.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-1" />
                            {module.lessons} lessons
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {module.totalHours} hours
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </div>
          </TabsContent>
          
          {/* Curriculum Tab */}
          <TabsContent value="curriculum" className="max-w-4xl">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Course Curriculum</h2>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{course.totalLessons} lessons</span> · {course.estimatedHours} hours total
                </div>
              </div>
              
              {course.modules.map((module, index) => (
                <Card key={module.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 pb-3">
                    <CardTitle className="text-lg flex justify-between">
                      <span>Module {index + 1}: {module.title}</span>
                      <span className="text-sm text-gray-500 font-normal">
                        {module.lessons} lessons · {module.totalHours} hours
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="divide-y">
                    {/* Sample lessons - in a real app these would come from the API */}
                    {Array.from({ length: Math.min(3, module.lessons) }).map((_, lessonIndex) => (
                      <div key={lessonIndex} className="py-3 flex justify-between">
                        <div className="flex items-start">
                          <div className="text-gray-400 mr-3 mt-0.5">
                            {isEnrolled ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">Lesson {lessonIndex + 1}: {["Introduction", "Basic Concepts", "Practical Exercise"][lessonIndex % 3]}</h3>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <Clock className="w-3.5 h-3.5 mr-1" />
                              {(15 + lessonIndex * 10)} minutes
                            </div>
                          </div>
                        </div>
                        {isEnrolled || lessonIndex === 0 ? (
                          <Button size="sm" variant="ghost" className="text-primary">
                            {lessonIndex === 0 ? "Preview" : "Start"}
                          </Button>
                        ) : (
                          <div className="text-gray-400">
                            <Lock className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {module.lessons > 3 && (
                      <div className="py-3 text-center">
                        <Button variant="link">
                          Show {module.lessons - 3} more lessons
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Skill Tree Tab */}
          <TabsContent value="skill-tree">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Interactive Skill Tree</h2>
                <p className="text-gray-600 max-w-3xl">
                  Explore this interactive visualization of the course content. See how skills and concepts 
                  connect to each other and track your learning progress through the curriculum.
                </p>
              </div>
              
              <Card className="max-w-full overflow-hidden">
                <CardContent className="p-0">
                  <SkillTreeGraph 
                    courseId={course.id} 
                    onNodeClick={(node) => {
                      console.log('Node clicked:', node);
                      // Handle node click - e.g. show more details or navigate to lesson
                    }}
                  />
                </CardContent>
              </Card>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 max-w-3xl">
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-600">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Interact with the Skill Tree</p>
                    <p>Rotate, zoom, and pan to explore the learning path. Click on nodes to see details about each skill or lesson. Completed skills are shown in green, available skills in blue, and locked skills in gray.</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CoursePreviewPage;