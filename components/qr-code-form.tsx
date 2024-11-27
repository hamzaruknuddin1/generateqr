'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { QrCode, Link as LinkIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeDisplay } from './qr-code-display';
import { processUrl, sanitizeUrl } from '@/lib/qr-code';
import { fetchWithErrorHandling } from '@/lib/api';
import type { QRCodeResponse } from '@/types/qr-code';

export function QRCodeForm() {
  const [url, setUrl] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateQRCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const sanitizedUrl = sanitizeUrl(url);
    if (!sanitizedUrl) {
      toast.error('Please enter a URL');
      return;
    }

    setLoading(true);
    setQrCode(null);

    try {
      const processedUrl = processUrl(sanitizedUrl);
      
      const response = await fetch('/api/qrcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: processedUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate QR code');
      }

      if (!data.qrCodeDataUrl) {
        throw new Error('No QR code data received');
      }

      setQrCode(data.qrCodeDataUrl);
      toast.success('QR code generated successfully!');
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (qrCode) setQrCode(null);
  };

  return (
    <Card className="w-full max-w-md p-6 space-y-6">
      <form onSubmit={generateQRCode} className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <LinkIcon className="w-4 h-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Enter URL (e.g., example.com)"
              value={url}
              onChange={handleUrlChange}
              className="flex-1"
              disabled={loading}
            />
          </div>
          <p className="text-sm text-gray-500">
            Enter a URL with or without http(s)://
          </p>
        </div>
        
        <Button
          type="submit"
          className="w-full"
          disabled={loading || !url.trim()}
        >
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

      {qrCode && <QRCodeDisplay qrCode={qrCode} />}
    </Card>
  );
}