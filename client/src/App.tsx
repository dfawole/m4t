// import { Switch, Route } from "wouter";
// import { queryClient } from "./lib/queryClient";
// import { QueryClientProvider } from "@tanstack/react-query";
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import Footer from "@/pages/footer";
// import Header from "@/components/layout/header";
// import { VoiceNavigationProvider } from "@/components/accessibility/voice-navigation-provider";

// import NotFound from "@/pages/not-found";
// import Home from "@/pages/home";
// import Courses from "@/pages/courses";
// import Course from "@/pages/course";
// import Dashboard from "@/pages/dashboard";
// import Profile from "@/pages/profile";
// import Settings from "@/pages/settings";
// import LearningPath from "@/pages/learning-path";
// import Subscriptions from "@/pages/subscriptions";
// import SubscriptionComparison from "@/pages/subscription-comparison";
// import CheckoutSummary from "@/pages/checkout-summary";
// import AdminDashboard from "@/pages/admin-dashboard";
// import CompanyDashboard from "@/pages/company-dashboard";
// import InstructorDashboard from "@/pages/instructor-dashboard";
// import AdminLogin from "@/pages/admin-login";
// import SubscriptionExample from "@/pages/subscription-example";
// import Login from "@/pages/login";
// import Register from "@/pages/register";
// import ForgotPassword from "@/pages/forgot-password";
// import ResetPassword from "@/pages/reset-password";
// import VerifyEmail from "@/pages/verify-email";
// import VideoPreviewDemo from "@/pages/video-preview-demo";
// import VideoQuizDemo from "@/pages/video-quiz-demo";
// import VideoNotesDemo from "@/pages/video-notes-demo";
// import VideoAnalyticsDemo from "@/pages/video-analytics-demo";
// import AnalyticsDashboard from "@/pages/analytics-dashboard";
// import EnhancedAnalytics from "@/pages/enhanced-analytics";
// import RechartsShowcase from "@/pages/recharts-showcase";
// import InteractiveQuizDemo from "@/pages/interactive-quiz-demo";
// import InteractiveVideoQuiz from "@/pages/interactive-video-quiz";
// import ContentUploadDemo from "@/pages/content-upload-demo";
// import GamificationDashboard from "@/pages/gamification-dashboard";
// import CoursePreviewPage from "@/pages/course-preview";
// import PersonalizedLearningPage from "@/pages/personalized-learning";
// import CompanyLicenseManagement from "@/pages/company-license-management";
// import CompanyOnboarding from "@/pages/company-onboarding";
// import FeatureShowcase from "@/pages/feature-showcase";
// import CourseSkillTreeDemo from "@/pages/course-skill-tree-demo";
// import TestLogin from "@/pages/test-login";
// import JwtLoginDemo from "@/pages/jwt-login-demo";
// import TestAccountLogin from "@/pages/test-account-login";
// import Certificates from "@/pages/certificates";
// import Calendar from "@/pages/calendar";
// import Messages from "@/pages/messages";
// import AboutUs from "@/pages/about-us";
// import Contact from "@/pages/contact";
// import Careers from "@/pages/careers";
// import Terms from "@/pages/terms";
// import Privacy from "@/pages/privacy";
// import Cookies from "@/pages/cookies";
// import Accessibility from "@/pages/accessibility";
// import Blog from "@/pages/blog";
// import Press from "@/pages/press";
// import Partners from "@/pages/partners";
// import { useAuth } from "./hooks/useAuth";
// import { UserRole } from "@shared/schema";
// import { EmailVerificationProvider } from "./contexts/EmailVerificationContext";
// import { EmailVerificationBanner } from "./components/auth/email-verification-banner";
// import CookieConsent from "./components/cookie-consent";

// function Router() {
//   const { user, isLoading } = useAuth();
  
//   // Show skeleton or loading state while checking authentication
//   if (isLoading) {
//     return <div className="h-screen flex items-center justify-center">
//       <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
//     </div>;
//   }

//   // Function to wrap each component with the verification banner for authenticated users
//   const withVerificationBanner = (Component: React.ComponentType<any>) => (props: any) => {
//     return (
//       <>
//         {user && <EmailVerificationBanner />}
//         <Component {...props} />
//       </>
//     );
//   };

//   return (
//     <Switch>
//       {/* Public routes */}
//       <Route path="/" component={withVerificationBanner(Home)} />
//       <Route path="/about-us" component={withVerificationBanner(AboutUs)} />
//       <Route path="/contact" component={withVerificationBanner(Contact)} />
//       <Route path="/careers" component={withVerificationBanner(Careers)} />
//       <Route path="/terms" component={withVerificationBanner(Terms)} />
//       <Route path="/privacy" component={withVerificationBanner(Privacy)} />
//       <Route path="/cookies" component={withVerificationBanner(Cookies)} />
//       <Route path="/accessibility" component={withVerificationBanner(Accessibility)} />
//       <Route path="/blog" component={withVerificationBanner(Blog)} />
//       <Route path="/press" component={withVerificationBanner(Press)} />
//       <Route path="/partners" component={withVerificationBanner(Partners)} />
//       <Route path="/courses" component={withVerificationBanner(Courses)} />
//       <Route path="/courses/:id" component={withVerificationBanner(Course)} />
//       <Route path="/video-preview-demo" component={withVerificationBanner(VideoPreviewDemo)} />
//       <Route path="/video-quiz-demo" component={withVerificationBanner(VideoQuizDemo)} />
//       <Route path="/video-notes-demo" component={withVerificationBanner(VideoNotesDemo)} />
//       <Route path="/video-analytics-demo" component={withVerificationBanner(VideoAnalyticsDemo)} />
//       <Route path="/analytics-dashboard" component={withVerificationBanner(AnalyticsDashboard)} />
//       <Route path="/company-dashboard" component={withVerificationBanner(CompanyDashboard)} />
//       <Route path="/enhanced-analytics" component={withVerificationBanner(EnhancedAnalytics)} />
//       <Route path="/recharts-showcase" component={withVerificationBanner(RechartsShowcase)} />
//       <Route path="/interactive-quiz-demo" component={withVerificationBanner(InteractiveQuizDemo)} />
//       <Route path="/interactive-video-quiz" component={withVerificationBanner(InteractiveVideoQuiz)} />
//       <Route path="/content-upload-demo" component={withVerificationBanner(ContentUploadDemo)} />
//       <Route path="/course-preview" component={withVerificationBanner(CoursePreviewPage)} />
//       <Route path="/feature-showcase" component={withVerificationBanner(FeatureShowcase)} />
//       <Route path="/course-skill-tree-demo" component={withVerificationBanner(CourseSkillTreeDemo)} />
//       <Route path="/subscription-comparison" component={withVerificationBanner(SubscriptionComparison)} />
//       <Route path="/checkout-summary/:courseId" component={withVerificationBanner(CheckoutSummary)} />
//       <Route path="/login" component={Login} />
//       <Route path="/admin-login" component={AdminLogin} />
//       <Route path="/register" component={Register} />
//       <Route path="/forgot-password" component={ForgotPassword} />
//       <Route path="/reset-password/:token" component={ResetPassword} />
//       <Route path="/verify-email" component={VerifyEmail} />
//       <Route path="/test-login" component={TestLogin} />
//       <Route path="/jwt-login" component={JwtLoginDemo} />
//       <Route path="/test-account-login" component={TestAccountLogin} />
      
//       {/* Protected student routes */}
//       <Route path="/dashboard">
//         {user ? withVerificationBanner(Dashboard)({}) : <div>Please login to view your dashboard</div>}
//       </Route>
//       <Route path="/dashboard/courses">
//         {user ? withVerificationBanner(Courses)({}) : <div>Please login to view your courses</div>}
//       </Route>
//       <Route path="/dashboard/path">
//         {user ? withVerificationBanner(LearningPath)({}) : <div>Please login to view your learning path</div>}
//       </Route>
//       <Route path="/dashboard/certificates">
//         {user ? withVerificationBanner(Certificates)({}) : <div>Please login to view your certificates</div>}
//       </Route>
//       <Route path="/dashboard/calendar">
//         {user ? withVerificationBanner(Calendar)({}) : <div>Please login to view your calendar</div>}
//       </Route>
//       <Route path="/dashboard/messages">
//         {user ? withVerificationBanner(Messages)({}) : <div>Please login to view your messages</div>}
//       </Route>
//       <Route path="/profile">
//         {user ? withVerificationBanner(Profile)({}) : <div>Please login to view your profile</div>}
//       </Route>
//       <Route path="/settings">
//         {user ? withVerificationBanner(Settings)({}) : <div>Please login to view your settings</div>}
//       </Route>
//       <Route path="/learning-path">
//         {user ? withVerificationBanner(LearningPath)({}) : <div>Please login to view your learning path</div>}
//       </Route>
//       <Route path="/achievements">
//         {user ? withVerificationBanner(GamificationDashboard)({}) : <div>Please login to view your achievements</div>}
//       </Route>
//       <Route path="/gamification-dashboard">
//         {user ? withVerificationBanner(GamificationDashboard)({}) : <div>Please login to view your achievements</div>}
//       </Route>
//       <Route path="/personalized-learning">
//         {user ? withVerificationBanner(PersonalizedLearningPage)({}) : <div>Please login to view personalized learning paths</div>}
//       </Route>
//       <Route path="/subscriptions">
//         {user ? withVerificationBanner(Subscriptions)({}) : <div>Please login to manage subscriptions</div>}
//       </Route>
//       <Route path="/subscription-example">
//         {user ? withVerificationBanner(SubscriptionExample)({}) : <div>Please login to view subscription example</div>}
//       </Route>
//       <Route path="/help">
//         {user ? withVerificationBanner(Dashboard)({}) : <div>Please login to view help center</div>}
//       </Route>
      
//       {/* Role-specific routes */}
//       <Route path="/instructor-dashboard">
//         {user && user.role === UserRole.INSTRUCTOR ? withVerificationBanner(InstructorDashboard)({}) : <div>Access denied - Instructor role required</div>}
//       </Route>
//       <Route path="/admin">
//         {user && user.role === UserRole.INTERNAL_ADMIN ? withVerificationBanner(AdminDashboard)({}) : <div>Access denied - Internal Admin role required</div>}
//       </Route>
//       <Route path="/admin-dashboard">
//         {user && user.role === UserRole.INTERNAL_ADMIN ? withVerificationBanner(AdminDashboard)({}) : <div>Access denied - Internal Admin role required</div>}
//       </Route>
//       <Route path="/admin/subscriptions">
//         {user && user.role === UserRole.INTERNAL_ADMIN ? withVerificationBanner(AdminDashboard)({}) : <div>Access denied</div>}
//       </Route>
//       <Route path="/admin/settings">
//         {user && user.role === UserRole.INTERNAL_ADMIN ? withVerificationBanner(Settings)({}) : <div>Access denied</div>}
//       </Route>
//       <Route path="/admin/users">
//         {user && user.role === UserRole.INTERNAL_ADMIN ? withVerificationBanner(AdminDashboard)({}) : <div>Access denied</div>}
//       </Route>
//       <Route path="/admin/courses">
//         {user && user.role === UserRole.INTERNAL_ADMIN ? withVerificationBanner(AdminDashboard)({}) : <div>Access denied</div>}
//       </Route>
//       <Route path="/admin/companies">
//         {user && user.role === UserRole.INTERNAL_ADMIN ? withVerificationBanner(AdminDashboard)({}) : <div>Access denied</div>}
//       </Route>
//       <Route path="/admin/instructors">
//         {user && user.role === UserRole.INTERNAL_ADMIN ? withVerificationBanner(AdminDashboard)({}) : <div>Access denied</div>}
//       </Route>
//       <Route path="/company-admin">
//         {user && user.role === UserRole.COMPANY_ADMIN ? withVerificationBanner(CompanyDashboard)({}) : <div>Access denied</div>}
//       </Route>
//       <Route path="/company-dashboard">
//         {user && user.role === UserRole.COMPANY_ADMIN ? withVerificationBanner(CompanyDashboard)({}) : <div>Access denied - Company Admin role required</div>}
//       </Route>
//       <Route path="/company-admin/licenses">
//         {user && (user.role === UserRole.COMPANY_ADMIN || user.role === UserRole.INTERNAL_ADMIN) ? 
//           withVerificationBanner(CompanyLicenseManagement)({}) : 
//           <div>Access denied - Company Admin or Internal Admin role required</div>}
//       </Route>
//       <Route path="/enterprise-onboarding" component={withVerificationBanner(CompanyOnboarding)} />
//       <Route path="/instructor">
//         {user && user.role === UserRole.INSTRUCTOR ? withVerificationBanner(InstructorDashboard)({}) : <div>Access denied</div>}
//       </Route>
      
//       {/* Fallback to 404 */}
//       <Route component={NotFound} />
//     </Switch>
//   );
// }

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <EmailVerificationProvider>
//         <TooltipProvider>
//           <VoiceNavigationProvider>
//             <div className="min-h-screen flex flex-col">
//               <Header />
//               <div className="flex-1">
//                 <Router />
//               </div>
//               <Footer />
//             </div>
//             <CookieConsent />
//             <Toaster />
//           </VoiceNavigationProvider>
//         </TooltipProvider>
//       </EmailVerificationProvider>
//     </QueryClientProvider>
//   );
// }

// export default App;


//// ========================


import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Footer from "@/pages/footer";
import Header from "@/components/layout/header";
import { VoiceNavigationProvider } from "@/components/accessibility/voice-navigation-provider";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Courses from "@/pages/courses";
import Course from "@/pages/course-refine";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import LearningPath from "@/pages/learning-path";
import Subscriptions from "@/pages/subscriptions";
import SubscriptionComparison from "@/pages/subscription-comparison";
import CheckoutSummary from "@/pages/checkout-summary";
import AdminDashboard from "@/pages/admin-dashboard";
import CompanyDashboard from "@/pages/company-dashboard";
import InstructorDashboard from "@/pages/instructor-dashboard";
import AdminLogin from "@/pages/admin-login";
import SubscriptionExample from "@/pages/subscription-example";
import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import VerifyEmail from "@/pages/verify-email";
import VideoPreviewDemo from "@/pages/video-preview-demo";
import VideoQuizDemo from "@/pages/video-quiz-demo";
import VideoNotesDemo from "@/pages/video-notes-demo";
import VideoAnalyticsDemo from "@/pages/video-analytics-demo";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import EnhancedAnalytics from "@/pages/enhanced-analytics";
import RechartsShowcase from "@/pages/recharts-showcase";
import InteractiveQuizDemo from "@/pages/interactive-quiz-demo";
import InteractiveVideoQuiz from "@/pages/interactive-video-quiz";
import ContentUploadDemo from "@/pages/content-upload-demo";
import GamificationDashboard from "@/pages/gamification-dashboard";
import CoursePreviewPage from "@/pages/course-preview";
import PersonalizedLearningPage from "@/pages/personalized-learning";
import CompanyLicenseManagement from "@/pages/company-license-management";
import CompanyOnboarding from "@/pages/company-onboarding";
import FeatureShowcase from "@/pages/feature-showcase";
import CourseSkillTreeDemo from "@/pages/course-skill-tree-demo";
import TestLogin from "@/pages/test-login";
import JwtLoginDemo from "@/pages/jwt-login-demo";
import TestAccountLogin from "@/pages/test-account-login";
import Certificates from "@/pages/certificates";
import Calendar from "@/pages/calendar";
import Messages from "@/pages/messages";
import AboutUs from "@/pages/about-us";
import Contact from "@/pages/contact";
import Careers from "@/pages/careers";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import Cookies from "@/pages/cookies";
import Accessibility from "@/pages/accessibility";
import Blog from "@/pages/blog";
import Press from "@/pages/press";
import Partners from "@/pages/partners";
import { useAuth } from "./hooks/useAuth";
import { UserRole } from "@shared/schema";
import { EmailVerificationProvider } from "./contexts/EmailVerificationContext";
import { EmailVerificationBanner } from "./components/auth/email-verification-banner";
import CookieConsent from "./components/cookie-consent";

function Router() {
  const { user, isLoading } = useAuth();
  
  // Show skeleton or loading state while checking authentication
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>;
  }

  // Function to wrap each component with the verification banner for authenticated users
  const withVerificationBanner = (Component: React.ComponentType<any>) => (props: any) => {
    return (
      <>
        {user && <EmailVerificationBanner />}
        <Component {...props} />
      </>
    );
  };

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={withVerificationBanner(Home)} />
      <Route path="/about-us" component={withVerificationBanner(AboutUs)} />
      <Route path="/contact" component={withVerificationBanner(Contact)} />
      <Route path="/careers" component={withVerificationBanner(Careers)} />
      <Route path="/terms" component={withVerificationBanner(Terms)} />
      <Route path="/privacy" component={withVerificationBanner(Privacy)} />
      <Route path="/cookies" component={withVerificationBanner(Cookies)} />
      <Route path="/accessibility" component={withVerificationBanner(Accessibility)} />
      <Route path="/blog" component={withVerificationBanner(Blog)} />
      <Route path="/press" component={withVerificationBanner(Press)} />
      <Route path="/partners" component={withVerificationBanner(Partners)} />
      <Route path="/courses" component={withVerificationBanner(Courses)} />
      <Route path="/courses/:id" component={withVerificationBanner(Course)} />
      <Route path="/video-preview-demo" component={withVerificationBanner(VideoPreviewDemo)} />
      <Route path="/video-quiz-demo" component={withVerificationBanner(VideoQuizDemo)} />
      <Route path="/video-notes-demo" component={withVerificationBanner(VideoNotesDemo)} />
      <Route path="/video-analytics-demo" component={withVerificationBanner(VideoAnalyticsDemo)} />
      <Route path="/analytics-dashboard" component={withVerificationBanner(AnalyticsDashboard)} />
      <Route path="/company-dashboard" component={withVerificationBanner(CompanyDashboard)} />
      <Route path="/enhanced-analytics" component={withVerificationBanner(EnhancedAnalytics)} />
      <Route path="/recharts-showcase" component={withVerificationBanner(RechartsShowcase)} />
      <Route path="/interactive-quiz-demo" component={withVerificationBanner(InteractiveQuizDemo)} />
      <Route path="/interactive-video-quiz" component={withVerificationBanner(InteractiveVideoQuiz)} />
      <Route path="/content-upload-demo" component={withVerificationBanner(ContentUploadDemo)} />
      <Route path="/course-preview" component={withVerificationBanner(CoursePreviewPage)} />
      <Route path="/feature-showcase" component={withVerificationBanner(FeatureShowcase)} />
      <Route path="/course-skill-tree-demo" component={withVerificationBanner(CourseSkillTreeDemo)} />
      <Route path="/subscription-comparison" component={withVerificationBanner(SubscriptionComparison)} />
      <Route path="/checkout-summary/:courseId" component={withVerificationBanner(CheckoutSummary)} />
      <Route path="/login" component={Login} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password/:token" component={ResetPassword} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/test-login" component={TestLogin} />
      <Route path="/jwt-login" component={JwtLoginDemo} />
      <Route path="/test-account-login" component={TestAccountLogin} />
      
      {/* Protected student routes */}
      <Route path="/dashboard">
        {user ? withVerificationBanner(Dashboard)({}) : <div>Please login to view your dashboard</div>}
      </Route>
      <Route path="/dashboard/courses">
        {user ? withVerificationBanner(Courses)({}) : <div>Please login to view your courses</div>}
      </Route>
      <Route path="/dashboard/path">
        {user ? withVerificationBanner(LearningPath)({}) : <div>Please login to view your learning path</div>}
      </Route>
      <Route path="/dashboard/certificates">
        {user ? withVerificationBanner(Certificates)({}) : <div>Please login to view your certificates</div>}
      </Route>
      <Route path="/dashboard/calendar">
        {user ? withVerificationBanner(Calendar)({}) : <div>Please login to view your calendar</div>}
      </Route>
      <Route path="/dashboard/messages">
        {user ? withVerificationBanner(Messages)({}) : <div>Please login to view your messages</div>}
      </Route>
      <Route path="/profile">
        {user ? withVerificationBanner(Profile)({}) : <div>Please login to view your profile</div>}
      </Route>
      <Route path="/settings">
        {user ? withVerificationBanner(Settings)({}) : <div>Please login to view your settings</div>}
      </Route>
      <Route path="/learning-path">
        {user ? withVerificationBanner(LearningPath)({}) : <div>Please login to view your learning path</div>}
      </Route>
      <Route path="/achievements">
        {user ? withVerificationBanner(GamificationDashboard)({}) : <div>Please login to view your achievements</div>}
      </Route>
      <Route path="/gamification-dashboard">
        {user ? withVerificationBanner(GamificationDashboard)({}) : <div>Please login to view your achievements</div>}
      </Route>
      <Route path="/personalized-learning">
        {user ? withVerificationBanner(PersonalizedLearningPage)({}) : <div>Please login to view personalized learning paths</div>}
      </Route>
      <Route path="/subscriptions">
        {user ? withVerificationBanner(Subscriptions)({}) : <div>Please login to manage subscriptions</div>}
      </Route>
      <Route path="/help">
        {user ? withVerificationBanner(Dashboard)({}) : <div>Please login to view help center</div>}
      </Route>
      
      {/* Role-specific routes */}
      <Route path="/instructor-dashboard">
        {user && user.role === UserRole.INSTRUCTOR ? withVerificationBanner(InstructorDashboard)({}) : <div>Access denied - Instructor role required</div>}
      </Route>
      <Route path="/admin">
        {user && user.role === UserRole.INTERNAL_ADMIN ? withVerificationBanner(AdminDashboard)({}) : <div>Access denied - Internal Admin role required</div>}
      </Route>
      <Route path="/admin-dashboard">
        {user && user.role === UserRole.INTERNAL_ADMIN ? withVerificationBanner(AdminDashboard)({}) : <div>Access denied - Internal Admin role required</div>}
      </Route>
      <Route path="/admin/subscriptions">
        {user && user.role === UserRole.INTERNAL_ADMIN ? withVerificationBanner(AdminDashboard)({}) : <div>Access denied</div>}
      </Route>
      <Route path="/admin/settings">
        {user && user.role === UserRole.INTERNAL_ADMIN ? withVerificationBanner(Settings)({}) : <div>Access denied</div>}
      </Route>
      <Route path="/admin/users">
        {user && user.role === UserRole.INTERNAL_ADMIN ? withVerificationBanner(AdminDashboard)({}) : <div>Access denied</div>}
      </Route>
      <Route path="/admin/courses">
        {user && user.role === UserRole.INTERNAL_ADMIN ? withVerificationBanner(AdminDashboard)({}) : <div>Access denied</div>}
      </Route>
      <Route path="/admin/companies">
        {user && user.role === UserRole.INTERNAL_ADMIN ? withVerificationBanner(AdminDashboard)({}) : <div>Access denied</div>}
      </Route>
      <Route path="/admin/instructors">
        {user && user.role === UserRole.INTERNAL_ADMIN ? withVerificationBanner(AdminDashboard)({}) : <div>Access denied</div>}
      </Route>
      <Route path="/company-admin">
        {user && user.role === UserRole.COMPANY_ADMIN ? withVerificationBanner(CompanyDashboard)({}) : <div>Access denied</div>}
      </Route>
      <Route path="/company-dashboard">
        {user && user.role === UserRole.COMPANY_ADMIN ? withVerificationBanner(CompanyDashboard)({}) : <div>Access denied - Company Admin role required</div>}
      </Route>
      <Route path="/company-admin/licenses">
        {user && (user.role === UserRole.COMPANY_ADMIN || user.role === UserRole.INTERNAL_ADMIN) ? 
          withVerificationBanner(CompanyLicenseManagement)({}) : 
          <div>Access denied - Company Admin or Internal Admin role required</div>}
      </Route>
      <Route path="/enterprise-onboarding" component={withVerificationBanner(CompanyOnboarding)} />
      <Route path="/instructor">
        {user && user.role === UserRole.INSTRUCTOR ? withVerificationBanner(InstructorDashboard)({}) : <div>Access denied</div>}
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <EmailVerificationProvider>
        <TooltipProvider>
          <VoiceNavigationProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <div className="flex-1">
                <Router />
              </div>
              <Footer />
            </div>
            <CookieConsent />
            <Toaster />
          </VoiceNavigationProvider>
        </TooltipProvider>
      </EmailVerificationProvider>
    </QueryClientProvider>
  );
}

export default App;
