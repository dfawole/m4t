import React from 'react';
import { Link } from 'wouter';
// Import main footer instead of shared footer
import Footer from '@/pages/footer';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        {children}
      </div>
      {/* No footer here as it's handled at the App level */}
    </div>
  );
};

export default Layout;