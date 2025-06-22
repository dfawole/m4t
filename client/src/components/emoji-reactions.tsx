import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ThumbsUp, Heart, Lightbulb, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface EmojiReactionProps {
  contentType: 'course' | 'module' | 'lesson';
  contentId: number;
  className?: string;
}

interface Reaction {
  type: string;
  count: number;
}

const emojiMap = {
  like: {
    icon: ThumbsUp,
    label: "Like",
    color: "text-blue-500"
  },
  love: {
    icon: Heart,
    label: "Love",
    color: "text-rose-500"
  },
  insightful: {
    icon: Lightbulb,
    label: "Insightful",
    color: "text-amber-500"
  },
  confused: {
    icon: HelpCircle,
    label: "Confused",
    color: "text-purple-500"
  }
};

export default function EmojiReactions({ contentType, contentId, className }: EmojiReactionProps) {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Fetch reactions when component mounts
  useEffect(() => {
    fetchReactions();
  }, [contentId, contentType]);

  const fetchReactions = async () => {
    try {
      const response = await apiRequest(
        "GET", 
        `/api/reactions/${contentType}/${contentId}`
      );
      const data = await response.json();
      setReactions(data.reactions || []);
      setUserReaction(data.userReaction);
    } catch (error) {
      console.error("Failed to fetch reactions:", error);
    }
  };

  const handleReaction = async (type: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to react to content",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest(
        "POST", 
        "/api/reactions", 
        { contentType, contentId, type }
      );
      const data = await response.json();
      setUserReaction(data.type);
      
      // Refresh reactions to update counts
      fetchReactions();
      
      toast({
        title: data.type ? "Reaction added" : "Reaction removed",
        description: data.type 
          ? `You reacted with ${emojiMap[data.type as keyof typeof emojiMap].label}` 
          : "Your reaction has been removed",
      });
    } catch (error) {
      console.error("Failed to add reaction:", error);
      toast({
        title: "Error",
        description: "Failed to add your reaction",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getReactionCount = (type: string) => {
    const reaction = reactions.find(r => r.type === type);
    return reaction ? reaction.count : 0;
  };

  return (
    <div className={cn("flex space-x-2 my-4", className)}>
      <TooltipProvider>
        {Object.entries(emojiMap).map(([type, { icon: Icon, label, color }]) => {
          const count = getReactionCount(type);
          const isActive = userReaction === type;
          
          return (
            <Tooltip key={type}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex items-center space-x-1 p-2 h-auto",
                    isActive && "bg-slate-100 dark:bg-slate-800",
                  )}
                  onClick={() => handleReaction(type)}
                  disabled={isLoading}
                >
                  <Icon className={cn("h-4 w-4", isActive ? color : "text-slate-500")} />
                  {count > 0 && (
                    <span className={cn(
                      "text-xs font-medium", 
                      isActive ? color : "text-slate-500"
                    )}>
                      {count}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </div>
  );
}