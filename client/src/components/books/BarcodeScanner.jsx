import React, { useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';

const BarcodeScanner = ({ onScan, onClose }) => {
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      videoRef.current.srcObject = stream;
      setIsScanning(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  // Mock scan for testing
  const handleTestScan = () => {
    // Simulate scanning a sample ISBN
    onScan('9780307474278'); // This is a sample ISBN
    stopScanning();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Scan Book ISBN</h3>
          <button 
            onClick={() => {
              stopScanning();
              onClose();
            }} 
            className="text-slate-400 hover:text-slate-500"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="mt-4 flex justify-center gap-4">
          {!isScanning ? (
            <button
              onClick={startScanning}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <Camera size={20} />
              Start Camera
            </button>
          ) : (
            <button
              onClick={stopScanning}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Stop Camera
            </button>
          )}
          
          {/* Test button for development */}
          <button
            onClick={handleTestScan}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Test Scan
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;