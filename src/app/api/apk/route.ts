import { NextResponse } from 'next/server';

export async function GET() {
  // Redirect to official PORTEX Android APK release asset on GitHub
  const apkReleaseUrl = 'https://github.com/Satyacoder-31/portex/releases/download/v1.0.2/portex.apk';
  return NextResponse.redirect(apkReleaseUrl, 302);
}
