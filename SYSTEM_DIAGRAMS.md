# M4T Learning Platform - System Architecture Diagrams

## System Overview Diagram

```svg
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="800" height="600" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  
  <!-- Title -->
  <text x="400" y="30" text-anchor="middle" font-size="24" font-weight="bold" fill="#1e293b">
    M4T Learning Platform - System Architecture
  </text>
  
  <!-- Client Layer -->
  <rect x="50" y="70" width="700" height="120" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" rx="10"/>
  <text x="400" y="95" text-anchor="middle" font-size="18" font-weight="bold" fill="#1e40af">CLIENT LAYER</text>
  <text x="400" y="115" text-anchor="middle" font-size="14" fill="#1e40af">React Frontend (Vite Build)</text>
  
  <!-- Client Components -->
  <rect x="70" y="125" width="120" height="50" fill="#93c5fd" stroke="#2563eb" rx="5"/>
  <text x="130" y="145" text-anchor="middle" font-size="12" fill="#1e40af">Authentication</text>
  <text x="130" y="160" text-anchor="middle" font-size="12" fill="#1e40af">& Authorization</text>
  
  <rect x="210" y="125" width="120" height="50" fill="#93c5fd" stroke="#2563eb" rx="5"/>
  <text x="270" y="145" text-anchor="middle" font-size="12" fill="#1e40af">Course</text>
  <text x="270" y="160" text-anchor="middle" font-size="12" fill="#1e40af">Management</text>
  
  <rect x="350" y="125" width="120" height="50" fill="#93c5fd" stroke="#2563eb" rx="5"/>
  <text x="410" y="145" text-anchor="middle" font-size="12" fill="#1e40af">Payment</text>
  <text x="410" y="160" text-anchor="middle" font-size="12" fill="#1e40af">Processing</text>
  
  <rect x="490" y="125" width="120" height="50" fill="#93c5fd" stroke="#2563eb" rx="5"/>
  <text x="550" y="145" text-anchor="middle" font-size="12" fill="#1e40af">Gamification</text>
  <text x="550" y="160" text-anchor="middle" font-size="12" fill="#1e40af">Dashboard</text>
  
  <rect x="630" y="125" width="100" height="50" fill="#93c5fd" stroke="#2563eb" rx="5"/>
  <text x="680" y="145" text-anchor="middle" font-size="12" fill="#1e40af">Real-time</text>
  <text x="680" y="160" text-anchor="middle" font-size="12" fill="#1e40af">Analytics</text>
  
  <!-- Connection Line -->
  <line x1="400" y1="210" x2="400" y2="240" stroke="#6b7280" stroke-width="3" marker-end="url(#arrowhead)"/>
  <text x="420" y="230" font-size="12" fill="#6b7280">HTTP/WebSocket</text>
  
  <!-- Server Layer -->
  <rect x="50" y="260" width="700" height="160" fill="#dcfce7" stroke="#16a34a" stroke-width="2" rx="10"/>
  <text x="400" y="285" text-anchor="middle" font-size="18" font-weight="bold" fill="#15803d">SERVER LAYER</text>
  <text x="400" y="305" text-anchor="middle" font-size="14" fill="#15803d">Express.js API Server with TypeScript</text>
  
  <!-- Server Components -->
  <rect x="70" y="320" width="100" height="45" fill="#86efac" stroke="#16a34a" rx="5"/>
  <text x="120" y="335" text-anchor="middle" font-size="11" fill="#15803d">JWT Auth</text>
  <text x="120" y="350" text-anchor="middle" font-size="11" fill="#15803d">Middleware</text>
  
  <rect x="190" y="320" width="100" height="45" fill="#86efac" stroke="#16a34a" rx="5"/>
  <text x="240" y="335" text-anchor="middle" font-size="11" fill="#15803d">RESTful</text>
  <text x="240" y="350" text-anchor="middle" font-size="11" fill="#15803d">API Routes</text>
  
  <rect x="310" y="320" width="100" height="45" fill="#86efac" stroke="#16a34a" rx="5"/>
  <text x="360" y="335" text-anchor="middle" font-size="11" fill="#15803d">WebSocket</text>
  <text x="360" y="350" text-anchor="middle" font-size="11" fill="#15803d">Real-time</text>
  
  <rect x="430" y="320" width="100" height="45" fill="#86efac" stroke="#16a34a" rx="5"/>
  <text x="480" y="335" text-anchor="middle" font-size="11" fill="#15803d">Third-party</text>
  <text x="480" y="350" text-anchor="middle" font-size="11" fill="#15803d">Integration</text>
  
  <rect x="550" y="320" width="100" height="45" fill="#86efac" stroke="#16a34a" rx="5"/>
  <text x="600" y="335" text-anchor="middle" font-size="11" fill="#15803d">Business</text>
  <text x="600" y="350" text-anchor="middle" font-size="11" fill="#15803d">Logic Layer</text>
  
  <!-- Third-party Services -->
  <rect x="480" y="375" width="30" height="25" fill="#fef3c7" stroke="#f59e0b" rx="3"/>
  <text x="495" y="390" text-anchor="middle" font-size="9" fill="#92400e">Stripe</text>
  
  <rect x="520" y="375" width="35" height="25" fill="#fef3c7" stroke="#f59e0b" rx="3"/>
  <text x="537" y="390" text-anchor="middle" font-size="9" fill="#92400e">SendGrid</text>
  
  <rect x="565" y="375" width="30" height="25" fill="#fef3c7" stroke="#f59e0b" rx="3"/>
  <text x="580" y="390" text-anchor="middle" font-size="9" fill="#92400e">OpenAI</text>
  
  <!-- Connection Line -->
  <line x1="400" y1="440" x2="400" y2="470" stroke="#6b7280" stroke-width="3" marker-end="url(#arrowhead)"/>
  <text x="420" y="460" font-size="12" fill="#6b7280">Database ORM</text>
  
  <!-- Database Layer -->
  <rect x="50" y="490" width="700" height="80" fill="#fce7f3" stroke="#ec4899" stroke-width="2" rx="10"/>
  <text x="400" y="515" text-anchor="middle" font-size="18" font-weight="bold" fill="#be185d">DATABASE LAYER</text>
  <text x="400" y="535" text-anchor="middle" font-size="14" fill="#be185d">PostgreSQL Database with Drizzle ORM</text>
  
  <!-- Database Components -->
  <rect x="80" y="545" width="110" height="20" fill="#f9a8d4" stroke="#ec4899" rx="3"/>
  <text x="135" y="558" text-anchor="middle" font-size="10" fill="#be185d">User Management</text>
  
  <rect x="210" y="545" width="110" height="20" fill="#f9a8d4" stroke="#ec4899" rx="3"/>
  <text x="265" y="558" text-anchor="middle" font-size="10" fill="#be185d">Course & Content</text>
  
  <rect x="340" y="545" width="110" height="20" fill="#f9a8d4" stroke="#ec4899" rx="3"/>
  <text x="395" y="558" text-anchor="middle" font-size="10" fill="#be185d">Payment Records</text>
  
  <rect x="470" y="545" width="110" height="20" fill="#f9a8d4" stroke="#ec4899" rx="3"/>
  <text x="525" y="558" text-anchor="middle" font-size="10" fill="#be185d">Gamification Data</text>
  
  <rect x="600" y="545" width="110" height="20" fill="#f9a8d4" stroke="#ec4899" rx="3"/>
  <text x="655" y="558" text-anchor="middle" font-size="10" fill="#be185d">Analytics & Reports</text>
  
  <!-- Arrow marker definition -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280"/>
    </marker>
  </defs>
</svg>
```

## User Flow Diagram

```svg
<svg width="1000" height="700" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1000" height="700" fill="#fafafa" stroke="#e5e7eb" stroke-width="2"/>
  
  <!-- Title -->
  <text x="500" y="30" text-anchor="middle" font-size="24" font-weight="bold" fill="#111827">
    User Journey Flow - M4T Learning Platform
  </text>
  
  <!-- Student Journey -->
  <text x="50" y="70" font-size="18" font-weight="bold" fill="#3b82f6">Student Journey</text>
  
  <!-- Registration -->
  <rect x="50" y="90" width="100" height="60" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" rx="8"/>
  <text x="100" y="115" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e40af">Registration</text>
  <text x="100" y="130" text-anchor="middle" font-size="10" fill="#1e40af">Email & Role</text>
  <text x="100" y="142" text-anchor="middle" font-size="10" fill="#1e40af">Selection</text>
  
  <!-- Arrow -->
  <line x1="150" y1="120" x2="180" y2="120" stroke="#6b7280" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Dashboard -->
  <rect x="190" y="90" width="100" height="60" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" rx="8"/>
  <text x="240" y="115" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e40af">Dashboard</text>
  <text x="240" y="130" text-anchor="middle" font-size="10" fill="#1e40af">Course Browse</text>
  <text x="240" y="142" text-anchor="middle" font-size="10" fill="#1e40af">& Recommendations</text>
  
  <!-- Arrow -->
  <line x1="290" y1="120" x2="320" y2="120" stroke="#6b7280" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Course Selection -->
  <rect x="330" y="90" width="100" height="60" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" rx="8"/>
  <text x="380" y="115" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e40af">Course</text>
  <text x="380" y="127" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e40af">Selection</text>
  <text x="380" y="142" text-anchor="middle" font-size="10" fill="#1e40af">Details & Reviews</text>
  
  <!-- Arrow -->
  <line x1="430" y1="120" x2="460" y2="120" stroke="#6b7280" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Payment -->
  <rect x="470" y="90" width="100" height="60" fill="#fee2e2" stroke="#ef4444" stroke-width="2" rx="8"/>
  <text x="520" y="115" text-anchor="middle" font-size="12" font-weight="bold" fill="#dc2626">Payment</text>
  <text x="520" y="130" text-anchor="middle" font-size="10" fill="#dc2626">Stripe Checkout</text>
  <text x="520" y="142" text-anchor="middle" font-size="10" fill="#dc2626">& Confirmation</text>
  
  <!-- Arrow -->
  <line x1="570" y1="120" x2="600" y2="120" stroke="#6b7280" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Learning -->
  <rect x="610" y="90" width="100" height="60" fill="#dcfce7" stroke="#16a34a" stroke-width="2" rx="8"/>
  <text x="660" y="115" text-anchor="middle" font-size="12" font-weight="bold" fill="#15803d">Learning</text>
  <text x="660" y="130" text-anchor="middle" font-size="10" fill="#15803d">Module Progress</text>
  <text x="660" y="142" text-anchor="middle" font-size="10" fill="#15803d">& Assessments</text>
  
  <!-- Instructor Journey -->
  <text x="50" y="220" font-size="18" font-weight="bold" fill="#7c3aed">Instructor Journey</text>
  
  <!-- Course Creation -->
  <rect x="50" y="240" width="100" height="60" fill="#ede9fe" stroke="#7c3aed" stroke-width="2" rx="8"/>
  <text x="100" y="265" text-anchor="middle" font-size="12" font-weight="bold" fill="#6d28d9">Course</text>
  <text x="100" y="277" text-anchor="middle" font-size="12" font-weight="bold" fill="#6d28d9">Creation</text>
  <text x="100" y="292" text-anchor="middle" font-size="10" fill="#6d28d9">Title & Description</text>
  
  <!-- Arrow -->
  <line x1="150" y1="270" x2="180" y2="270" stroke="#6b7280" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Content Upload -->
  <rect x="190" y="240" width="100" height="60" fill="#ede9fe" stroke="#7c3aed" stroke-width="2" rx="8"/>
  <text x="240" y="265" text-anchor="middle" font-size="12" font-weight="bold" fill="#6d28d9">Content</text>
  <text x="240" y="277" text-anchor="middle" font-size="12" font-weight="bold" fill="#6d28d9">Upload</text>
  <text x="240" y="292" text-anchor="middle" font-size="10" fill="#6d28d9">Videos & Materials</text>
  
  <!-- Arrow -->
  <line x1="290" y1="270" x2="320" y2="270" stroke="#6b7280" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Pricing Setup -->
  <rect x="330" y="240" width="100" height="60" fill="#ede9fe" stroke="#7c3aed" stroke-width="2" rx="8"/>
  <text x="380" y="265" text-anchor="middle" font-size="12" font-weight="bold" fill="#6d28d9">Pricing</text>
  <text x="380" y="277" text-anchor="middle" font-size="12" font-weight="bold" fill="#6d28d9">Setup</text>
  <text x="380" y="292" text-anchor="middle" font-size="10" fill="#6d28d9">Stripe Integration</text>
  
  <!-- Arrow -->
  <line x1="430" y1="270" x2="460" y2="270" stroke="#6b7280" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Publish -->
  <rect x="470" y="240" width="100" height="60" fill="#ede9fe" stroke="#7c3aed" stroke-width="2" rx="8"/>
  <text x="520" y="265" text-anchor="middle" font-size="12" font-weight="bold" fill="#6d28d9">Publish</text>
  <text x="520" y="280" text-anchor="middle" font-size="10" fill="#6d28d9">Course Review</text>
  <text x="520" y="292" text-anchor="middle" font-size="10" fill="#6d28d9">& Go Live</text>
  
  <!-- Arrow -->
  <line x1="570" y1="270" x2="600" y2="270" stroke="#6b7280" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Student Management -->
  <rect x="610" y="240" width="100" height="60" fill="#ede9fe" stroke="#7c3aed" stroke-width="2" rx="8"/>
  <text x="660" y="265" text-anchor="middle" font-size="12" font-weight="bold" fill="#6d28d9">Student</text>
  <text x="660" y="277" text-anchor="middle" font-size="12" font-weight="bold" fill="#6d28d9">Management</text>
  <text x="660" y="292" text-anchor="middle" font-size="10" fill="#6d28d9">Analytics & Support</text>
  
  <!-- Admin Journey -->
  <text x="50" y="370" font-size="18" font-weight="bold" fill="#dc2626">Admin Journey</text>
  
  <!-- Company Setup -->
  <rect x="50" y="390" width="120" height="60" fill="#fee2e2" stroke="#dc2626" stroke-width="2" rx="8"/>
  <text x="110" y="415" text-anchor="middle" font-size="12" font-weight="bold" fill="#dc2626">Company</text>
  <text x="110" y="427" text-anchor="middle" font-size="12" font-weight="bold" fill="#dc2626">Setup</text>
  <text x="110" y="442" text-anchor="middle" font-size="10" fill="#dc2626">Branding & Config</text>
  
  <!-- Arrow -->
  <line x1="170" y1="420" x2="200" y2="420" stroke="#6b7280" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- User Management -->
  <rect x="210" y="390" width="120" height="60" fill="#fee2e2" stroke="#dc2626" stroke-width="2" rx="8"/>
  <text x="270" y="415" text-anchor="middle" font-size="12" font-weight="bold" fill="#dc2626">User</text>
  <text x="270" y="427" text-anchor="middle" font-size="12" font-weight="bold" fill="#dc2626">Management</text>
  <text x="270" y="442" text-anchor="middle" font-size="10" fill="#dc2626">Roles & Permissions</text>
  
  <!-- Arrow -->
  <line x1="330" y1="420" x2="360" y2="420" stroke="#6b7280" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- License Management -->
  <rect x="370" y="390" width="120" height="60" fill="#fee2e2" stroke="#dc2626" stroke-width="2" rx="8"/>
  <text x="430" y="415" text-anchor="middle" font-size="12" font-weight="bold" fill="#dc2626">License</text>
  <text x="430" y="427" text-anchor="middle" font-size="12" font-weight="bold" fill="#dc2626">Management</text>
  <text x="430" y="442" text-anchor="middle" font-size="10" fill="#dc2626">Subscriptions</text>
  
  <!-- Arrow -->
  <line x1="490" y1="420" x2="520" y2="420" stroke="#6b7280" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Analytics -->
  <rect x="530" y="390" width="120" height="60" fill="#fee2e2" stroke="#dc2626" stroke-width="2" rx="8"/>
  <text x="590" y="415" text-anchor="middle" font-size="12" font-weight="bold" fill="#dc2626">Analytics</text>
  <text x="590" y="430" text-anchor="middle" font-size="10" fill="#dc2626">Reports & Insights</text>
  <text x="590" y="442" text-anchor="middle" font-size="10" fill="#dc2626">Performance Metrics</text>
  
  <!-- Gamification Flow -->
  <text x="50" y="520" font-size="18" font-weight="bold" fill="#059669">Gamification System</text>
  
  <!-- Points System -->
  <rect x="50" y="540" width="90" height="50" fill="#d1fae5" stroke="#059669" stroke-width="2" rx="8"/>
  <text x="95" y="560" text-anchor="middle" font-size="11" font-weight="bold" fill="#047857">Points</text>
  <text x="95" y="575" text-anchor="middle" font-size="9" fill="#047857">Earned for completion</text>
  
  <!-- Arrow -->
  <line x1="140" y1="565" x2="160" y2="565" stroke="#6b7280" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Badges -->
  <rect x="170" y="540" width="90" height="50" fill="#d1fae5" stroke="#059669" stroke-width="2" rx="8"/>
  <text x="215" y="560" text-anchor="middle" font-size="11" font-weight="bold" fill="#047857">Badges</text>
  <text x="215" y="575" text-anchor="middle" font-size="9" fill="#047857">Achievement unlocks</text>
  
  <!-- Arrow -->
  <line x1="260" y1="565" x2="280" y2="565" stroke="#6b7280" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Leaderboard -->
  <rect x="290" y="540" width="90" height="50" fill="#d1fae5" stroke="#059669" stroke-width="2" rx="8"/>
  <text x="335" y="560" text-anchor="middle" font-size="11" font-weight="bold" fill="#047857">Leaderboard</text>
  <text x="335" y="575" text-anchor="middle" font-size="9" fill="#047857">Competition ranking</text>
  
  <!-- Arrow -->
  <line x1="380" y1="565" x2="400" y2="565" stroke="#6b7280" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Challenges -->
  <rect x="410" y="540" width="90" height="50" fill="#d1fae5" stroke="#059669" stroke-width="2" rx="8"/>
  <text x="455" y="560" text-anchor="middle" font-size="11" font-weight="bold" fill="#047857">Challenges</text>
  <text x="455" y="575" text-anchor="middle" font-size="9" fill="#047857">Special events</text>
  
  <!-- Payment Processing Flow -->
  <text x="750" y="70" font-size="18" font-weight="bold" fill="#f59e0b">Payment Processing</text>
  
  <!-- Individual Payment -->
  <rect x="750" y="90" width="120" height="40" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="5"/>
  <text x="810" y="108" text-anchor="middle" font-size="11" font-weight="bold" fill="#92400e">Individual Course</text>
  <text x="810" y="122" text-anchor="middle" font-size="10" fill="#92400e">One-time Payment</text>
  
  <!-- Subscription Payment -->
  <rect x="750" y="140" width="120" height="40" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="5"/>
  <text x="810" y="158" text-anchor="middle" font-size="11" font-weight="bold" fill="#92400e">Corporate License</text>
  <text x="810" y="172" text-anchor="middle" font-size="10" fill="#92400e">Monthly Subscription</text>
  
  <!-- Stripe Integration -->
  <rect x="750" y="200" width="120" height="60" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="8"/>
  <text x="810" y="220" text-anchor="middle" font-size="12" font-weight="bold" fill="#92400e">Stripe</text>
  <text x="810" y="232" text-anchor="middle" font-size="12" font-weight="bold" fill="#92400e">Integration</text>
  <text x="810" y="247" text-anchor="middle" font-size="10" fill="#92400e">Secure Processing</text>
  <text x="810" y="257" text-anchor="middle" font-size="10" fill="#92400e">& Webhooks</text>
  
  <!-- Mobile Experience -->
  <text x="750" y="320" font-size="18" font-weight="bold" fill="#8b5cf6">Mobile Experience</text>
  
  <!-- Responsive Design -->
  <rect x="750" y="340" width="120" height="50" fill="#f3e8ff" stroke="#8b5cf6" stroke-width="2" rx="8"/>
  <text x="810" y="360" text-anchor="middle" font-size="11" font-weight="bold" fill="#7c3aed">Responsive</text>
  <text x="810" y="372" text-anchor="middle" font-size="11" font-weight="bold" fill="#7c3aed">Design</text>
  <text x="810" y="385" text-anchor="middle" font-size="9" fill="#7c3aed">Touch-optimized UI</text>
  
  <!-- Offline Mode -->
  <rect x="750" y="400" width="120" height="50" fill="#f3e8ff" stroke="#8b5cf6" stroke-width="2" rx="8"/>
  <text x="810" y="420" text-anchor="middle" font-size="11" font-weight="bold" fill="#7c3aed">Offline Mode</text>
  <text x="810" y="435" text-anchor="middle" font-size="9" fill="#7c3aed">Download & sync</text>
  
  <!-- Progressive Web App -->
  <rect x="750" y="460" width="120" height="50" fill="#f3e8ff" stroke="#8b5cf6" stroke-width="2" rx="8"/>
  <text x="810" y="480" text-anchor="middle" font-size="11" font-weight="bold" fill="#7c3aed">PWA Features</text>
  <text x="810" y="495" text-anchor="middle" font-size="9" fill="#7c3aed">App-like experience</text>
  
  <!-- Technology Stack -->
  <text x="50" y="650" font-size="16" font-weight="bold" fill="#374151">Technology Stack:</text>
  <text x="200" y="665" font-size="12" fill="#374151">Frontend: React + TypeScript + Vite + Tailwind CSS</text>
  <text x="200" y="680" font-size="12" fill="#374151">Backend: Express.js + TypeScript + Drizzle ORM + PostgreSQL</text>
  <text x="200" y="695" font-size="12" fill="#374151">Services: Stripe, SendGrid, OpenAI, WebSocket</text>
  
  <!-- Arrow marker -->
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#6b7280"/>
    </marker>
  </defs>
</svg>
```

## Database Relationship Diagram

```svg
<svg width="900" height="800" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="900" height="800" fill="#f9fafb" stroke="#e5e7eb" stroke-width="2"/>
  
  <!-- Title -->
  <text x="450" y="30" text-anchor="middle" font-size="24" font-weight="bold" fill="#111827">
    Database Schema - Entity Relationships
  </text>
  
  <!-- Users Table -->
  <rect x="50" y="60" width="180" height="120" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" rx="8"/>
  <text x="140" y="80" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e40af">Users</text>
  <line x1="60" y1="85" x2="220" y2="85" stroke="#3b82f6" stroke-width="1"/>
  <text x="60" y="100" font-size="11" fill="#1e40af">• id (PK)</text>
  <text x="60" y="115" font-size="11" fill="#1e40af">• email</text>
  <text x="60" y="130" font-size="11" fill="#1e40af">• password_hash</text>
  <text x="60" y="145" font-size="11" fill="#1e40af">• role</text>
  <text x="60" y="160" font-size="11" fill="#1e40af">• created_at</text>
  <text x="60" y="175" font-size="11" fill="#1e40af">• updated_at</text>
  
  <!-- User Profiles Table -->
  <rect x="280" y="60" width="180" height="120" fill="#dcfce7" stroke="#16a34a" stroke-width="2" rx="8"/>
  <text x="370" y="80" text-anchor="middle" font-size="14" font-weight="bold" fill="#15803d">User Profiles</text>
  <line x1="290" y1="85" x2="450" y2="85" stroke="#16a34a" stroke-width="1"/>
  <text x="290" y="100" font-size="11" fill="#15803d">• user_id (FK)</text>
  <text x="290" y="115" font-size="11" fill="#15803d">• first_name</text>
  <text x="290" y="130" font-size="11" fill="#15803d">• last_name</text>
  <text x="290" y="145" font-size="11" fill="#15803d">• avatar_url</text>
  <text x="290" y="160" font-size="11" fill="#15803d">• bio</text>
  <text x="290" y="175" font-size="11" fill="#15803d">• preferences</text>
  
  <!-- Companies Table -->
  <rect x="510" y="60" width="180" height="120" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="8"/>
  <text x="600" y="80" text-anchor="middle" font-size="14" font-weight="bold" fill="#92400e">Companies</text>
  <line x1="520" y1="85" x2="680" y2="85" stroke="#f59e0b" stroke-width="1"/>
  <text x="520" y="100" font-size="11" fill="#92400e">• id (PK)</text>
  <text x="520" y="115" font-size="11" fill="#92400e">• name</text>
  <text x="520" y="130" font-size="11" fill="#92400e">• subdomain</text>
  <text x="520" y="145" font-size="11" fill="#92400e">• settings</text>
  <text x="520" y="160" font-size="11" fill="#92400e">• created_at</text>
  <text x="520" y="175" font-size="11" fill="#92400e">• license_count</text>
  
  <!-- Courses Table -->
  <rect x="50" y="220" width="180" height="140" fill="#ede9fe" stroke="#7c3aed" stroke-width="2" rx="8"/>
  <text x="140" y="240" text-anchor="middle" font-size="14" font-weight="bold" fill="#6d28d9">Courses</text>
  <line x1="60" y1="245" x2="220" y2="245" stroke="#7c3aed" stroke-width="1"/>
  <text x="60" y="260" font-size="11" fill="#6d28d9">• id (PK)</text>
  <text x="60" y="275" font-size="11" fill="#6d28d9">• title</text>
  <text x="60" y="290" font-size="11" fill="#6d28d9">• description</text>
  <text x="60" y="305" font-size="11" fill="#6d28d9">• instructor_id (FK)</text>
  <text x="60" y="320" font-size="11" fill="#6d28d9">• company_id (FK)</text>
  <text x="60" y="335" font-size="11" fill="#6d28d9">• price</text>
  <text x="60" y="350" font-size="11" fill="#6d28d9">• status</text>
  
  <!-- Course Modules Table -->
  <rect x="280" y="220" width="180" height="120" fill="#fee2e2" stroke="#ef4444" stroke-width="2" rx="8"/>
  <text x="370" y="240" text-anchor="middle" font-size="14" font-weight="bold" fill="#dc2626">Course Modules</text>
  <line x1="290" y1="245" x2="450" y2="245" stroke="#ef4444" stroke-width="1"/>
  <text x="290" y="260" font-size="11" fill="#dc2626">• id (PK)</text>
  <text x="290" y="275" font-size="11" fill="#dc2626">• course_id (FK)</text>
  <text x="290" y="290" font-size="11" fill="#dc2626">• title</text>
  <text x="290" y="305" font-size="11" fill="#dc2626">• order_index</text>
  <text x="290" y="320" font-size="11" fill="#dc2626">• content</text>
  <text x="290" y="335" font-size="11" fill="#dc2626">• video_url</text>
  
  <!-- Course Enrollments Table -->
  <rect x="510" y="220" width="180" height="120" fill="#f0f9ff" stroke="#0ea5e9" stroke-width="2" rx="8"/>
  <text x="600" y="240" text-anchor="middle" font-size="14" font-weight="bold" fill="#0369a1">Enrollments</text>
  <line x1="520" y1="245" x2="680" y2="245" stroke="#0ea5e9" stroke-width="1"/>
  <text x="520" y="260" font-size="11" fill="#0369a1">• user_id (FK)</text>
  <text x="520" y="275" font-size="11" fill="#0369a1">• course_id (FK)</text>
  <text x="520" y="290" font-size="11" fill="#0369a1">• enrolled_at</text>
  <text x="520" y="305" font-size="11" fill="#0369a1">• progress</text>
  <text x="520" y="320" font-size="11" fill="#0369a1">• completed_at</text>
  <text x="520" y="335" font-size="11" fill="#0369a1">• certificate_url</text>
  
  <!-- Payments Table -->
  <rect x="50" y="400" width="180" height="120" fill="#ecfdf5" stroke="#10b981" stroke-width="2" rx="8"/>
  <text x="140" y="420" text-anchor="middle" font-size="14" font-weight="bold" fill="#059669">Payments</text>
  <line x1="60" y1="425" x2="220" y2="425" stroke="#10b981" stroke-width="1"/>
  <text x="60" y="440" font-size="11" fill="#059669">• id (PK)</text>
  <text x="60" y="455" font-size="11" fill="#059669">• user_id (FK)</text>
  <text x="60" y="470" font-size="11" fill="#059669">• amount</text>
  <text x="60" y="485" font-size="11" fill="#059669">• stripe_payment_id</text>
  <text x="60" y="500" font-size="11" fill="#059669">• status</text>
  <text x="60" y="515" font-size="11" fill="#059669">• created_at</text>
  
  <!-- Subscriptions Table -->
  <rect x="280" y="400" width="180" height="120" fill="#fef7ff" stroke="#a855f7" stroke-width="2" rx="8"/>
  <text x="370" y="420" text-anchor="middle" font-size="14" font-weight="bold" fill="#9333ea">Subscriptions</text>
  <line x1="290" y1="425" x2="450" y2="425" stroke="#a855f7" stroke-width="1"/>
  <text x="290" y="440" font-size="11" fill="#9333ea">• id (PK)</text>
  <text x="290" y="455" font-size="11" fill="#9333ea">• user_id (FK)</text>
  <text x="290" y="470" font-size="11" fill="#9333ea">• plan_type</text>
  <text x="290" y="485" font-size="11" fill="#9333ea">• stripe_sub_id</text>
  <text x="290" y="500" font-size="11" fill="#9333ea">• status</text>
  <text x="290" y="515" font-size="11" fill="#9333ea">• renewal_date</text>
  
  <!-- Achievements Table -->
  <rect x="510" y="400" width="180" height="120" fill="#fffbeb" stroke="#f59e0b" stroke-width="2" rx="8"/>
  <text x="600" y="420" text-anchor="middle" font-size="14" font-weight="bold" fill="#d97706">Achievements</text>
  <line x1="520" y1="425" x2="680" y2="425" stroke="#f59e0b" stroke-width="1"/>
  <text x="520" y="440" font-size="11" fill="#d97706">• id (PK)</text>
  <text x="520" y="455" font-size="11" fill="#d97706">• title</text>
  <text x="520" y="470" font-size="11" fill="#d97706">• description</text>
  <text x="520" y="485" font-size="11" fill="#d97706">• points</text>
  <text x="520" y="500" font-size="11" fill="#d97706">• badge_icon</text>
  <text x="520" y="515" font-size="11" fill="#d97706">• criteria</text>
  
  <!-- User Achievements Table -->
  <rect x="720" y="400" width="150" height="100" fill="#fef2f2" stroke="#f87171" stroke-width="2" rx="8"/>
  <text x="795" y="420" text-anchor="middle" font-size="14" font-weight="bold" fill="#dc2626">User Achievements</text>
  <line x1="730" y1="425" x2="860" y2="425" stroke="#f87171" stroke-width="1"/>
  <text x="730" y="440" font-size="11" fill="#dc2626">• user_id (FK)</text>
  <text x="730" y="455" font-size="11" fill="#dc2626">• achievement_id (FK)</text>
  <text x="730" y="470" font-size="11" fill="#dc2626">• earned_at</text>
  <text x="730" y="485" font-size="11" fill="#dc2626">• progress</text>
  
  <!-- Analytics Table -->
  <rect x="50" y="560" width="200" height="120" fill="#f0fdf4" stroke="#22c55e" stroke-width="2" rx="8"/>
  <text x="150" y="580" text-anchor="middle" font-size="14" font-weight="bold" fill="#16a34a">Learning Analytics</text>
  <line x1="60" y1="585" x2="240" y2="585" stroke="#22c55e" stroke-width="1"/>
  <text x="60" y="600" font-size="11" fill="#16a34a">• user_id (FK)</text>
  <text x="60" y="615" font-size="11" fill="#16a34a">• course_id (FK)</text>
  <text x="60" y="630" font-size="11" fill="#16a34a">• session_duration</text>
  <text x="60" y="645" font-size="11" fill="#16a34a">• completion_rate</text>
  <text x="60" y="660" font-size="11" fill="#16a34a">• engagement_score</text>
  <text x="60" y="675" font-size="11" fill="#16a34a">• created_at</text>
  
  <!-- Relationship Lines -->
  <!-- Users to User Profiles (1:1) -->
  <line x1="230" y1="120" x2="280" y2="120" stroke="#374151" stroke-width="2"/>
  <text x="245" y="115" font-size="10" fill="#374151">1:1</text>
  
  <!-- Users to Courses (1:M) -->
  <line x1="140" y1="180" x2="140" y2="220" stroke="#374151" stroke-width="2"/>
  <text x="145" y="205" font-size="10" fill="#374151">1:M</text>
  
  <!-- Courses to Course Modules (1:M) -->
  <line x1="230" y1="280" x2="280" y2="280" stroke="#374151" stroke-width="2"/>
  <text x="245" y="275" font-size="10" fill="#374151">1:M</text>
  
  <!-- Users to Enrollments (1:M) -->
  <line x1="230" y1="140" x2="520" y2="140" stroke="#374151" stroke-width="2"/>
  <line x1="520" y1="140" x2="520" y2="220" stroke="#374151" stroke-width="2"/>
  <text x="370" y="135" font-size="10" fill="#374151">1:M</text>
  
  <!-- Courses to Enrollments (1:M) -->
  <line x1="230" y1="300" x2="520" y2="300" stroke="#374151" stroke-width="2"/>
  <line x1="520" y1="300" x2="520" y2="340" stroke="#374151" stroke-width="2"/>
  <text x="370" y="295" font-size="10" fill="#374151">1:M</text>
  
  <!-- Users to Payments (1:M) -->
  <line x1="140" y1="180" x2="140" y2="400" stroke="#374151" stroke-width="2"/>
  <text x="145" y="290" font-size="10" fill="#374151">1:M</text>
  
  <!-- Users to Subscriptions (1:M) -->
  <line x1="230" y1="160" x2="290" y2="160" stroke="#374151" stroke-width="2"/>
  <line x1="290" y1="160" x2="290" y2="400" stroke="#374151" stroke-width="2"/>
  <text x="250" y="155" font-size="10" fill="#374151">1:M</text>
  
  <!-- Users to User Achievements (M:M) -->
  <line x1="230" y1="100" x2="720" y2="100" stroke="#374151" stroke-width="2"/>
  <line x1="720" y1="100" x2="720" y2="400" stroke="#374151" stroke-width="2"/>
  <text x="470" y="95" font-size="10" fill="#374151">M:M</text>
  
  <!-- Achievements to User Achievements (1:M) -->
  <line x1="690" y1="460" x2="720" y2="460" stroke="#374151" stroke-width="2"/>
  <text x="695" y="455" font-size="10" fill="#374151">1:M</text>
  
  <!-- Legend -->
  <text x="50" y="750" font-size="16" font-weight="bold" fill="#374151">Relationship Legend:</text>
  <text x="50" y="770" font-size="12" fill="#374151">• PK = Primary Key</text>
  <text x="200" y="770" font-size="12" fill="#374151">• FK = Foreign Key</text>
  <text x="350" y="770" font-size="12" fill="#374151">• 1:1 = One-to-One</text>
  <text x="500" y="770" font-size="12" fill="#374151">• 1:M = One-to-Many</text>
  <text x="650" y="770" font-size="12" fill="#374151">• M:M = Many-to-Many</text>
</svg>
```

## Deployment Architecture Diagram

```svg
<svg width="1000" height="600" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1000" height="600" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  
  <!-- Title -->
  <text x="500" y="30" text-anchor="middle" font-size="24" font-weight="bold" fill="#0f172a">
    Deployment Architecture - Multi-Platform Strategy
  </text>
  
  <!-- Developer -->
  <rect x="50" y="70" width="120" height="80" fill="#f1f5f9" stroke="#64748b" stroke-width="2" rx="8"/>
  <text x="110" y="95" text-anchor="middle" font-size="14" font-weight="bold" fill="#334155">Developer</text>
  <text x="110" y="115" text-anchor="middle" font-size="12" fill="#334155">Local</text>
  <text x="110" y="130" text-anchor="middle" font-size="12" fill="#334155">Development</text>
  
  <!-- Git Repository -->
  <rect x="220" y="70" width="120" height="80" fill="#f3f4f6" stroke="#6b7280" stroke-width="2" rx="8"/>
  <text x="280" y="95" text-anchor="middle" font-size="14" font-weight="bold" fill="#374151">GitHub</text>
  <text x="280" y="115" text-anchor="middle" font-size="12" fill="#374151">Repository</text>
  <text x="280" y="130" text-anchor="middle" font-size="12" fill="#374151">Source Control</text>
  
  <!-- Railway Platform -->
  <rect x="400" y="200" width="150" height="120" fill="#e0e7ff" stroke="#4f46e5" stroke-width="2" rx="10"/>
  <text x="475" y="225" text-anchor="middle" font-size="16" font-weight="bold" fill="#3730a3">Railway</text>
  <text x="475" y="245" text-anchor="middle" font-size="12" fill="#3730a3">Auto Deploy</text>
  <text x="475" y="260" text-anchor="middle" font-size="12" fill="#3730a3">from GitHub</text>
  <text x="475" y="280" text-anchor="middle" font-size="11" fill="#3730a3">• Container Runtime</text>
  <text x="475" y="295" text-anchor="middle" font-size="11" fill="#3730a3">• PostgreSQL Service</text>
  <text x="475" y="310" text-anchor="middle" font-size="11" fill="#3730a3">• $5-20/month</text>
  
  <!-- Vercel Platform -->
  <rect x="600" y="200" width="150" height="120" fill="#f0f9ff" stroke="#0ea5e9" stroke-width="2" rx="10"/>
  <text x="675" y="225" text-anchor="middle" font-size="16" font-weight="bold" fill="#0369a1">Vercel</text>
  <text x="675" y="245" text-anchor="middle" font-size="12" fill="#0369a1">Edge Functions</text>
  <text x="675" y="260" text-anchor="middle" font-size="12" fill="#0369a1">Global CDN</text>
  <text x="675" y="280" text-anchor="middle" font-size="11" fill="#0369a1">• Serverless Runtime</text>
  <text x="675" y="295" text-anchor="middle" font-size="11" fill="#0369a1">• External Database</text>
  <text x="675" y="310" text-anchor="middle" font-size="11" fill="#0369a1">• Free-$20/month</text>
  
  <!-- Heroku Platform -->
  <rect x="800" y="200" width="150" height="120" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="10"/>
  <text x="875" y="225" text-anchor="middle" font-size="16" font-weight="bold" fill="#92400e">Heroku</text>
  <text x="875" y="245" text-anchor="middle" font-size="12" fill="#92400e">Dyno System</text>
  <text x="875" y="260" text-anchor="middle" font-size="12" fill="#92400e">Add-on Ecosystem</text>
  <text x="875" y="280" text-anchor="middle" font-size="11" fill="#92400e">• Process-based</text>
  <text x="875" y="295" text-anchor="middle" font-size="11" fill="#92400e">• PostgreSQL Add-on</text>
  <text x="875" y="310" text-anchor="middle" font-size="11" fill="#92400e">• $7-25/month</text>
  
  <!-- Database Services -->
  <rect x="450" y="380" width="100" height="60" fill="#ddd6fe" stroke="#8b5cf6" stroke-width="2" rx="8"/>
  <text x="500" y="400" text-anchor="middle" font-size="12" font-weight="bold" fill="#7c3aed">Railway</text>
  <text x="500" y="415" text-anchor="middle" font-size="12" font-weight="bold" fill="#7c3aed">PostgreSQL</text>
  <text x="500" y="430" text-anchor="middle" font-size="10" fill="#7c3aed">Built-in Database</text>
  
  <rect x="600" y="380" width="100" height="60" fill="#fef7ff" stroke="#a855f7" stroke-width="2" rx="8"/>
  <text x="650" y="400" text-anchor="middle" font-size="12" font-weight="bold" fill="#9333ea">Supabase</text>
  <text x="650" y="415" text-anchor="middle" font-size="12" font-weight="bold" fill="#9333ea">PostgreSQL</text>
  <text x="650" y="430" text-anchor="middle" font-size="10" fill="#9333ea">External Service</text>
  
  <rect x="750" y="380" width="100" height="60" fill="#ecfccb" stroke="#84cc16" stroke-width="2" rx="8"/>
  <text x="800" y="400" text-anchor="middle" font-size="12" font-weight="bold" fill="#65a30d">Heroku</text>
  <text x="800" y="415" text-anchor="middle" font-size="12" font-weight="bold" fill="#65a30d">PostgreSQL</text>
  <text x="800" y="430" text-anchor="middle" font-size="10" fill="#65a30d">Add-on Service</text>
  
  <!-- Third-party Services -->
  <rect x="50" y="480" width="180" height="80" fill="#fef2f2" stroke="#ef4444" stroke-width="2" rx="8"/>
  <text x="140" y="505" text-anchor="middle" font-size="14" font-weight="bold" fill="#dc2626">External Services</text>
  <text x="70" y="525" font-size="11" fill="#dc2626">• Stripe Payment</text>
  <text x="70" y="540" font-size="11" fill="#dc2626">• SendGrid Email</text>
  <text x="70" y="555" font-size="11" fill="#dc2626">• OpenAI API</text>
  
  <!-- CDN/Performance -->
  <rect x="280" y="480" width="180" height="80" fill="#f0fdf4" stroke="#22c55e" stroke-width="2" rx="8"/>
  <text x="370" y="505" text-anchor="middle" font-size="14" font-weight="bold" fill="#16a34a">Performance</text>
  <text x="300" y="525" font-size="11" fill="#16a34a">• Global CDN</text>
  <text x="300" y="540" font-size="11" fill="#16a34a">• Edge Caching</text>
  <text x="300" y="555" font-size="11" fill="#16a34a">• Auto-scaling</text>
  
  <!-- Monitoring -->
  <rect x="510" y="480" width="180" height="80" fill="#fffbeb" stroke="#f59e0b" stroke-width="2" rx="8"/>
  <text x="600" y="505" text-anchor="middle" font-size="14" font-weight="bold" fill="#d97706">Monitoring</text>
  <text x="530" y="525" font-size="11" fill="#d97706">• Application Logs</text>
  <text x="530" y="540" font-size="11" fill="#d97706">• Performance Metrics</text>
  <text x="530" y="555" font-size="11" fill="#d97706">• Error Tracking</text>
  
  <!-- Security -->
  <rect x="740" y="480" width="180" height="80" fill="#f0f9ff" stroke="#0ea5e9" stroke-width="2" rx="8"/>
  <text x="830" y="505" text-anchor="middle" font-size="14" font-weight="bold" fill="#0369a1">Security</text>
  <text x="760" y="525" font-size="11" fill="#0369a1">• SSL/TLS Certificates</text>
  <text x="760" y="540" font-size="11" fill="#0369a1">• Environment Variables</text>
  <text x="760" y="555" font-size="11" fill="#0369a1">• JWT Authentication</text>
  
  <!-- Connection Lines -->
  <!-- Developer to GitHub -->
  <line x1="170" y1="110" x2="220" y2="110" stroke="#6b7280" stroke-width="2" marker-end="url(#arrow2)"/>
  <text x="185" y="105" font-size="10" fill="#6b7280">git push</text>
  
  <!-- GitHub to Platforms -->
  <line x1="340" y1="110" x2="450" y2="200" stroke="#6b7280" stroke-width="2" marker-end="url(#arrow2)"/>
  <text x="385" y="145" font-size="10" fill="#6b7280">deploy</text>
  
  <line x1="340" y1="110" x2="650" y2="200" stroke="#6b7280" stroke-width="2" marker-end="url(#arrow2)"/>
  <text x="485" y="145" font-size="10" fill="#6b7280">deploy</text>
  
  <line x1="340" y1="110" x2="850" y2="200" stroke="#6b7280" stroke-width="2" marker-end="url(#arrow2)"/>
  <text x="585" y="145" font-size="10" fill="#6b7280">deploy</text>
  
  <!-- Platforms to Databases -->
  <line x1="475" y1="320" x2="500" y2="380" stroke="#6b7280" stroke-width="2"/>
  <line x1="675" y1="320" x2="650" y2="380" stroke="#6b7280" stroke-width="2"/>
  <line x1="875" y1="320" x2="800" y2="380" stroke="#6b7280" stroke-width="2"/>
  
  <!-- Arrow marker -->
  <defs>
    <marker id="arrow2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#6b7280"/>
    </marker>
  </defs>
</svg>
```

These comprehensive diagrams provide visual representations of the M4T Learning Platform's architecture, user flows, database relationships, and deployment strategies. They complement the technical documentation by offering clear visual understanding of system components and their interactions.