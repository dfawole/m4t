import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function WelcomeBanner() {
  const { user } = useAuth();
  
  return (
    <div className="relative overflow-hidden rounded-xl mb-8 bg-primary">
      <div 
        className="absolute inset-0 opacity-20" 
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1571260899304-425eee4c7efc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=500')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      <div className="relative px-6 py-8 sm:px-8 sm:py-12 text-white z-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Welcome back, {user?.firstName || 'Student'}!
        </h1>
        <p className="text-white text-opacity-90 mb-6 max-w-2xl">
          Continue your learning journey and discover new courses to enhance your professional skills.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/dashboard/courses">
            <Button className="bg-white text-primary hover:bg-neutral-lighter">
              Continue Learning
            </Button>
          </Link>
          <Link href="/courses">
            <Button 
              variant="outline" 
              className="bg-primary-dark bg-opacity-30 hover:bg-opacity-40 text-white border-white border-opacity-30"
            >
              Browse Courses
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
