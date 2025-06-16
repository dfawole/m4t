import { createContext, ReactNode, useContext, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEmailVerification } from '@/hooks/useEmailVerification';

interface EmailVerificationContextType {
  isVerified: boolean;
  isLoading: boolean;
  userEmail: string | null;
  authProvider: string | null;
  isFromTrustedProvider: boolean;
  verificationSource: 'trusted_provider' | 'manual_verification' | 'unverified';
  resendVerificationEmail: (email: string) => Promise<boolean>;
}

const EmailVerificationContext = createContext<EmailVerificationContextType | null>(null);

export function EmailVerificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { 
    isVerified, 
    isLoading, 
    resendVerificationEmail,
    authProvider,
    isFromTrustedProvider,
    verificationSource
  } = useEmailVerification(user?.id);

  return (
    <EmailVerificationContext.Provider
      value={{
        isVerified,
        isLoading,
        userEmail: user?.email || null,
        authProvider,
        isFromTrustedProvider,
        verificationSource,
        resendVerificationEmail,
      }}
    >
      {children}
    </EmailVerificationContext.Provider>
  );
}

export function useEmailVerificationContext() {
  const context = useContext(EmailVerificationContext);
  if (!context) {
    throw new Error(
      'useEmailVerificationContext must be used within an EmailVerificationProvider'
    );
  }
  return context;
}