'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { downloadQRCode } from '@/lib/qr-code';
import { toast } from 'sonner';

interface QRCodeDisplayProps {
  qrCode: string;
}

export function QRCodeDisplay({ qrCode }: QRCodeDisplayProps) {
  const handleDownload = () => {
    try {
      downloadQRCode(qrCode);
      toast.success('QR code downloaded successfully');
    } catch (error) {
      toast.error('Failed to download QR code');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center p-4 bg-white rounded-lg">
        <img
          src={qrCode}
          alt="Generated QR Code"
          className="w-64 h-64"
        />
      </div>
      <Button
        onClick={handleDownload}
        variant="outline"
        className="w-full"
      >
        <Download className="w-4 h-4 mr-2" />
        Download QR Code
      </Button>
    </div>
  );
}