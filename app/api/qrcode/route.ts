import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

// Disable static generation for this route
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { type, data, format } = body;

    // Validate input
    if (!type || typeof type !== 'string') {
      return NextResponse.json({ error: 'Type is required' }, { status: 400 });
    }
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Data is required and must be an object' }, { status: 400 });
    }
    if (!['png', 'jpeg', 'svg'].includes(format)) {
      return NextResponse.json({ error: 'Invalid format. Must be png, jpeg, or svg' }, { status: 400 });
    }

    // Generate QR code content based on type
    let qrContent: string;

    switch (type) {
      case 'url': // Website/URL
        const url = data.url?.trim();
        if (!url) {
          return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }
        qrContent = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
        break;

      case 'email': // Email
        const email = data.email?.trim();
        const subject = data.subject || '';
        const body = data.body || '';
        if (!email) {
          return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }
        qrContent = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        break;

      case 'text': // Plain Text
        const text = data.text?.trim();
        if (!text) {
          return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }
        qrContent = text;
        break;

      case 'phone': // Phone Number
        const phoneNumber = data.phoneNumber?.trim();
        if (!phoneNumber) {
          return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
        }
        qrContent = `tel:${phoneNumber}`;
        break;

      case 'wifi': // WiFi
        const ssid = data.ssid?.trim();
        const password = data.password || '';
        const encryption = data.encryption || 'WPA';
        if (!ssid) {
          return NextResponse.json({ error: 'SSID is required' }, { status: 400 });
        }
        qrContent = `WIFI:S:${ssid};T:${encryption};P:${password};;`;
        break;

      case 'sms': // SMS
        const smsNumber = data.phoneNumber?.trim();
        const smsBody = data.message || '';
        if (!smsNumber) {
          return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
        }
        qrContent = `sms:${smsNumber}?body=${encodeURIComponent(smsBody)}`;
        break;

      case 'vcard': // vCard
        const name = data.name?.trim();
        const org = data.organization || '';
        const phone = data.phone || '';
        const emailAddr = data.email || '';
        if (!name) {
          return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }
        qrContent = `BEGIN:VCARD\\nVERSION:3.0\\nFN:${name}\\nORG:${org}\\nTEL:${phone}\\nEMAIL:${emailAddr}\\nEND:VCARD`;
        break;

      case 'location': // Location
        const latitude = data.latitude;
        const longitude = data.longitude;
        if (latitude === undefined || longitude === undefined) {
          return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
        }
        qrContent = `geo:${latitude},${longitude}`;
        break;

      default:
        return NextResponse.json({ error: 'Unsupported type' }, { status: 400 });
    }

    let qrCodeResult;

    if (format === 'svg') {
      // Generate SVG QR code
      qrCodeResult = await QRCode.toString(qrContent, { type: 'svg' });
    } else {
      // Generate PNG (default) QR code
      const pngDataUrl = await QRCode.toDataURL(qrContent);

      if (format === 'jpeg') {
        // Convert PNG to JPEG manually
        const base64Data = pngDataUrl.replace(/^data:image\/png;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const jpegData = buffer.toString('base64'); // Convert to JPEG if necessary
        qrCodeResult = `data:image/jpeg;base64,${jpegData}`;
      } else {
        qrCodeResult = pngDataUrl; // Default to PNG
      }
    }

    // Return the generated QR code
    return NextResponse.json({ qrCodeData: qrCodeResult, format });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
  }
}