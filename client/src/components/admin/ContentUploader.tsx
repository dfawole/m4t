import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { UploadCloud, Plus, X, FileText, Video, Image as ImageIcon, Loader2, HelpCircle } from 'lucide-react';

// Type definitions for content structure
interface ContentSection {
  id: string;
  type: 'text' | 'video' | 'quiz' | 'image' | 'file';
  title: string;
  content: string;
  videoUrl?: string;
  imageUrl?: string;
  fileUrl?: string;
  quizQuestions?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

interface ContentModule {
  id: string;
  title: string;
  description: string;
  order: number;
  sections: ContentSection[];
}

export default function ContentUploader() {
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const [isPremium, setIsPremium] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [courseStatus, setCourseStatus] = useState('draft');
  const [modules, setModules] = useState<ContentModule[]>([]);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Add a new module
  const addModule = () => {
    const newModule: ContentModule = {
      id: `module-${Date.now()}`,
      title: `Module ${modules.length + 1}`,
      description: '',
      order: modules.length,
      sections: []
    };
    setModules([...modules, newModule]);
    setActiveModuleId(newModule.id);
  };

  // Add a section to the active module
  const addSection = (type: ContentSection['type']) => {
    if (!activeModuleId) return;
    
    const moduleIndex = modules.findIndex(m => m.id === activeModuleId);
    if (moduleIndex === -1) return;
    
    const updatedModules = [...modules];
    const newSection: ContentSection = {
      id: `section-${Date.now()}`,
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
      content: '',
    };
    
    updatedModules[moduleIndex].sections.push(newSection);
    setModules(updatedModules);
  };

  // Remove a section from a module
  const removeSection = (moduleId: string, sectionId: string) => {
    const moduleIndex = modules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) return;
    
    const updatedModules = [...modules];
    updatedModules[moduleIndex].sections = updatedModules[moduleIndex].sections.filter(
      s => s.id !== sectionId
    );
    
    setModules(updatedModules);
  };

  // Update module data
  const updateModule = (moduleId: string, field: keyof ContentModule, value: any) => {
    const moduleIndex = modules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) return;
    
    const updatedModules = [...modules];
    updatedModules[moduleIndex] = {
      ...updatedModules[moduleIndex],
      [field]: value
    };
    
    setModules(updatedModules);
  };

  // Update section data
  const updateSection = (moduleId: string, sectionId: string, field: keyof ContentSection, value: any) => {
    const moduleIndex = modules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) return;
    
    const sectionIndex = modules[moduleIndex].sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return;
    
    const updatedModules = [...modules];
    updatedModules[moduleIndex].sections[sectionIndex] = {
      ...updatedModules[moduleIndex].sections[sectionIndex],
      [field]: value
    };
    
    setModules(updatedModules);
  };

  // Handle file upload (mock function)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: string, moduleId?: string, sectionId?: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const mockUrl = `https://storage.example.com/${type}/${file.name}`;
      
      if (type === 'thumbnail') {
        setThumbnailUrl(mockUrl);
      } else if (moduleId && sectionId) {
        if (type === 'video') {
          updateSection(moduleId, sectionId, 'videoUrl', mockUrl);
        } else if (type === 'image') {
          updateSection(moduleId, sectionId, 'imageUrl', mockUrl);
        } else if (type === 'file') {
          updateSection(moduleId, sectionId, 'fileUrl', mockUrl);
        }
      }
      
      setUploading(false);
      toast({
        title: "Upload complete",
        description: `${file.name} has been uploaded successfully.`,
      });
    }, 1500);
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent, moduleId?: string, sectionId?: string) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length === 0) return;
    
    const file = files[0];
    const fileType = file.type.split('/')[0];
    
    // Determine the content type based on the file
    let type = 'file';
    if (fileType === 'image') type = 'image';
    if (fileType === 'video') type = 'video';
    
    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const mockUrl = `https://storage.example.com/${type}/${file.name}`;
      
      if (!moduleId || !sectionId) {
        // If dropping on the course thumbnail area
        if (fileType === 'image') {
          setThumbnailUrl(mockUrl);
        }
      } else {
        // If dropping on a specific section
        if (type === 'video') {
          updateSection(moduleId, sectionId, 'videoUrl', mockUrl);
        } else if (type === 'image') {
          updateSection(moduleId, sectionId, 'imageUrl', mockUrl);
        } else if (type === 'file') {
          updateSection(moduleId, sectionId, 'fileUrl', mockUrl);
        }
      }
      
      setUploading(false);
      toast({
        title: "Upload complete",
        description: `${file.name} has been uploaded successfully.`,
      });
    }, 1500);
  };

  // Submit the course (mock function)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!courseTitle.trim()) {
      toast({
        title: "Validation Error",
        description: "Course title is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!courseDescription.trim()) {
      toast({
        title: "Validation Error",
        description: "Course description is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!category) {
      toast({
        title: "Validation Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }
    
    if (modules.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one module",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate API call
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      toast({
        title: "Course saved",
        description: courseStatus === 'published' 
          ? "Your course has been published successfully." 
          : "Your course has been saved as a draft.",
      });
    }, 2000);
  };

  return (
    <div className="container mx-auto py-8">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Course Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Details</CardTitle>
                  <CardDescription>Basic information about your course</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input 
                      id="title" 
                      value={courseTitle} 
                      onChange={e => setCourseTitle(e.target.value)}
                      placeholder="e.g. Advanced JavaScript for Developers"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Course Description</Label>
                    <Textarea 
                      id="description" 
                      value={courseDescription} 
                      onChange={e => setCourseDescription(e.target.value)}
                      placeholder="Describe what students will learn in this course"
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="leadership">Leadership</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Difficulty Level</Label>
                    <RadioGroup value={difficulty} onValueChange={setDifficulty}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="beginner" id="beginner" />
                        <Label htmlFor="beginner">Beginner</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="intermediate" id="intermediate" />
                        <Label htmlFor="intermediate">Intermediate</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="advanced" id="advanced" />
                        <Label htmlFor="advanced">Advanced</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="premium">Premium Content</Label>
                    <Switch 
                      id="premium" 
                      checked={isPremium}
                      onCheckedChange={setIsPremium}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Thumbnail Upload Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Thumbnail</CardTitle>
                  <CardDescription>Upload a cover image for your course</CardDescription>
                </CardHeader>
                <CardContent>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center ${
                      isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e)}
                  >
                    {thumbnailUrl ? (
                      <div className="relative">
                        <img 
                          src={thumbnailUrl} 
                          alt="Course thumbnail" 
                          className="mx-auto h-48 w-full object-cover rounded-md"
                        />
                        <button 
                          type="button"
                          onClick={() => setThumbnailUrl('')}
                          className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            Drag and drop your thumbnail image here, or click to browse
                          </p>
                        </div>
                        <Input
                          id="thumbnail-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'thumbnail')}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-4"
                          onClick={() => document.getElementById('thumbnail-upload')?.click()}
                          disabled={uploading}
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            'Select Image'
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Publishing Options Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Publishing</CardTitle>
                  <CardDescription>Control your course's visibility</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={courseStatus} onValueChange={setCourseStatus}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" type="button">
                      Preview
                    </Button>
                    <Button type="submit" disabled={uploading}>
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        courseStatus === 'published' ? 'Publish Course' : 'Save Draft'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Course Content</CardTitle>
                    <CardDescription>Organize your course into modules and sections</CardDescription>
                  </div>
                  <Button onClick={addModule} type="button">
                    <Plus className="mr-2 h-4 w-4" /> Add Module
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {modules.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-2 text-lg font-semibold">No modules yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by adding your first module
                    </p>
                    <div className="mt-6">
                      <Button onClick={addModule} type="button">
                        Add Module
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Tabs 
                    value={activeModuleId || modules[0].id} 
                    onValueChange={setActiveModuleId}
                    className="w-full"
                  >
                    <TabsList className="w-full flex overflow-x-auto space-x-2">
                      {modules.map((module) => (
                        <TabsTrigger 
                          key={module.id} 
                          value={module.id}
                          className="flex-shrink-0"
                        >
                          {module.title}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {modules.map((module) => (
                      <TabsContent key={module.id} value={module.id} className="py-4 space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <Label htmlFor={`module-title-${module.id}`}>Module Title</Label>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  const newModules = modules.filter(m => m.id !== module.id);
                                  setModules(newModules);
                                  if (newModules.length > 0) {
                                    setActiveModuleId(newModules[0].id);
                                  } else {
                                    setActiveModuleId(null);
                                  }
                                }}
                                type="button"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <Input 
                              id={`module-title-${module.id}`}
                              value={module.title}
                              onChange={(e) => updateModule(module.id, 'title', e.target.value)}
                              placeholder="Module title"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`module-desc-${module.id}`}>Module Description</Label>
                            <Textarea 
                              id={`module-desc-${module.id}`}
                              value={module.description}
                              onChange={(e) => updateModule(module.id, 'description', e.target.value)}
                              placeholder="Describe this module"
                              rows={3}
                            />
                          </div>
                          
                          <div className="space-y-3 pt-4">
                            <Label>Content Sections</Label>
                            
                            {module.sections.map((section) => (
                              <Card key={section.id} className="overflow-hidden">
                                <CardHeader className="bg-gray-50 p-3">
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                      {section.type === 'text' && <FileText className="h-4 w-4 mr-2 text-blue-500" />}
                                      {section.type === 'video' && <Video className="h-4 w-4 mr-2 text-red-500" />}
                                      {section.type === 'image' && <ImageIcon className="h-4 w-4 mr-2 text-green-500" />}
                                      <Input 
                                        value={section.title}
                                        onChange={(e) => updateSection(module.id, section.id, 'title', e.target.value)}
                                        className="h-7 py-1 text-sm"
                                        placeholder="Section title"
                                      />
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => removeSection(module.id, section.id)}
                                      type="button"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </CardHeader>
                                <CardContent className="p-3">
                                  {section.type === 'text' && (
                                    <Textarea 
                                      value={section.content}
                                      onChange={(e) => updateSection(module.id, section.id, 'content', e.target.value)}
                                      placeholder="Enter text content here"
                                      rows={4}
                                    />
                                  )}
                                  
                                  {section.type === 'video' && (
                                    <div 
                                      className={`border-2 border-dashed rounded-lg p-4 text-center ${
                                        isDragging ? 'border-primary bg-primary/5' : 'border-gray-200'
                                      }`}
                                      onDragOver={handleDragOver}
                                      onDragLeave={handleDragLeave}
                                      onDrop={(e) => handleDrop(e, module.id, section.id)}
                                    >
                                      {section.videoUrl ? (
                                        <div>
                                          <video 
                                            src={section.videoUrl} 
                                            controls 
                                            className="w-full h-36 object-cover rounded"
                                          />
                                          <p className="text-sm mt-2 truncate text-gray-500">
                                            {section.videoUrl.split('/').pop()}
                                          </p>
                                        </div>
                                      ) : (
                                        <>
                                          <Video className="mx-auto h-8 w-8 text-gray-400" />
                                          <p className="text-xs text-gray-500 mt-2">
                                            Drag and drop video file or click to upload
                                          </p>
                                          <Input
                                            id={`video-upload-${section.id}`}
                                            type="file"
                                            accept="video/*"
                                            className="hidden"
                                            onChange={(e) => handleFileUpload(e, 'video', module.id, section.id)}
                                          />
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() => document.getElementById(`video-upload-${section.id}`)?.click()}
                                            disabled={uploading}
                                          >
                                            {uploading ? 'Uploading...' : 'Select Video'}
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  )}
                                  
                                  {section.type === 'image' && (
                                    <div 
                                      className={`border-2 border-dashed rounded-lg p-4 text-center ${
                                        isDragging ? 'border-primary bg-primary/5' : 'border-gray-200'
                                      }`}
                                      onDragOver={handleDragOver}
                                      onDragLeave={handleDragLeave}
                                      onDrop={(e) => handleDrop(e, module.id, section.id)}
                                    >
                                      {section.imageUrl ? (
                                        <div>
                                          <img 
                                            src={section.imageUrl} 
                                            alt={section.title} 
                                            className="w-full h-36 object-cover rounded"
                                          />
                                          <p className="text-sm mt-2 truncate text-gray-500">
                                            {section.imageUrl.split('/').pop()}
                                          </p>
                                        </div>
                                      ) : (
                                        <>
                                          <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                                          <p className="text-xs text-gray-500 mt-2">
                                            Drag and drop image file or click to upload
                                          </p>
                                          <Input
                                            id={`image-upload-${section.id}`}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleFileUpload(e, 'image', module.id, section.id)}
                                          />
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() => document.getElementById(`image-upload-${section.id}`)?.click()}
                                            disabled={uploading}
                                          >
                                            {uploading ? 'Uploading...' : 'Select Image'}
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  )}
                                  
                                  {section.type === 'quiz' && (
                                    <div className="space-y-3">
                                      <p className="text-sm font-medium">Quiz Configuration</p>
                                      <p className="text-xs text-gray-500">
                                        Configure questions in the quiz editor.
                                      </p>
                                      <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm"
                                      >
                                        Open Quiz Editor
                                      </Button>
                                    </div>
                                  )}
                                  
                                  {section.type === 'file' && (
                                    <div 
                                      className={`border-2 border-dashed rounded-lg p-4 text-center ${
                                        isDragging ? 'border-primary bg-primary/5' : 'border-gray-200'
                                      }`}
                                      onDragOver={handleDragOver}
                                      onDragLeave={handleDragLeave}
                                      onDrop={(e) => handleDrop(e, module.id, section.id)}
                                    >
                                      {section.fileUrl ? (
                                        <div className="flex items-center justify-center space-x-2">
                                          <FileText className="h-6 w-6 text-blue-500" />
                                          <p className="text-sm truncate">
                                            {section.fileUrl.split('/').pop()}
                                          </p>
                                        </div>
                                      ) : (
                                        <>
                                          <FileText className="mx-auto h-8 w-8 text-gray-400" />
                                          <p className="text-xs text-gray-500 mt-2">
                                            Drag and drop file or click to upload
                                          </p>
                                          <Input
                                            id={`file-upload-${section.id}`}
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => handleFileUpload(e, 'file', module.id, section.id)}
                                          />
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() => document.getElementById(`file-upload-${section.id}`)?.click()}
                                            disabled={uploading}
                                          >
                                            {uploading ? 'Uploading...' : 'Select File'}
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                            
                            <div className="flex space-x-2 mt-4">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => addSection('text')}
                                type="button"
                              >
                                <FileText className="h-4 w-4 mr-1" /> Add Text
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => addSection('video')}
                                type="button"
                              >
                                <Video className="h-4 w-4 mr-1" /> Add Video
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => addSection('image')}
                                type="button"
                              >
                                <ImageIcon className="h-4 w-4 mr-1" /> Add Image
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => addSection('quiz')}
                                type="button"
                              >
                                <HelpCircle className="h-4 w-4 mr-1" /> Add Quiz
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => addSection('file')}
                                type="button"
                              >
                                <FileText className="h-4 w-4 mr-1" /> Add File
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}