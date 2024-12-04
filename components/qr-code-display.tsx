'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeDisplayProps {
  qrCode: string;
  format: 'png' | 'jpeg' | 'svg';
}

export function QRCodeDisplay({ qrCode, format }: QRCodeDisplayProps) {
  const handleDownload = () => {
    try {
      if (format === 'svg') {
        // Convert the SVG string to a Blob for download
        const blob = new Blob([qrCode], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `qrcode.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // Handle PNG and JPEG download
        const link = document.createElement('a');
        link.href = qrCode;
        link.download = `qrcode.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      toast.success('QR code downloaded successfully');
    } catch (error) {
      toast.error('Failed to download QR code');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {format === 'svg' ? (
        <div
          className="w-64 h-64"
          dangerouslySetInnerHTML={{ __html: qrCode }}
        />
      ) : (
        <img src={qrCode} alt="Generated QR Code" className="w-64 h-64" />
      )}
      <Button onClick={handleDownload} className="w-full">
        <Download className="w-4 h-4 mr-2" />
        Download as {format.toUpperCase()}
      </Button>
    </div>
  );
}