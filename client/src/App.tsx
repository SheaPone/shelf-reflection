import { UserProvider } from './components/UserContext';
import { Routes, Route } from 'react-router-dom';
import { ReviewForm } from './pages/ReviewForm';
import { AuthPage } from './pages/AuthPage';
import { NavBar } from './components/NavBar';
import './CSS/App.css';
import { ReviewList } from './pages/ReviewList';

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route path="/auth/sign-up" element={<AuthPage mode="sign-up" />} />
          <Route path="/auth/sign-in" element={<AuthPage mode="sign-in" />} />
          <Route index element={<ReviewList />} />
          <Route path="details/:reviewId" element={<ReviewForm />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}
