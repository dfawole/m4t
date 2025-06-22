// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { Separator } from '@/components/ui/separator';

// interface SocialLoginProps {
//   className?: string;
// }

// export default function SocialLogin({ className }: SocialLoginProps) {
//   const handleGoogleLogin = () => {
//     // In a real implementation, we would redirect to Google OAuth
//     window.location.href = '/api/auth/google';
//   };

//   const handleGithubLogin = () => {
//     // In a real implementation, we would redirect to GitHub OAuth
//     window.location.href = '/api/auth/github';
//   };

//   const handleAppleLogin = () => {
//     // In a real implementation, we would redirect to Apple OAuth
//     window.location.href = '/api/auth/apple';
//   };

//   const handleStandardLogin = () => {
//     // Redirect to standard login form
//     window.location.href = '/login';
//   };

//   return (
//     <div className={className}>
//       <div className="relative flex items-center justify-center">
//         <Separator className="absolute w-full" />
//         <span className="relative bg-background px-2 text-xs text-muted-foreground">
//           OR CONTINUE WITH
//         </span>
//       </div>
//       <div className="mt-6 grid grid-cols-2 gap-3">
//         <Button
//           variant="outline"
//           type="button"
//           onClick={handleGoogleLogin}
//           className="flex items-center justify-center gap-2"
//         >
//           <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//             <path
//               d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
//             />
//           </svg>
//           <span>Google</span>
//         </Button>
//         <Button
//           variant="outline"
//           type="button"
//           onClick={handleGithubLogin}
//           className="flex items-center justify-center gap-2"
//         >
//           <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//             <path
//               fillRule="evenodd"
//               clipRule="evenodd"
//               d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
//             />
//           </svg>
//           <span>GitHub</span>
//         </Button>
//         <Button
//           variant="outline"
//           type="button"
//           onClick={handleAppleLogin}
//           className="flex items-center justify-center gap-2"
//         >
//           <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//             <path
//               d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.082 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
//             />
//           </svg>
//           <span>Apple</span>
//         </Button>
//         <Button
//           variant="outline"
//           type="button"
//           onClick={handleStandardLogin}
//           className="flex items-center justify-center gap-2"
//         >
//           <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
//           </svg>
//           <span>Email & Password</span>
//         </Button>
//       </div>
//     </div>
//   );
// }



//client/src/components/auth/social-login.tsx
 //=======
// import React, { useEffect, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Separator } from '@/components/ui/separator';

// interface SocialLoginProps {
//   className?: string;
// }

// interface OAuthStatus {
//   google: boolean;
//   github: boolean;
//   apple: boolean;
// }

// export default function SocialLogin({ className }: SocialLoginProps) {
//   const [oauthStatus, setOauthStatus] = useState<OAuthStatus>({
//     google: false,
//     github: false,
//     apple: false
//   });

//   useEffect(() => {
//     // Check which OAuth providers are configured
//     fetch('/api/auth/oauth-status')
//       .then(res => res.json())
//       .then(status => setOauthStatus(status))
//       .catch(() => {
//         // If API fails, assume all are disabled
//         setOauthStatus({ google: false, github: false, apple: false });
//       });
//   }, []);

//   const handleGoogleLogin = () => {
//     if (oauthStatus.google) {
//       window.location.href = '/api/auth/google';
//     } else {
//       alert('Google OAuth is not configured. Please contact administrator to set up GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.');
//     }
//   };

//   const handleGithubLogin = () => {
//     if (oauthStatus.github) {
//       window.location.href = '/api/auth/github';
//     } else {
//       alert('GitHub OAuth is not configured. Please contact administrator to set up GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.');
//     }
//   };

//   const handleAppleLogin = () => {
//     if (oauthStatus.apple) {
//       window.location.href = '/api/auth/apple';
//     } else {
//       alert('Apple OAuth is not configured. Please contact administrator to set up Apple credentials.');
//     }
//   };

//   const handleStandardLogin = () => {
//     // Redirect to standard login form
//     window.location.href = '/login';
//   };

//   return (
//     <div className={className}>
//       <div className="relative flex items-center justify-center">
//         <Separator className="absolute w-full" />
//         <span className="relative bg-background px-2 text-xs text-muted-foreground">
//           OR CONTINUE WITH
//         </span>
//       </div>
//       <div className="mt-6 grid grid-cols-2 gap-3">
//         <Button
//           variant="outline"
//           type="button"
//           onClick={handleGoogleLogin}
//           className="flex items-center justify-center gap-2"
//         >
//           <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//             <path
//               d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
//             />
//           </svg>
//           <span>Google</span>
//         </Button>
//         <Button
//           variant="outline"
//           type="button"
//           onClick={handleGithubLogin}
//           className="flex items-center justify-center gap-2"
//         >
//           <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//             <path
//               fillRule="evenodd"
//               clipRule="evenodd"
//               d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
//             />
//           </svg>
//           <span>GitHub</span>
//         </Button>
//         <Button
//           variant="outline"
//           type="button"
//           onClick={handleAppleLogin}
//           className="flex items-center justify-center gap-2"
//         >
//           <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//             <path
//               d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.082 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
//             />
//           </svg>
//           <span>Apple</span>
//         </Button>
//         <Button
//           variant="outline"
//           type="button"
//           onClick={handleStandardLogin}
//           className="flex items-center justify-center gap-2"
//         >
//           <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
//           </svg>
//           <span>Email & Password</span>
//         </Button>
//       </div>
//     </div>
//   );
// }



// client/src/components/auth/social-login.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

interface SocialLoginProps {
  className?: string;
}

interface OAuthStatus {
  google: boolean;
  github: boolean;
  apple: boolean;
}

export default function SocialLogin({ className }: SocialLoginProps) {
  const {
    data: oauthStatus = { google: false, github: false, apple: false },
    error: oauthError,
  } = useQuery<OAuthStatus>({
    queryKey: ['oauth-status'],
    queryFn: () =>
      fetchWithAuth('/api/auth/oauth-status').then(res => res.json()),
    retry: false,
  });

  // If the status endpoint fails, we simply fall back to all-disabled
  if (oauthError) {
    console.error('Failed to fetch OAuth status:', oauthError);
  }

  const handleGoogleLogin = () => {
    if (oauthStatus.google) {
      window.location.href = '/api/auth/google';
    } else {
      alert(
        'Google OAuth is not configured. Please contact your administrator.'
      );
    }
  };

  const handleGithubLogin = () => {
    if (oauthStatus.github) {
      window.location.href = '/api/auth/github';
    } else {
      alert(
        'GitHub OAuth is not configured. Please contact your administrator.'
      );
    }
  };

  const handleAppleLogin = () => {
    if (oauthStatus.apple) {
      window.location.href = '/api/auth/apple';
    } else {
      alert(
        'Apple OAuth is not configured. Please contact your administrator.'
      );
    }
  };

  const handleStandardLogin = () => {
    window.location.href = '/login';
  };

  return (
    <div className={className}>
      <div className="relative flex items-center justify-center">
        <Separator className="absolute w-full" />
        <span className="relative bg-background px-2 text-xs text-muted-foreground">
          OR CONTINUE WITH
        </span>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2"
          disabled={!oauthStatus.google}
        >
          {/* Google SVG */}
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
          <span>Google</span>
        </Button>

        <Button
          variant="outline"
          type="button"
          onClick={handleGithubLogin}
          className="flex items-center justify-center gap-2"
          disabled={!oauthStatus.github}
        >
          {/* GitHub SVG */}
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
            />
          </svg>
          <span>GitHub</span>
        </Button>

        <Button
          variant="outline"
          type="button"
          onClick={handleAppleLogin}
          className="flex items-center justify-center gap-2"
          disabled={!oauthStatus.apple}
        >
          {/* Apple SVG */}
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.082 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
          </svg>
          <span>Apple</span>
        </Button>

        <Button
          variant="outline"
          type="button"
          onClick={handleStandardLogin}
          className="flex items-center justify-center gap-2"
        >
          {/* Email icon */}
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
            />
          </svg>
          <span>Email &amp; Password</span>
        </Button>
      </div>
    </div>
  );
}
