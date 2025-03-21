import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useUser } from './useUser';

export function NavBar() {
  const { user, handleSignOut } = useUser();
  const navigate = useNavigate();
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
              <h3 className="navbar-link black-text">Home</h3>
              <Link to="/" className="navbar-link black-text">
                <h3>My Reviews</h3>
              </Link>
              <h3 className="navbar-link black-text">Feed</h3>
              <h3 className="navbar-link black-text">Shop</h3>
              <FaShoppingCart color="black" size="20" className="inline" />
              <span className="absolute top-2 right-80 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full"></span>
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
