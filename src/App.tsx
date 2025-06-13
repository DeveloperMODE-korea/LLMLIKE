import React, { useState } from 'react';
import { AdminUser } from './types/admin';
import AppProvider from './components/AppProvider';
import AppLayout from './components/AppLayout';
import AppRouter from './components/AppRouter';

/**
 * Refactored App component using Router + Layout + Provider architecture
 * Reduced from 239 lines to ~30 lines with separation of concerns
 */
function App() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  const handleAdminLogin = (user: AdminUser) => {
    setAdminUser(user);
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
  };

  return (
    <AppProvider>
      <AppLayout 
        adminUser={adminUser}
        onAdminLogin={handleAdminLogin}
        onAdminLogout={handleAdminLogout}
      >
        <AppRouter 
          adminUser={adminUser}
          onAdminLogout={handleAdminLogout}
        />
      </AppLayout>
    </AppProvider>
  );
}

export default App;