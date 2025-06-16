import { db } from "./db";
import { users, courses, subscriptionPlans } from "../shared/schema";

async function checkEnvironment() {
  console.log("🔍 Checking M4T Learning Platform Environment...\n");

  // Check database connection
  try {
    await db.select().from(users).limit(1);
    console.log("✅ Database connection: OK");
  } catch (error) {
    console.log("❌ Database connection: FAILED");
    console.log("   Error:", error);
    return false;
  }

  // Check required environment variables
  const requiredEnvVars = [
    'DATABASE_URL',
    'SESSION_SECRET',
    'OPENAI_API_KEY',
    'STRIPE_SECRET_KEY',
    'VITE_STRIPE_PUBLIC_KEY',
    'SENDGRID_API_KEY',
    'PAYPAL_CLIENT_ID',
    'PAYPAL_CLIENT_SECRET'
  ];

  console.log("\n📋 Environment Variables:");
  let allEnvVarsPresent = true;
  
  for (const envVar of requiredEnvVars) {
    const isPresent = !!process.env[envVar];
    console.log(`   ${isPresent ? '✅' : '❌'} ${envVar}: ${isPresent ? 'SET' : 'MISSING'}`);
    if (!isPresent) allEnvVarsPresent = false;
  }

  // Check database tables and data
  console.log("\n🗄️  Database Status:");
  
  try {
    const userCount = await db.select().from(users);
    console.log(`   ✅ Users table: ${userCount.length} records`);
  } catch (error) {
    console.log("   ❌ Users table: ERROR");
  }

  try {
    const courseCount = await db.select().from(courses);
    console.log(`   ✅ Courses table: ${courseCount.length} records`);
  } catch (error) {
    console.log("   ❌ Courses table: ERROR");
  }

  try {
    const planCount = await db.select().from(subscriptionPlans);
    console.log(`   ✅ Subscription plans: ${planCount.length} records`);
  } catch (error) {
    console.log("   ❌ Subscription plans: ERROR");
  }

  // Overall status
  console.log("\n📊 Overall Status:");
  if (allEnvVarsPresent) {
    console.log("   ✅ Environment: READY FOR PRODUCTION");
    console.log("   ✅ All required secrets configured");
  } else {
    console.log("   ⚠️  Environment: NEEDS CONFIGURATION");
    console.log("   ❌ Missing required environment variables");
  }

  console.log("\n🚀 Deployment Readiness:");
  console.log("   • Run 'npm run build' to create production build");
  console.log("   • Run seeding scripts to populate database");
  console.log("   • Verify all environment variables are set");
  console.log("   • Test payment integration with real API keys");

  return allEnvVarsPresent;
}

// Command line execution
if (require.main === module) {
  checkEnvironment()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("Environment check failed:", error);
      process.exit(1);
    });
}

export { checkEnvironment };