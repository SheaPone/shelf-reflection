import { RegistrationForm } from '../components/RegistrationForm';
import { SignInForm } from '../components/SignInForm';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/useUser';

type Props = {
  mode: 'sign-up' | 'sign-in';
};
export function AuthPage({ mode }: Props) {
  const navigate = useNavigate();
  const { user } = useUser();
  if (user) navigate('/shop');
  return (
    <>
      <div className="sign container m-4">
        {mode === 'sign-up' && <RegistrationForm />}
        {mode === 'sign-in' && <SignInForm />}
      </div>
    </>
  );
}
