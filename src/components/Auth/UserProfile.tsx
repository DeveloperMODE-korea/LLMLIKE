import { useAuth } from '../../contexts/AuthContext';

export function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">환영합니다!</h2>
          <div className="text-gray-600">
            <p><span className="font-medium">사용자명:</span> {user.username}</p>
            <p><span className="font-medium">이메일:</span> {user.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
} 