import { useNavigate } from 'react-router-dom';

export function Cancel() {
  const navigate = useNavigate();
  function handleCLick() {
    navigate('/');
  }
  return (
    <>
      <h2>Payment Unsuccessful</h2>
      <button onClick={handleCLick}>Return to Shop</button>
    </>
  );
}
