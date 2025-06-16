import { useState } from 'react';
import { AlertCircle, X, CheckCircle, Mail } from 'lucide-react';
import { useEmailVerificationContext } from '@/contexts/EmailVerificationContext';
import { useToast } from '@/hooks/use-toast';

export function EmailVerificationBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { 
    isVerified, 
    isLoading, 
    userEmail, 
    resendVerificationEmail, 
    authProvider,
    isFromTrustedProvider 
  } = useEmailVerificationContext();
  const { toast } = useToast();

  // Don't show if loading, verified, from trusted provider, or manually dismissed
  if (isLoading || isVerified || isFromTrustedProvider || !isVisible) {
    return null;
  }

  const handleResendEmail = async () => {
    if (!userEmail || isSending) return;
    
    setIsSending(true);
    try {
      const success = await resendVerificationEmail(userEmail);
      if (success) {
        toast({
          title: "Verification email sent",
          description: `We've sent a new verification email to ${userEmail}`,
          variant: "default",
        });
      } else {
        toast({
          title: "Error sending verification email",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error sending verification email",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Customize message based on auth provider
  const getMessage = () => {
    // Format auth provider name for display
    const formatProviderName = (provider: string) => {
      // Extract main provider name from issuer URL or domain
      const providerName = provider.toLowerCase();
      
      if (providerName.includes('google') || providerName.includes('gmail')) {
        return 'Google';
      } else if (providerName.includes('github')) {
        return 'GitHub';
      } else if (providerName.includes('facebook')) {
        return 'Facebook';
      } else if (providerName.includes('microsoft') || providerName.includes('outlook')) {
        return 'Microsoft';
      } else if (providerName.includes('apple')) {
        return 'Apple';
      } else if (providerName.includes('twitter') || providerName.includes('x.com')) {
        return 'X (Twitter)';
      } else if (providerName.includes('linkedin')) {
        return 'LinkedIn';
      } else if (providerName.includes('replit')) {
        return 'Replit';
      } else {
        // Return capitalized version of the provider if not recognized
        return provider.charAt(0).toUpperCase() + provider.slice(1);
      }
    };

    if (authProvider) {
      const providerDisplay = formatProviderName(authProvider);
      
      return (
        <p>
          You signed in with <strong>{providerDisplay}</strong>, but we still need to verify your email 
          address <strong>{userEmail}</strong>. Please check your inbox for a verification email.
        </p>
      );
    }
    
    return (
      <p>
        We've sent a verification email to <strong>{userEmail}</strong>.
        Please check your inbox and click the verification link to access all features.
      </p>
    );
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Please verify your email address
            </h3>
            <div className="mt-1 text-sm text-yellow-700">
              {getMessage()}
            </div>
            <div className="mt-3">
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
                onClick={handleResendEmail}
                disabled={isSending}
              >
                <Mail className="mr-1.5 h-4 w-4" />
                {isSending ? 'Sending...' : 'Resend verification email'}
              </button>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="ml-auto flex-shrink-0 text-yellow-500 hover:text-yellow-600 focus:outline-none"
          onClick={() => setIsVisible(false)}
        >
          <span className="sr-only">Dismiss</span>
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}