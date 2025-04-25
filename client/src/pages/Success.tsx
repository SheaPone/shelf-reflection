import { useNavigate } from 'react-router-dom';

export function Success() {
  const navigate = useNavigate();
  function handleCLick() {
    navigate('/');
  }
  return (
    <>
      <h2>Payment Successful! Yay!</h2>
      <button onClick={handleCLick}>Return to Shop</button>
    </>
  );
}
