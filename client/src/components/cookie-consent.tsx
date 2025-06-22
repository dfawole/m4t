import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { withScrollToTop } from '@/lib/scroll-utils';

const CookieConsent: React.FC = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('cookie-consent');
    
    if (consent !== 'accepted' && consent !== 'declined') {
      // Show the banner immediately
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowConsent(false);
  };

  if (!showConsent) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-5 w-96 max-w-[90%] bg-white rounded-lg shadow-2xl z-40 border border-blue-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-3 px-4">
        <h3 className="text-white font-medium">Cookie Consent</h3>
      </div>
      <div className="p-4">
        <div className="text-sm text-gray-700">
          <p className="mb-3">We use cookies to enhance your experience on our website. By continuing to browse, you agree to our use of cookies.</p>
          <Link href="/cookies" onClick={withScrollToTop()} className="text-blue-600 underline hover:text-blue-800 inline-block mb-4">
            Learn more about our cookies policy
          </Link>
        </div>
        <div className="flex gap-3 justify-end">
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={handleDecline}
          >
            Decline
          </Button>
          <Button 
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
            onClick={handleAccept}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
