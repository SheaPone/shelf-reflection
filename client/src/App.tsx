import { UserProvider } from './components/UserContext';
import { Routes, Route } from 'react-router-dom';
import { ReviewForm } from './pages/ReviewForm';
import { AuthPage } from './pages/AuthPage';
import { NotFound } from './pages/NotFound';
import { NavBar } from './components/NavBar';
import './CSS/App.css';
import { ReviewList } from './pages/ReviewList';
import { HomePage } from './pages/HomePage';
import { Feed } from './pages/Feed';
import { Shop } from './pages/Shop';
import { Cart } from './pages/Cart';
import { Cancel } from './pages/Cancel';
import { Success } from './pages/Success';

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route path="/auth/sign-up" element={<AuthPage mode="sign-up" />} />
          <Route path="/auth/sign-in" element={<AuthPage mode="sign-in" />} />
          <Route path="/myreviews" element={<ReviewList />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/details/:reviewId" element={<ReviewForm />} />
          <Route path="/feed" element={<Feed />} />
          <Route index element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/success" element={<Success />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}
