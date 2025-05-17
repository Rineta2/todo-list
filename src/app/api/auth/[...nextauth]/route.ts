import NextAuth from "next-auth";
import { authOptions } from "../auth-options";

// Create handler using the new App Router pattern
const handler = NextAuth(authOptions);

// Export the GET and POST handlers properly for App Router
export { handler as GET, handler as POST };
