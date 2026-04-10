import { QRCodeSVG } from 'qrcode.react';

export const QRGenerator = ({ value, size = 128, className = '' }) => {
  return (
    <div className={`p-4 bg-white rounded-xl shadow-lg inline-block ${className}`}>
      <QRCodeSVG 
        value={value} 
        size={size}
        fgColor="#4B3621"
        bgColor="#ffffff"
        level="H"
        imageSettings={{
          src: "/vite.svg", // Fallback if logo not ready
          x: undefined,
          y: undefined,
          height: 24,
          width: 24,
          excavate: true,
        }}
      />
    </div>
  );
};
