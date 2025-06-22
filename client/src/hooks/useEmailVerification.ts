import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from './useAuth';

// List of authentication providers that verify emails
const TRUSTED_AUTH_PROVIDERS = [
  'google',
  'gmail',
  'microsoft',
  'apple',
  'facebook',
  'linkedin',
  'github'
];

export function useEmailVerification(userId?: string) {
  const { user } = useAuth();
  
  // Check if the user authenticated through a trusted provider
  const isFromTrustedProvider = !!user?.authProvider && 
    TRUSTED_AUTH_PROVIDERS.some(provider => 
      (user.authProvider || '').toLowerCase().includes(provider)
    );
  
  const { 
    data: verificationStatus, 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['/api/verification/status', userId],
    queryFn: async () => {
      if (!userId) return { isVerified: false };
      
      // If user logged in through a trusted provider, we can skip the verification check
      if (isFromTrustedProvider) {
        return { isVerified: true, fromTrustedProvider: true };
      }
      
      const response = await apiRequest('GET', '/api/verification/status');
      return response.json();
    },
    // Only run the query if we have a userId and it's not from a trusted provider
    enabled: !!userId && !isFromTrustedProvider,
  });

  const resendMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest('POST', '/api/verification/resend', { email });
      const result = await response.json();
      return result.success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/verification/status', userId] });
    },
  });

  const resendVerificationEmail = async (email: string) => {
    return await resendMutation.mutateAsync(email);
  };

  return {
    // User is considered verified if they're from a trusted provider OR their email is manually verified
    isVerified: isFromTrustedProvider || verificationStatus?.isVerified || false,
    // Only show loading state if we're checking verification status and not from a trusted provider
    isLoading: isLoading && !isFromTrustedProvider,
    error,
    resendVerificationEmail,
    authProvider: user?.authProvider || null,
    isFromTrustedProvider,
    // Add extra metadata for debugging and tracking
    verificationSource: isFromTrustedProvider ? 'trusted_provider' : 
                        verificationStatus?.isVerified ? 'manual_verification' : 'unverified'
  };
}