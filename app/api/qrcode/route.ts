import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

// Disable static generation for this route
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { url } = body;

    // Validate and sanitize the URL
    if (!url || typeof url !== 'string' || !url.trim()) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }
    const sanitizedUrl = url.trim().startsWith('http://') || url.trim().startsWith('https://')
      ? url.trim()
      : `https://${url.trim()}`;

    // Generate the QR code as a data URL
    const qrCodeDataUrl = await QRCode.toDataURL(sanitizedUrl, {
      width: 400, // Width of the QR code
      margin: 2,  // Add margin for better readability
      errorCorrectionLevel: 'H', // High error correction level
    });

    // Return the generated QR code
    return NextResponse.json({ qrCodeDataUrl });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
  }
}