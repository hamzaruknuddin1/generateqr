import { QRCodeForm } from '@/components/qr-code-form';
import { QrCode } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <QrCode className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            QR Code Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Generate QR codes instantly for any URL. Perfect for sharing links, websites, 
            and digital content in a scannable format. Simply enter your URL and get a 
            downloadable QR code in seconds.
          </p>
        </div>

        <div className="flex justify-center">
          <QRCodeForm />
        </div>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Scan the generated QR code with any smartphone camera or QR code reader app.
          </p>
        </div>
      </div>
    </main>
  );
}