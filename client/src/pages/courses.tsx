import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Play, SlidersHorizontal, Clock, BookOpen, BrainCircuit, Filter, X, 
         ChevronLeft, ChevronRight, Building, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ContentLoading } from "@/components/ui/loading-animation";
import LearningTip from "@/components/ui/learning-tip";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { useVoiceNavigation } from "@/components/accessibility/voice-navigation-provider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { formatDuration } from "@/lib/utils";
import type { Course } from "@shared/schema";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Category } from "@/types/category";

export default function Courses() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficultyLevels, setSelectedDifficultyLevels] = useState<string[]>([]);
  const [selectedLearningStyles, setSelectedLearningStyles] = useState<string[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [durationRange, setDurationRange] = useState<[number, number]>([0, 300]);
  const [showWithPreview, setShowWithPreview] = useState<boolean>(false);
  const [ratingThreshold, setRatingThreshold] = useState<number>(0);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedCourses, setPaginatedCourses] = useState<any[]>([]);
  
  // Access voice navigation context
  const { registerCommandHandler, unregisterCommandHandler } = useVoiceNavigation();
  
  // References for voice-controlled elements
  const searchInputRef = useRef<HTMLInputElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  
  // Fetch all courses
  const { data: courses =[], isLoading, error: courseError } = useQuery<Course[]>({
    queryKey: ["course"],
    queryFn: async () => {
      const res = await fetchWithAuth("/api/courses");
      if(!res.ok) throw new Error("Failed to load courses")
      return res.json()
    }
  });
  
  // Fetch categories
  const { data: categories = [], isLoading: isLoadingCategories, error: categoriesError } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetchWithAuth("/api/categories");
      if (!res.ok) throw new Error("Failed to load categories");
      return res.json()
    }
  });
  
  // Handle voice commands specific to courses page
  useEffect(() => {
    const handleCoursesPageCommand = (command: string) => {
      switch (command) {
        case 'filter':
          // Open filter popover
          setIsFilterOpen(true);
          filterButtonRef.current?.click();
          break;
        case 'clear-filters':
          resetFilters();
          break;
        case 'search':
          // Focus on search input
          searchInputRef.current?.focus();
          break;
        // Add more commands as needed
      }
    };
    
    // Register command handler for this page
    registerCommandHandler('courses', handleCoursesPageCommand);
    
    // Cleanup on unmount
    return () => {
      unregisterCommandHandler('courses');
    };
  }, [registerCommandHandler, unregisterCommandHandler]);

  // Available filter options
  const difficultyLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
  const learningStyles = ["Visual", "Auditory", "Reading", "Interactive"];
  
  // Handle search and filtering
  useEffect(() => {
    if (courses) {
      let filtered = [...courses];
      let filtersCount = 0;
      
      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter(course => 
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        filtersCount++;
      }
      
      // Filter by category
      if (selectedCategory !== "all") {
        filtered = filtered.filter(course => 
          course.categoryId === parseInt(selectedCategory)
        );
        filtersCount++;
      }
      
      // Filter by difficulty level
      if (selectedDifficultyLevels.length > 0) {
        filtered = filtered.filter(course => 
          selectedDifficultyLevels.includes(course.level)
        );
        filtersCount++;
      }
      
      // Filter by industry
      if (selectedIndustry !== "all") {
        filtered = filtered.filter(course => course.industry === selectedIndustry);
        filtersCount++;
      }
      
      // Filter by learning style
      if (selectedLearningStyles.length > 0) {
        filtered = filtered.filter(course => {
          // If course has learning styles property
          if (Array.isArray(course.learningStyles)) {
            return course.learningStyles.some((style: string) => 
              selectedLearningStyles.includes(style)
            );
          }
          return false;
        });
        filtersCount++;
      }
      
      // Filter by duration range
      if (durationRange[0] > 0 || durationRange[1] < 300) {
        filtered = filtered.filter(course => 
          course.duration >= durationRange[0] && course.duration <= durationRange[1]
        );
        filtersCount++;
      }
      
      // Filter courses with preview videos
      if (showWithPreview) {
        filtered = filtered.filter(course => 
          course.teaserVideo || course.teaserVideoId
        );
        filtersCount++;
      }
      
      // Filter by rating threshold
      if (ratingThreshold > 0) {
        filtered = filtered.filter(course =>  {
         const r = typeof course.rating === "number" ? course.rating : Number(course.rating) || 0;
         return r >= ratingThreshold
      });
        filtersCount++;
      }
      
      setFilteredCourses(filtered);
      setActiveFiltersCount(filtersCount);
    }
  }, [
    courses, 
    searchQuery, 
    selectedCategory, 
    selectedDifficultyLevels, 
    selectedLearningStyles, 
    durationRange, 
    showWithPreview,
    ratingThreshold,
    selectedIndustry
  ]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle category selection
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };
  
  // Handle industry selection
  const handleIndustryChange = (value: string) => {
    setSelectedIndustry(value);
  };
  
  // Handle difficulty level selection
  const handleDifficultyChange = (level: string) => {
    setSelectedDifficultyLevels(prev => {
      if (prev.includes(level)) {
        return prev.filter(l => l !== level);
      } else {
        return [...prev, level];
      }
    });
  };
  
  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Update paginated courses
  useEffect(() => {
    if (filteredCourses?.length > 0) {
      const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
      setTotalPages(totalPages);
      
      const indexOfLastCourse = currentPage * coursesPerPage;
      const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
      const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
      
      setPaginatedCourses(currentCourses);
    } else {
      setPaginatedCourses([]);
      setTotalPages(1);
    }
  }, [filteredCourses, currentPage, coursesPerPage]);
  
  // Handle learning style selection
  const handleLearningStyleChange = (style: string) => {
    setSelectedLearningStyles(prev => {
      if (prev.includes(style)) {
        return prev.filter(s => s !== style);
      } else {
        return [...prev, style];
      }
    });
  };
  
  // Handle duration range change
  const handleDurationChange = (values: number[]) => {
    setDurationRange([values[0], values[1]]);
  };
  
  // Handle preview filter toggle
  const handlePreviewToggle = (checked: boolean) => {
    setShowWithPreview(checked);
  };
  
  // Handle rating threshold change
  const handleRatingChange = (values: number[]) => {
    setRatingThreshold(values[0]);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDifficultyLevels([]);
    setSelectedLearningStyles([]);
    setDurationRange([0, 300]);
    setShowWithPreview(false);
    setRatingThreshold(0);
    setSelectedIndustry("all");
  };
  
  // Function to determine category color
  const getCategoryColor = (categoryId: number) => {
    const colors: Record<number, string> = {
      1: "bg-primary-light bg-opacity-10 text-primary",
      2: "bg-secondary bg-opacity-10 text-secondary",
      3: "bg-accent bg-opacity-10 text-accent",
      4: "bg-success bg-opacity-10 text-success",
    };
    return colors[categoryId] || colors[1];
  };
  
  return (
    <div className="min-h-screen bg-neutral-lighter">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page heading and search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold mb-4 md:mb-0">Explore Courses</h1>
            <LearningTip context="course_overview" compact className="mt-1" />
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-white"
              onClick={() => window.location.href = '/subscription-comparison'}
            >
              Compare Plans
            </Button>
            <div className="relative max-w-lg w-full">
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pr-10"
                ref={searchInputRef}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-medium" />
            </div>
          </div>
        </div>
        
        {/* Contextual tip banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 flex items-start gap-2">
          <LearningTip context="course_overview" />
        </div>
        
        {/* Filter options */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="w-full md:w-48">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((category: any) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-48">
            <Select value={selectedIndustry} onValueChange={handleIndustryChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Media">Media</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button 
                ref={filterButtonRef}
                variant="outline" 
                className="flex items-center gap-2 h-10"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Advanced Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 md:w-96">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filter Courses</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2 text-xs"
                    onClick={resetFilters}
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Reset
                  </Button>
                </div>
                
                <Separator />
                
                {/* Difficulty Level */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium flex items-center">
                    <BookOpen className="h-4 w-4 mr-1.5 text-muted-foreground" />
                    Difficulty Level
                  </h5>
                  <div className="grid grid-cols-2 gap-2">
                    {difficultyLevels.map(level => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`level-${level}`} 
                          checked={selectedDifficultyLevels.includes(level)}
                          onCheckedChange={() => handleDifficultyChange(level)}
                        />
                        <Label 
                          htmlFor={`level-${level}`}
                          className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {level}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Duration */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
                    Duration (minutes)
                  </h5>
                  <Slider
                    defaultValue={[0, 300]}
                    min={0}
                    max={300}
                    step={15}
                    value={[durationRange[0], durationRange[1]]}
                    onValueChange={handleDurationChange}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{durationRange[0]} min</span>
                    <span>{durationRange[1]} min</span>
                  </div>
                </div>
                
                <Separator />
                
                {/* Learning Style */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium flex items-center">
                    <BrainCircuit className="h-4 w-4 mr-1.5 text-muted-foreground" />
                    Learning Style
                  </h5>
                  <div className="grid grid-cols-2 gap-2">
                    {learningStyles.map(style => (
                      <div key={style} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`style-${style}`} 
                          checked={selectedLearningStyles.includes(style)}
                          onCheckedChange={() => handleLearningStyleChange(style)}
                        />
                        <Label 
                          htmlFor={`style-${style}`}
                          className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {style}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* With Preview */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h5 className="text-sm font-medium flex items-center">
                      <Play className="h-4 w-4 mr-1.5 text-muted-foreground" />
                      Has Preview Video
                    </h5>
                    <p className="text-xs text-muted-foreground">Show only courses with preview videos</p>
                  </div>
                  <Switch 
                    checked={showWithPreview}
                    onCheckedChange={handlePreviewToggle}
                  />
                </div>
                
                <Separator />
                
                {/* Rating */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium flex items-center">
                    <Star className="h-4 w-4 mr-1.5 text-muted-foreground" />
                    Minimum Rating
                  </h5>
                  <Slider
                    defaultValue={[0]}
                    min={0}
                    max={5}
                    step={0.5}
                    value={[ratingThreshold]}
                    onValueChange={handleRatingChange}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Any</span>
                    <span>5 Stars</span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Active filters display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="text-sm text-neutral-dark font-medium mr-1 flex items-center">
              <Filter className="h-4 w-4 mr-1" />
              Active Filters:
            </div>
            
            {selectedDifficultyLevels.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {selectedDifficultyLevels.join(", ")}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 p-0 ml-1" 
                  onClick={() => setSelectedDifficultyLevels([])}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {selectedLearningStyles.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <BrainCircuit className="h-3 w-3" />
                {selectedLearningStyles.join(", ")}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 p-0 ml-1" 
                  onClick={() => setSelectedLearningStyles([])}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {selectedIndustry !== "all" && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Building className="h-3 w-3" />
                {selectedIndustry}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 p-0 ml-1" 
                  onClick={() => setSelectedIndustry("all")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {showWithPreview && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Play className="h-3 w-3" />
                With Preview
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 p-0 ml-1" 
                  onClick={() => setShowWithPreview(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {(durationRange[0] > 0 || durationRange[1] < 300) && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {durationRange[0]}-{durationRange[1]} min
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 p-0 ml-1" 
                  onClick={() => setDurationRange([0, 300])}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {ratingThreshold > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {ratingThreshold}+ Stars
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 p-0 ml-1" 
                  onClick={() => setRatingThreshold(0)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}
        
        {/* Courses grid */}
        {isLoading ? (
          <div className="w-full">
            <ContentLoading />
          </div>
        ) : filteredCourses.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedCourses.map((course) => (
                <Link key={course.id} to={`/courses/${course.id}`}>
                  <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        src={course.coverImage || '/images/course-placeholder.jpg'} 
                        alt={course.title} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                      <div className="absolute top-2 left-2 z-10">
                        <Badge className={getCategoryColor(course.categoryId)}>
                          {categories?.find((c: any) => c.id === course.categoryId)?.name || 'Course'}
                        </Badge>
                      </div>
                      {(course.teaserVideo || course.teaserVideoId) && (
                        <div className="absolute bottom-2 right-2 z-10">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Play className="h-3 w-3" />
                            Preview
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="flex-grow flex flex-col py-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
                      <p className="text-sm text-neutral-dark mb-3 line-clamp-3">
                        {course.description}
                      </p>
                      <div className="flex items-center text-sm text-neutral-medium mt-auto">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDuration(course.duration)}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 pb-4 flex flex-col gap-2">
                      <Button variant="default" className="w-full" asChild>
                        <span>View Course</span>
                      </Button>
                      {!isAuthenticated && (
                        <Button 
                          variant="outline" 
                          className="w-full border-primary text-primary hover:bg-primary hover:text-white" 
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = '/login?redirect=/subscriptions';
                          }}
                        >
                          Login to Subscribe
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
            
            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 text-neutral-medium">
              <BookOpen className="w-full h-full" />
            </div>
            <h3 className="text-xl font-medium mb-2">No courses found</h3>
            <p className="text-neutral-medium mb-6">
              Try adjusting your filters or search criteria.
            </p>
            <Button onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
