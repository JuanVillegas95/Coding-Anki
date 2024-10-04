

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Authorization code is missing' }, { status: 400 });
  }

  // Ensure environment variables are present
  const clientId = process.env.IDCS_CLIENT_ID;
  const clientSecret = process.env.IDCS_CLIENT_SECRET;
  const redirectUri = process.env.REDIRECT_URI;

  // Place the console.log here to check if the values are correct
  console.log({
    clientId,
    clientSecret,
    redirectUri,
    code,
  });

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
  }

  // Exchange the authorization code for tokens
  const tokenResponse = await fetch('https://idcs-6d08a89bb6424912b805c6ec5847d29d.identity.oraclecloud.com/oauth2/v1/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri, // Your registered redirect URI
      client_id: clientId,        // Ensure this is not undefined
      client_secret: clientSecret, // Ensure this is not undefined
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok) {
    console.log('Token Exchange Error:', tokenData); // Log any errors during token exchange
    return NextResponse.json({ error: 'Failed to exchange authorization code for tokens', details: tokenData }, { status: 500 });
  }

  const { access_token, refresh_token } = tokenData;

  // Set tokens in cookies for secure storage
  const response = NextResponse.redirect('/');
  response.cookies.set('accessToken', access_token, { httpOnly: true, path: '/', maxAge: 3600 }); // 1 hour
  response.cookies.set('refreshToken', refresh_token, { httpOnly: true, path: '/', maxAge: 86400 }); // 1 day

  return response;
}