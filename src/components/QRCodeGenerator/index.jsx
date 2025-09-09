import React, {useCallback, useEffect, useState} from 'react';

import QRCode from 'react-native-qrcode-svg';
import LinearGradient from 'react-native-linear-gradient';

const QRCodeGenerator = ({
  value,
  size = 256,
  secretKey = 'YOUR_SECRET_KEY_HERE',
}) => {
  const [qrValue, setQrValue] = useState(value);
  const generateChecksum = input => {
    let hash = 5381;
    for (let i = 0; i < input.length; i++) {
      hash = (hash * 33) ^ input.charCodeAt(i);
    }
    const hashHex = (hash >>> 0).toString(16).padStart(8, '0');
    return hashHex.substring(0, 8);
  };

  const generateChecksumValue = useCallback(() => {
    try {
      const timestamp = Date.now().toString();
      const data = value + timestamp + secretKey;

      const checksum = generateChecksum(data);
      const valueWithChecksum = `${value}||${timestamp}||${checksum}`;

      setQrValue(valueWithChecksum);
    } catch (err) {
      console.error('Error generating checksum:', err);
      setQrValue(value);
    }
  }, [value, secretKey]);
  useEffect(() => {
    generateChecksumValue();
  }, [value, secretKey, generateChecksumValue]);

  return (
    <LinearGradient
      colors={['rgba(74, 58, 255, 1)', 'rgba(41, 178, 255, 1)']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={{width: size, height: size}}>
      <QRCode
        value={qrValue}
        size={size}
        level="H"
        backgroundColor="transparent"
        color="#FFF"
      />
    </LinearGradient>
  );
};

export default QRCodeGenerator;
