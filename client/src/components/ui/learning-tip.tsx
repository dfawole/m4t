import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { 
  HelpCircle, 
  X, 
  Lightbulb, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface LearningTipProps {
  context: string;
  className?: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  compact?: boolean;
}

interface Tip {
  id: number;
  tipKey: string;
  title: string;
  content: string;
  context: string;
  priority: number;
}

export default function LearningTip({ 
  context, 
  className, 
  position = 'bottom', 
  compact = false 
}: LearningTipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  
  // Fetch context-specific tips
  const { 
    data: tips = [], 
    isLoading 
  } = useQuery({
    queryKey: [`/api/tips/${context}`],
    enabled: isOpen, // Only fetch when the tip panel is open
  });
  
  // Handle tip dismissal
  const dismissMutation = useMutation({
    mutationFn: async (tipId: number) => {
      return await apiRequest(
        'POST', 
        `/api/tips/${tipId}/dismiss`, 
        { userId: user?.id }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tips/${context}`] });
    }
  });
  
  const currentTip = tips[currentTipIndex] as Tip | undefined;
  
  // Handle navigation between multiple tips
  const handleNext = () => {
    if (currentTipIndex < tips.length - 1) {
      setCurrentTipIndex(curr => curr + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentTipIndex > 0) {
      setCurrentTipIndex(curr => curr - 1);
    }
  };
  
  // Handle dismissing the current tip
  const handleDismiss = () => {
    if (currentTip && isAuthenticated) {
      dismissMutation.mutate(currentTip.id);
    }
    
    // If this is the last tip, close the panel
    if (currentTipIndex === tips.length - 1) {
      setIsOpen(false);
    } else {
      // Otherwise, move to the next tip
      handleNext();
    }
  };
  
  // Position class based on the position prop
  const positionClass = {
    top: 'bottom-full mb-2',
    right: 'left-full ml-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
  }[position];
  
  if (compact) {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className={cn("rounded-full h-8 w-8", className)}
              onClick={() => setIsOpen(true)}
            >
              <Lightbulb className="h-4 w-4 text-amber-500" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Learning Tips</p>
          </TooltipContent>
        </Tooltip>
        
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              {isLoading ? (
                <CardContent className="py-8">
                  <div className="flex justify-center">
                    <div className="animate-pulse h-4 w-2/3 bg-muted rounded mb-4"></div>
                    <div className="animate-pulse h-20 w-full bg-muted rounded"></div>
                  </div>
                </CardContent>
              ) : tips.length === 0 ? (
                <CardContent className="py-8 text-center">
                  <Lightbulb className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                  <p className="text-lg font-medium">No tips available</p>
                  <p className="text-muted-foreground">Check back later for helpful tips on this topic.</p>
                </CardContent>
              ) : (
                <>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-amber-500" />
                        {currentTip?.title}
                      </CardTitle>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 rounded-full"
                        onClick={() => setIsOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{currentTip?.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentTipIndex === 0}
                        onClick={handlePrevious}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentTipIndex === tips.length - 1}
                        onClick={handleNext}
                      >
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDismiss}
                    >
                      Don't show again
                    </Button>
                  </CardFooter>
                </>
              )}
            </Card>
          </div>
        )}
      </TooltipProvider>
    );
  }
  
  return (
    <div className={cn("relative", className)}>
      <Button
        size="sm"
        variant="ghost"
        className="flex items-center gap-1.5 h-8 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-full px-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Lightbulb className="h-4 w-4 text-amber-500" />
        <span className="text-xs font-medium">Learning Tips</span>
      </Button>
      
      {isOpen && (
        <Card className={cn(
          "absolute z-10 w-72 shadow-lg", 
          positionClass
        )}>
          {isLoading ? (
            <CardContent className="py-4">
              <div className="animate-pulse h-4 w-2/3 bg-muted rounded mb-4"></div>
              <div className="animate-pulse h-20 w-full bg-muted rounded"></div>
            </CardContent>
          ) : tips.length === 0 ? (
            <CardContent className="py-4 text-center">
              <p className="text-sm text-muted-foreground">No tips available</p>
            </CardContent>
          ) : (
            <>
              <CardHeader className="p-3 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    {currentTip?.title}
                  </CardTitle>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 rounded-full"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <p className="text-xs">{currentTip?.content}</p>
              </CardContent>
              <CardFooter className="p-3 pt-2 flex justify-between border-t">
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    disabled={currentTipIndex === 0}
                    onClick={handlePrevious}
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {currentTipIndex + 1} / {tips.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    disabled={currentTipIndex === tips.length - 1}
                    onClick={handleNext}
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={handleDismiss}
                >
                  Dismiss
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      )}
    </div>
  );
}