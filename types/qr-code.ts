export interface QRCodeResponse {
  qrCodeDataUrl: string;
}

export interface QRCodeError {
  error: string;
}

export type QRCodeResult = QRCodeResponse | QRCodeError;