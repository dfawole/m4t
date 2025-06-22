import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarClock, Users, Video } from 'lucide-react';

interface Session {
  id: number;
  title: string;
  courseTitle: string;
  date: string;
  time: string;
  duration: number;
  attendees: number;
  type: 'live' | 'recorded';
}

interface UpcomingSessionsProps {
  sessions?: Session[];
  loading?: boolean;
}

export default function UpcomingSessions({ sessions = [], loading = false }: UpcomingSessionsProps) {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    }).format(date);
  };
  
  // Format time to be more readable
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:${minutes} ${period}`;
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 p-3 border rounded-md">
                <div className="h-14 w-14 bg-neutral-200 rounded animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-5 w-3/4 bg-neutral-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-1/2 bg-neutral-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-1/3 bg-neutral-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!sessions.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
            <CalendarClock className="h-6 w-6 text-neutral-500" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Upcoming Sessions</h3>
          <p className="text-neutral-medium mb-6">
            You don't have any scheduled learning sessions. Join a course to access live sessions.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-start gap-4 p-3 border rounded-md hover:border-primary transition-colors">
              <div className="h-14 w-14 flex-shrink-0 rounded-md bg-primary bg-opacity-10 flex items-center justify-center">
                {session.type === 'live' ? (
                  <Video className="h-6 w-6 text-primary" />
                ) : (
                  <CalendarClock className="h-6 w-6 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{session.title}</h4>
                <p className="text-sm text-neutral-medium mb-2">{session.courseTitle}</p>
                <div className="flex flex-wrap gap-2 text-xs text-neutral-medium">
                  <span>
                    {formatDate(session.date)} • {formatTime(session.time)}
                  </span>
                  <span>•</span>
                  <span>{session.duration} min</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Users className="h-3 w-3 mr-1" /> {session.attendees}
                  </span>
                </div>
              </div>
              <Button 
                size="sm" 
                variant={session.type === 'live' ? 'default' : 'outline'}
              >
                {session.type === 'live' ? 'Join' : 'View'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}