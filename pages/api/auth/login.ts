Step 1: Create a Login Route
This route will redirect the user to Oracle IDCS for authentication. We’ll handle everything server-side using Next.js API routes.

1.1: Set up the /api/auth/login route
This route will handle the redirection to Oracle IDCS for authentication.

tsx
Copy code
// File: pages/api/auth/login.ts
export default function handler(req, res) {
  const clientId = process.env.IDCS_CLIENT_ID; // Your Oracle IDCS Client ID
  const redirectUri = 'https://<your-ngrok-url>.ngrok.io/api/auth/callback'; // Replace with your ngrok URL or production URL

  const authorizationUrl = `https://idcs-<your-region>.oraclecloud.com/oauth2/v1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid profile email`;

  // Redirect to Oracle IDCS for login
  res.redirect(authorizationUrl);
}
