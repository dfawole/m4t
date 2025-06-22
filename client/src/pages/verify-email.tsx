import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function VerifyEmail() {
  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  const [_, navigate] = useLocation();
  
  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Get token from URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        
        if (!token) {
          setState('error');
          setMessage('Verification token is missing');
          return;
        }
        
        // Call verification API
        const response = await fetch(`/api/auth/verify?token=${token}`);
        const data = await response.json();
        
        if (response.ok) {
          setState('success');
          setMessage(data.message || 'Your email has been successfully verified');
        } else {
          setState('error');
          setMessage(data.message || 'Failed to verify email');
        }
      } catch (error) {
        setState('error');
        setMessage('An error occurred during verification');
        console.error('Verification error:', error);
      }
    };
    
    verifyToken();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Email Verification
          </CardTitle>
          <CardDescription className="text-center">
            {state === 'loading' ? 'Verifying your email address...' : 
             state === 'success' ? 'Your email has been verified!' :
             'Verification failed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          {state === 'loading' && (
            <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
          )}
          
          {state === 'success' && (
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          )}
          
          {state === 'error' && (
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
          )}
          
          <p className="text-center mt-2">
            {message}
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => navigate('/login')}
          >
            {state === 'success' ? 'Go to Login' : 'Back to Home'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}