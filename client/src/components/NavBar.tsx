import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useUser } from './useUser';
import { useCart } from './useCart';

export function NavBar() {
  const { user, handleSignOut } = useUser();
  const navigate = useNavigate();
  const { cart } = useCart();
  function handleClick(): void {
    handleSignOut();
    navigate('/');
  }

  return (
    <>
      <header className="background">
        <div className=" container">
          <div className="row">
            <div className="column-full d-flex align-center">
              <h1 className="black-text title">Shelf Reflection</h1>
              <Link to="/homepage" className="navbar-link black-text">
                <h3>Home</h3>
              </Link>
              <Link to="/myreviews" className="navbar-link black-text">
                <h3>My Reviews</h3>
              </Link>
              <Link to="/feed" className="navbar-link black-text">
                <h3>Feed</h3>
              </Link>
              <Link to="/" className="navbar-link black-text">
                <h3>Shop</h3>
              </Link>
              <Link to="/cart" className="navbar-link relative inline-block">
                <FaShoppingCart color="black" size="20" className="inline" />
                {cart.length > 0 && (
                  <span className="absolute -top-3 -right-4 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {cart.length}
                  </span>
                )}
              </Link>
              {user ? (
                <button
                  onClick={handleClick}
                  className="navbar-link black-text">
                  <h3>Sign Out</h3>
                </button>
              ) : (
                <Link to="/auth/sign-in" className="navbar-link black-text">
                  <h3>Sign In</h3>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
}
