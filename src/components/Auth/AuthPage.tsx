import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { GuestModeOption } from './GuestModeOption';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showGuestOption, setShowGuestOption] = useState(true);

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  if (showGuestOption) {
    return <GuestModeOption 
      onChooseAuth={() => setShowGuestOption(false)} 
      onChooseGuest={() => {
        // 게스트 모드로 진입
        const mockUser = {
          id: 'guest',
          email: 'guest@example.com',
          username: 'Guest User'
        };
        // AuthContext에 게스트 사용자 설정 (임시)
        localStorage.setItem('guestMode', 'true');
        window.location.reload();
      }}
    />;
  }

  return (
    <>
      {isLogin ? (
        <LoginForm onSwitchToRegister={switchToRegister} />
      ) : (
        <RegisterForm onSwitchToLogin={switchToLogin} />
      )}
    </>
  );
} 