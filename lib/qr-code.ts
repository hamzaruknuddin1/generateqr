export const validateUrl = (url: string): boolean => {
  try {
    // Add protocol if missing for URL validation
    const urlToValidate = !url.startsWith('http://') && !url.startsWith('https://')
      ? `https://${url}`
      : url;
    new URL(urlToValidate);
    return true;
  } catch {
    return false;
  }
};

export const processUrl = (url: string): string => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

export const downloadQRCode = (qrCode: string, filename = 'qrcode.png') => {
  try {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading QR code:', error);
    throw new Error('Failed to download QR code');
  }
};

export const sanitizeUrl = (url: string): string => {
  return url.trim().toLowerCase();
};