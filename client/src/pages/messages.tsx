import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { MessageSquare, User, Search, Send, PlusCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FullPageLoading } from "@/components/ui/loading-animation";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  }[];
  lastMessage: {
    content: string;
    timestamp: Date;
    senderId: string;
  };
  unreadCount: number;
}

export default function Messages() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isLoading, isAuthenticated, setLocation]);
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }
  
  // Mock conversations - in a real app, these would come from an API
  const conversations: Conversation[] = [
    {
      id: "conv1",
      participants: [
        {
          id: "instructor1",
          name: "Dr. Sarah Johnson",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          role: "Instructor"
        }
      ],
      lastMessage: {
        content: "Thank you for your question about React hooks. Let me clarify how useEffect works...",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        senderId: "instructor1"
      },
      unreadCount: 2
    },
    {
      id: "conv2",
      participants: [
        {
          id: "support1",
          name: "Technical Support",
          role: "Support"
        }
      ],
      lastMessage: {
        content: "Your issue with the assignment submission has been resolved. Please let us know if you need further assistance.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        senderId: "support1"
      },
      unreadCount: 0
    },
    {
      id: "conv3",
      participants: [
        {
          id: "instructor2",
          name: "Prof. Michael Chen",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          role: "Instructor"
        }
      ],
      lastMessage: {
        content: "I've reviewed your project proposal and have some suggestions for improvement.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        senderId: "instructor2"
      },
      unreadCount: 1
    }
  ];
  
  // Mock messages for the selected conversation
  const getMessages = (conversationId: string): Message[] => {
    // In a real app, these would come from an API based on the conversationId
    if (conversationId === "conv1") {
      return [
        {
          id: "msg1",
          senderId: user?.id || "",
          senderName: user?.firstName || "You",
          content: "Hello Dr. Johnson, I'm having trouble understanding how useEffect works in React. Could you explain it?",
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          isRead: true
        },
        {
          id: "msg2",
          senderId: "instructor1",
          senderName: "Dr. Sarah Johnson",
          senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          content: "Hi there! useEffect is a React Hook that lets you synchronize a component with an external system. It runs after every render by default, but you can control when it runs with dependencies.",
          timestamp: new Date(Date.now() - 1000 * 60 * 55), // 55 minutes ago
          isRead: true
        },
        {
          id: "msg3",
          senderId: user?.id || "",
          senderName: user?.firstName || "You",
          content: "What about the clean-up function? When does it run?",
          timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50 minutes ago
          isRead: true
        },
        {
          id: "msg4",
          senderId: "instructor1",
          senderName: "Dr. Sarah Johnson",
          senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          content: "The cleanup function runs before the component is removed from the UI to prevent memory leaks. It also runs before every re-render with changed dependencies.",
          timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
          isRead: true
        },
        {
          id: "msg5",
          senderId: "instructor1",
          senderName: "Dr. Sarah Johnson",
          senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          content: "Thank you for your question about React hooks. Let me clarify how useEffect works...",
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          isRead: false
        }
      ];
    } else if (conversationId === "conv2") {
      return [
        {
          id: "msg6",
          senderId: user?.id || "",
          senderName: user?.firstName || "You",
          content: "I'm having trouble submitting my assignment for the Web Development course. It keeps giving me an error.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          isRead: true
        },
        {
          id: "msg7",
          senderId: "support1",
          senderName: "Technical Support",
          content: "I'm sorry to hear that. Can you please provide more details about the error you're seeing?",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.5), // 3.5 hours ago
          isRead: true
        },
        {
          id: "msg8",
          senderId: user?.id || "",
          senderName: user?.firstName || "You",
          content: "It says 'File format not supported' when I try to upload my JavaScript file.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.3), // 3.3 hours ago
          isRead: true
        },
        {
          id: "msg9",
          senderId: "support1",
          senderName: "Technical Support",
          content: "Thank you for the information. I've checked the system and found there was a temporary issue with JavaScript file uploads. It has been resolved now. Please try again and let me know if you still have issues.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
          isRead: true
        }
      ];
    } else if (conversationId === "conv3") {
      return [
        {
          id: "msg10",
          senderId: "instructor2",
          senderName: "Prof. Michael Chen",
          senderAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          content: "I've received your project proposal for the Advanced JavaScript course.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25), // 25 hours ago
          isRead: true
        },
        {
          id: "msg11",
          senderId: user?.id || "",
          senderName: user?.firstName || "You",
          content: "Thank you for reviewing it. What do you think about my approach?",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.5), // 24.5 hours ago
          isRead: true
        },
        {
          id: "msg12",
          senderId: "instructor2",
          senderName: "Prof. Michael Chen",
          senderAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          content: "I've reviewed your project proposal and have some suggestions for improvement.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24 hours ago
          isRead: false
        }
      ];
    }
    
    return [];
  };
  
  const handleSendMessage = () => {
    if (!activeConversation || !messageText.trim()) return;
    
    // In a real app, this would send a message to the API
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully.",
    });
    
    // Clear the input field
    setMessageText("");
  };
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(date);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text mb-2">
          Messages
        </h1>
        <p className="text-gray-500">
          Connect with instructors and support staff
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="h-[calc(100vh-220px)]">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Conversations</CardTitle>
                <Button size="sm" variant="outline" className="h-8 gap-1">
                  <PlusCircle className="h-4 w-4" />
                  New
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search messages..." className="pl-8" />
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-130px)] overflow-auto">
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      activeConversation === conversation.id 
                        ? 'bg-primary/10' 
                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    } ${conversation.unreadCount > 0 ? 'border-l-4 border-primary' : ''}`}
                    onClick={() => setActiveConversation(conversation.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={conversation.participants[0].avatar} />
                        <AvatarFallback>{conversation.participants[0].name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="font-medium truncate">{conversation.participants[0].name}</div>
                          <div className="text-xs text-gray-500">
                            {formatDate(conversation.lastMessage.timestamp)}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">{conversation.participants[0].role}</div>
                        <div className="text-sm truncate mt-1">
                          {conversation.lastMessage.senderId === user?.id ? 'You: ' : ''}
                          {conversation.lastMessage.content}
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="mt-1 flex justify-end">
                            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-primary text-white">
                              {conversation.unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Message Thread */}
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-220px)] flex flex-col">
            {activeConversation ? (
              <>
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={conversations.find(c => c.id === activeConversation)?.participants[0].avatar} />
                      <AvatarFallback>
                        {conversations.find(c => c.id === activeConversation)?.participants[0].name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">
                        {conversations.find(c => c.id === activeConversation)?.participants[0].name}
                      </CardTitle>
                      <CardDescription>
                        {conversations.find(c => c.id === activeConversation)?.participants[0].role}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow overflow-auto pt-4 pb-0">
                  <div className="space-y-4">
                    {getMessages(activeConversation).map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-2 max-w-[85%] ${message.senderId === user?.id ? 'flex-row-reverse' : ''}`}>
                          {message.senderId !== user?.id && (
                            <Avatar className="h-8 w-8 mt-0.5">
                              <AvatarImage src={message.senderAvatar} />
                              <AvatarFallback>{message.senderName.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div>
                            <div className={`px-4 py-2 rounded-lg ${
                              message.senderId === user?.id 
                                ? 'bg-primary text-white' 
                                : 'bg-gray-100 dark:bg-gray-800'
                            }`}>
                              {message.content}
                            </div>
                            <div className={`text-xs text-gray-500 mt-1 ${
                              message.senderId === user?.id ? 'text-right' : ''
                            }`}>
                              {formatTime(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="border-t p-3">
                  <div className="flex w-full items-center gap-2">
                    <Input 
                      placeholder="Type your message..." 
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button 
                      size="icon" 
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-neutral-medium max-w-sm mb-4">
                  Choose a conversation from the list to view messages or start a new conversation.
                </p>
                <Button 
                  variant="outline" 
                  className="gap-1"
                  onClick={() => toast({
                    title: "New conversation",
                    description: "This feature is coming soon!",
                  })}
                >
                  <PlusCircle className="h-4 w-4" />
                  Start New Conversation
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}