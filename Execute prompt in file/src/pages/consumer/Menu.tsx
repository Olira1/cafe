import { useNavigate } from 'react-router-dom';
import QRMenu from '../qr/QRMenu';

// Consumer menu reuses the QR menu display
export default function ConsumerMenu() {
  return <QRMenu />;
}
