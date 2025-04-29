import { useNavigate } from 'react-router-dom';
import '../CSS/layout.css';

export function Cancel() {
  const navigate = useNavigate();
  function handleCLick() {
    navigate('/');
  }
  return (
    <>
      <h2 className="margin-top-4">Payment Unsuccessful :(</h2>
      <button onClick={handleCLick}>Return to Shop</button>
    </>
  );
}
