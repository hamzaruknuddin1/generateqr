'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { QrCode, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeDisplay } from './qr-code-display';

export function QRCodeForm() {
  const [type, setType] = useState<string>('url'); // Default type is URL
  const [formData, setFormData] = useState<any>({});
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [format, setFormat] = useState<'png' | 'jpeg' | 'svg'>('png'); // Default format is PNG
  const [loading, setLoading] = useState(false);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
    setFormData({});
    setQrCode(null); // Reset QR code when type changes
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormat(e.target.value as 'png' | 'jpeg' | 'svg');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (qrCode) setQrCode(null);
  };

  const generateQRCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData || Object.keys(formData).length === 0) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setQrCode(null);

    try {
      const response = await fetch('/api/qrcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, data: formData, format }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate QR code');
      }

      setQrCode(data.qrCodeData);
      toast.success('QR code generated successfully!');
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-6 space-y-6">
      <form onSubmit={generateQRCode} className="space-y-4">
        <div className="space-y-2">
          {/* QR Code Type */}
          <select
            value={type}
            onChange={handleTypeChange}
            className="w-full border border-gray-300 rounded-md p-2"
            disabled={loading}
          >
            <option value="url">Website/URL</option>
            <option value="email">Email</option>
            <option value="text">Text</option>
            <option value="phone">Phone</option>
            <option value="wifi">WiFi</option>
            <option value="sms">SMS</option>
            <option value="vcard">vCard</option>
            <option value="location">Location</option>
          </select>

          {/* QR Code Format */}
          <select
            value={format}
            onChange={handleFormatChange}
            className="w-full border border-gray-300 rounded-md p-2"
            disabled={loading}
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="svg">SVG</option>
          </select>

          {/* Dynamic input fields based on type */}
          {type === 'url' && (
            <Input
              type="text"
              placeholder="Enter URL"
              name="url"
              value={formData.url || ''}
              onChange={handleInputChange}
              disabled={loading}
            />
          )}
          {type === 'email' && (
            <>
              <Input
                type="email"
                placeholder="Enter Email Address"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                disabled={loading}
              />
              <Input
                type="text"
                placeholder="Enter Subject"
                name="subject"
                value={formData.subject || ''}
                onChange={handleInputChange}
                disabled={loading}
              />
              <Input
                type="text"
                placeholder="Enter Message"
                name="body"
                value={formData.body || ''}
                onChange={handleInputChange}
                disabled={loading}
              />
            </>
          )}
          {type === 'text' && (
            <Input
              type="text"
              placeholder="Enter Text"
              name="text"
              value={formData.text || ''}
              onChange={handleInputChange}
              disabled={loading}
            />
          )}
          {type === 'phone' && (
            <Input
              type="text"
              placeholder="Enter Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={handleInputChange}
              disabled={loading}
            />
          )}
          {type === 'wifi' && (
            <>
              <Input
                type="text"
                placeholder="Enter WiFi SSID"
                name="ssid"
                value={formData.ssid || ''}
                onChange={handleInputChange}
                disabled={loading}
              />
              <Input
                type="text"
                placeholder="Enter WiFi Password"
                name="password"
                value={formData.password || ''}
                onChange={handleInputChange}
                disabled={loading}
              />
              <Input
                type="text"
                placeholder="Encryption Type (e.g., WPA)"
                name="encryption"
                value={formData.encryption || ''}
                onChange={handleInputChange}
                disabled={loading}
              />
            </>
          )}
          {type === 'sms' && (
            <>
              <Input
                type="text"
                placeholder="Enter Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={handleInputChange}
                disabled={loading}
              />
              <Input
                type="text"
                placeholder="Enter Message"
                name="message"
                value={formData.message || ''}
                onChange={handleInputChange}
                disabled={loading}
              />
            </>
          )}
          {type === 'vcard' && (
            <>
              <Input
                type="text"
                placeholder="Enter Full Name"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                disabled={loading}
              />
              <Input
                type="text"
                placeholder="Enter Organization"
                name="organization"
                value={formData.organization || ''}
                onChange={handleInputChange}
                disabled={loading}
              />
              <Input
                type="text"
                placeholder="Enter Phone Number"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                disabled={loading}
              />
              <Input
                type="email"
                placeholder="Enter Email Address"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                disabled={loading}
              />
            </>
          )}
          {type === 'location' && (
            <>
              <Input
                type="text"
                placeholder="Enter Latitude"
                name="latitude"
                value={formData.latitude || ''}
                onChange={handleInputChange}
                disabled={loading}
              />
              <Input
                type="text"
                placeholder="Enter Longitude"
                name="longitude"
                value={formData.longitude || ''}
                onChange={handleInputChange}
                disabled={loading}
              />
            </>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full justify-center">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <QrCode className="w-4 h-4 mr-2" />
              Generate QR Code
            </>
          )}
        </Button>
      </form>

      {qrCode && <QRCodeDisplay qrCode={qrCode} format={format} />}
    </Card>
  );
}