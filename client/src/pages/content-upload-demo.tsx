import React from 'react';
import ContentUploader from '@/components/admin/ContentUploader';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';

export default function ContentUploadDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/">
            <div className="inline-flex items-center text-primary hover:text-primary-dark cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </div>
          </Link>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Content Upload Interface</h1>
            <p className="text-neutral-medium max-w-2xl mx-auto">
              This interface allows administrators and instructors to easily create and manage course content with a 
              powerful drag-and-drop editor and multi-format content support.
            </p>
          </div>
        </div>

        <ContentUploader />
        
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-primary-light bg-opacity-10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-file-import text-primary text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Drag & Drop Upload</h3>
              <p className="text-neutral-medium">
                Easily add videos, documents, images and other content with simple drag and drop functionality.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-primary-light bg-opacity-10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-cubes text-primary text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Modular Structure</h3>
              <p className="text-neutral-medium">
                Organize course content into intuitive modules and sections for better learning progression.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-primary-light bg-opacity-10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-question-circle text-primary text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Interactive Quizzes</h3>
              <p className="text-neutral-medium">
                Create engaging assessments with our built-in quiz editor to test learner comprehension.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}