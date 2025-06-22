import React, { createContext, useContext, useState } from 'react';
import { VoiceNavigation } from './voice-navigation';

// Create a context to manage voice navigation state across components
interface VoiceNavigationContextType {
  handleCommand: (command: string) => void;
  registerCommandHandler: (page: string, handler: (command: string) => void) => void;
  unregisterCommandHandler: (page: string) => void;
}

const VoiceNavigationContext = createContext<VoiceNavigationContextType | null>(null);

export const useVoiceNavigation = () => {
  const context = useContext(VoiceNavigationContext);
  if (!context) {
    throw new Error('useVoiceNavigation must be used within a VoiceNavigationProvider');
  }
  return context;
};

interface VoiceNavigationProviderProps {
  children: React.ReactNode;
}

export function VoiceNavigationProvider({ children }: VoiceNavigationProviderProps) {
  // Store command handlers for different pages
  const [commandHandlers, setCommandHandlers] = useState<Record<string, (command: string) => void>>({});
  
  // Register a command handler for a specific page
  const registerCommandHandler = (page: string, handler: (command: string) => void) => {
    setCommandHandlers(prev => ({
      ...prev,
      [page]: handler
    }));
  };
  
  // Unregister a command handler when a component unmounts
  const unregisterCommandHandler = (page: string) => {
    setCommandHandlers(prev => {
      const newHandlers = { ...prev };
      delete newHandlers[page];
      return newHandlers;
    });
  };
  
  // Main command handler that delegates to page-specific handlers
  const handleCommand = (command: string) => {
    // Determine current page from URL path
    const path = window.location.pathname;
    let currentPage = 'default';
    
    if (path.includes('courses')) {
      currentPage = 'courses';
    } else if (path.includes('course/')) {
      currentPage = 'course-detail';
    } else if (path.includes('learning-path')) {
      currentPage = 'learning-path';
    } else if (path === '/') {
      currentPage = 'home';
    }
    
    // Call the appropriate handler for the current page
    const handler = commandHandlers[currentPage];
    if (handler) {
      handler(command);
    }
  };
  
  return (
    <VoiceNavigationContext.Provider 
      value={{ 
        handleCommand, 
        registerCommandHandler, 
        unregisterCommandHandler 
      }}
    >
      {children}
      <VoiceNavigation onCommand={handleCommand} />
    </VoiceNavigationContext.Provider>
  );
}