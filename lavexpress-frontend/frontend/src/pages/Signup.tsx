
import MobileLayout from '@/components/layout/MobileLayout';
import AuthForm from '@/components/auth/AuthForm';

export default function Signup() {
  return (
    <MobileLayout hideNavbar showBackButton>
      <div className="pt-8">
        <AuthForm type="signup" />
      </div>
    </MobileLayout>
  );
}
