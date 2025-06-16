import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import SkillTreeGraph from '@/components/course/SkillTreeGraph';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

import { 
  ChevronRight, 
  Star, 
  BookOpen, 
  Clock, 
  BarChart, 
  Users, 
  ArrowLeft, 
  Home
} from 'lucide-react';


interface Course {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  duration: number;
  level: string;
  modules: Module[];
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  isCompleted: boolean;
}

const CourseSkillTreeDemo = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<number>(6); // Default to HTML & CSS course
  const [activeTab, setActiveTab] = useState('skill-tree');
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  const { data: enrolledCourses, isLoading: isCoursesLoading } = useQuery({
    queryKey: ['demo-user-courses'],
    queryFn: async () => {
      // This would normally be fetched from the server
      return [
        {
          id: 6,
          title: 'HTML & CSS Fundamentals',
          description: 'Build a strong foundation with modern HTML5 and CSS3',
          coverImage: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80',
          duration: 180,
          level: 'Beginner',
          categoryId: 6,
          progress: 100, // 100% completed
          modules: [
            {
              id: 9,
              title: 'HTML Basics',
              lessons: [
                { id: 9, title: 'HTML Document Structure', isCompleted: true },
                { id: 10, title: 'HTML Tags and Attributes', isCompleted: true },
                { id: 11, title: 'HTML Forms', isCompleted: true }
              ]
            },
            {
              id: 10,
              title: 'CSS Styling',
              lessons: [
                { id: 12, title: 'CSS Selectors', isCompleted: true },
                { id: 13, title: 'CSS Box Model', isCompleted: true },
                { id: 14, title: 'CSS Flexbox', isCompleted: true }
              ]
            },
            {
              id: 11,
              title: 'Responsive Design',
              lessons: [
                { id: 15, title: 'Media Queries', isCompleted: false },
                { id: 16, title: 'Responsive Images', isCompleted: false },
                { id: 17, title: 'Mobile-First Approach', isCompleted: false }
              ]
            }
          ]
        },
        {
          id: 7,
          title: 'JavaScript Essentials',
          description: 'Become proficient with modern JavaScript (ES6+)',
          coverImage: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80',
          duration: 240,
          level: 'Intermediate',
          categoryId: 6,
          progress: 22, // 2 of 9 lessons completed
          modules: [
            {
              id: 12,
              title: 'JavaScript Syntax',
              lessons: [
                { id: 18, title: 'JavaScript Variables', isCompleted: true },
                { id: 19, title: 'JavaScript Data Types', isCompleted: true },
                { id: 20, title: 'JavaScript Operators', isCompleted: false }
              ]
            },
            {
              id: 13,
              title: 'JavaScript Functions',
              lessons: [
                { id: 21, title: 'Function Basics', isCompleted: false },
                { id: 22, title: 'Function Parameters', isCompleted: false },
                { id: 23, title: 'Arrow Functions', isCompleted: false }
              ]
            },
            {
              id: 14,
              title: 'DOM Manipulation',
              lessons: [
                { id: 24, title: 'Selecting Elements', isCompleted: false },
                { id: 25, title: 'Modifying Elements', isCompleted: false },
                { id: 26, title: 'Event Handling', isCompleted: false }
              ]
            }
          ]
        },
        {
          id: 8,
          title: 'React Framework',
          description: 'Build interactive UIs with React',
          coverImage: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80',
          duration: 260,
          level: 'Intermediate',
          categoryId: 6,
          progress: 0, // Not started
          modules: [
            {
              id: 15,
              title: 'React Basics',
              lessons: [
                { id: 27, title: 'React Components', isCompleted: false },
                { id: 28, title: 'JSX Syntax', isCompleted: false },
                { id: 29, title: 'Props in React', isCompleted: false }
              ]
            },
            {
              id: 16,
              title: 'React State',
              lessons: [
                { id: 30, title: 'useState Hook', isCompleted: false },
                { id: 31, title: 'State Updates', isCompleted: false },
                { id: 32, title: 'Lifting State Up', isCompleted: false }
              ]
            },
            {
              id: 17,
              title: 'React Hooks',
              lessons: [
                { id: 33, title: 'useEffect Hook', isCompleted: false },
                { id: 34, title: 'Custom Hooks', isCompleted: false },
                { id: 35, title: 'Advanced Hooks', isCompleted: false }
              ]
            }
          ]
        }
      ];
    }
  });
  
  const selectedCourse = enrolledCourses?.find(c => c.id === selectedCourseId);
  
  // Generate skill tree data based on the selected course
  const getSkillTreeData = (course: Course | undefined) => {
    if (!course) return { nodes: [], links: [] };
    
    const nodes: any[] = [];
    const links: any[] = [];
    
    // Add course as the central node
    nodes.push({
      id: `course-${course.id}`,
      name: course.title,
      level: 0,
      status: 'completed',
      type: 'course',
      description: course.description,
      color: '#4c1d95', // Purple for course node
      size: 2.5
    });
    
    // Add module nodes
    course.modules.forEach((module, moduleIndex) => {
      const moduleId = `module-${module.id}`;
      const moduleCompleted = module.lessons.every(l => l.isCompleted);
      const moduleAvailable = moduleIndex === 0 || course.modules[moduleIndex - 1].lessons.some(l => l.isCompleted);
      
      nodes.push({
        id: moduleId,
        name: module.title,
        level: 1,
        status: moduleCompleted ? 'completed' : (moduleAvailable ? 'available' : 'locked'),
        type: 'module',
        description: `Module ${moduleIndex + 1}: ${module.title}`,
        color: moduleCompleted ? '#38a169' : (moduleAvailable ? '#3182ce' : '#718096'),
        size: 2
      });
      
      // Link module to course
      links.push({
        source: `course-${course.id}`,
        target: moduleId,
        color: moduleCompleted ? '#38a169' : (moduleAvailable ? '#3182ce' : '#718096')
      });
      
      // Add lesson nodes
      module.lessons.forEach((lesson, lessonIndex) => {
        const lessonId = `lesson-${lesson.id}`;
        const prevLessonCompleted = lessonIndex === 0 || module.lessons[lessonIndex - 1].isCompleted;
        const lessonAvailable = moduleAvailable && (lessonIndex === 0 || prevLessonCompleted);
        
        nodes.push({
          id: lessonId,
          name: lesson.title,
          level: 2,
          status: lesson.isCompleted ? 'completed' : (lessonAvailable ? 'available' : 'locked'),
          type: 'lesson',
          description: lesson.title,
          color: lesson.isCompleted ? '#38a169' : (lessonAvailable ? '#3182ce' : '#718096'),
          size: 1.5
        });
        
        // Link lesson to module
        links.push({
          source: moduleId,
          target: lessonId,
          color: lesson.isCompleted ? '#38a169' : (lessonAvailable ? '#3182ce' : '#718096')
        });
      });
    });
    
    return { nodes, links };
  };
  
  // Calculate completed lessons and total lessons for the selected course
  const getCompletedStats = (course: Course | undefined) => {
    if (!course) return { completed: 0, total: 0 };
    
    let completed = 0;
    let total = 0;
    
    course.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        total++;
        if (lesson.isCompleted) completed++;
      });
    });
    
    return { completed, total };
  };
  
  const skillTreeData = getSkillTreeData(selectedCourse);
  const completedStats = getCompletedStats(selectedCourse);
  
  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
    console.log("Node clicked:", node);
  };
  
  if (isCoursesLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="outline" size="sm" className="mr-3 flex items-center">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center">
                <Home className="mr-1 h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
            <h1 className="text-3xl font-bold">3D Skill Tree Demo</h1>
            <Badge variant="secondary" className="mt-2 md:mt-0">Interactive Demo</Badge>
          </div>
          <p className="text-gray-600">
            This demo shows how 3D skill trees work in our courses. You can see your progress and how different skills connect.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {enrolledCourses?.map((course) => (
            <Card 
              key={course.id} 
              className={`overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${selectedCourseId === course.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelectedCourseId(course.id)}
            >
              <div 
                className="h-36 bg-cover bg-center" 
                style={{
                  backgroundImage: `url(${course.coverImage})`
                }}
              />
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription className="text-xs flex justify-between items-center">
                  <span>{course.level}</span>
                  <span>{course.duration} min</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {selectedCourse && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
                <div className="flex items-center gap-4 text-gray-500 mt-1 text-sm">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {selectedCourse.duration} minutes
                  </span>
                  <span className="flex items-center">
                    <BarChart className="w-4 h-4 mr-1" />
                    {selectedCourse.level}
                  </span>
                  <span className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {completedStats.completed} of {completedStats.total} lessons completed
                  </span>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {selectedCourse.progress}% Complete
              </Badge>
            </div>
            
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="skill-tree">Skill Tree</TabsTrigger>
                <TabsTrigger value="modules">Course Content</TabsTrigger>
              </TabsList>
              
              <TabsContent value="skill-tree" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <Card className="h-[500px] overflow-hidden">
                      <CardContent className="p-0 h-full">
                        <SkillTreeGraph
                          courseId={selectedCourse.id}
                          initialData={skillTreeData}
                          onNodeClick={handleNodeClick}
                          userProgress={{
                            completedNodes: selectedCourse.modules
                              .flatMap(m => m.lessons)
                              .filter(l => l.isCompleted)
                              .map(l => `lesson-${l.id}`),
                            totalProgress: selectedCourse.progress,
                            currentNode: selectedCourse.modules
                              .flatMap(m => m.lessons)
                              .find(l => !l.isCompleted)
                              ? `lesson-${selectedCourse.modules
                                  .flatMap(m => m.lessons)
                                  .find(l => !l.isCompleted)?.id}`
                              : undefined
                          }}
                          showProgressSummary={true}
                        />
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="md:col-span-1">
                    <Card>
                      <CardHeader>
                        <CardTitle>Node Information</CardTitle>
                        <CardDescription>
                          {selectedNode ? 'Explore details about this item' : 'Click on a node to view details'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {selectedNode ? (
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-semibold text-lg">{selectedNode.name}</h3>
                              <p className="text-gray-600 text-sm">{selectedNode.description}</p>
                            </div>
                            <div className="flex items-center">
                              <div className={`px-2 py-1 rounded text-xs ${
                                selectedNode.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : selectedNode.status === 'available'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                              }`}>
                                {selectedNode.status === 'completed' 
                                  ? 'Completed' 
                                  : selectedNode.status === 'available'
                                    ? 'Available'
                                    : 'Locked'}
                              </div>
                              <div className="ml-3 text-sm text-gray-600">
                                {selectedNode.type === 'course' ? 'Course' : 
                                 selectedNode.type === 'module' ? 'Module' : 'Lesson'}
                              </div>
                            </div>

                            {selectedNode.status === 'available' && (
                              <Button className="w-full">
                                {selectedNode.type === 'course' ? 'View Course' : 
                                 selectedNode.type === 'module' ? 'Start Module' : 'Start Lesson'}
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                            <p className="text-center">Select a node from the skill tree to view details</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="modules" className="mt-6">
                <div className="space-y-6">
                  {selectedCourse.modules.map((module, moduleIndex) => (
                    <Card key={module.id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Module {moduleIndex + 1}: {module.title}</CardTitle>
                        <CardDescription>
                          {module.lessons.filter(l => l.isCompleted).length} of {module.lessons.length} lessons completed
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div key={lesson.id} className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
                            <div className="flex items-center">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                                lesson.isCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {lesson.isCompleted ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <span className="text-xs">{lessonIndex + 1}</span>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{lesson.title}</div>
                              </div>
                            </div>
                            {lesson.isCompleted ? (
                              <Button size="sm" variant="ghost" className="text-primary">
                                Review
                              </Button>
                            ) : (
                              <Button size="sm" className="bg-primary hover:bg-primary/90">
                                Start
                              </Button>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>


    </>
  );
};

export default CourseSkillTreeDemo;