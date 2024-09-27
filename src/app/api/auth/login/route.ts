// File: app/api/auth/login/route.ts

import { NextResponse } from 'next/server';

// Login handler for redirecting to Oracle IDCS
export async function GET() {
  const clientId = process.env.IDCS_CLIENT_ID; // Oracle IDCS Client ID from environment variables
  const redirectUri = process.env.REDIRECT_URI; // Redirect URI from environment variables

  // Construct the Oracle authorization URL
  const authorizationUrl = `https://idcs-6d08a89bb6424912b805c6ec5847d29d.identity.oraclecloud.com/oauth2/v1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid profile email`;


  // Redirect the user to Oracle IDCS for login
  return NextResponse.redirect(authorizationUrl);
}