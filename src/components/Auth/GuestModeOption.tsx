interface GuestModeOptionProps {
  onChooseAuth: () => void;
  onChooseGuest: () => void;
}

export function GuestModeOption({ onChooseAuth, onChooseGuest }: GuestModeOptionProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            LLM<span className="text-yellow-500">LIKE</span>
          </h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">게임 접속 방법</h2>
          <p className="text-gray-600">어떤 방식으로 게임을 시작하시겠습니까?</p>
        </div>

        <div className="space-y-4">
          {/* 게스트 모드 버튼 */}
          <button
            onClick={onChooseGuest}
            className="w-full flex flex-col items-center justify-center py-6 px-4 border-2 border-green-500 rounded-lg shadow-sm text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105"
          >
            <div className="text-3xl mb-2">🎮</div>
            <h3 className="text-lg font-bold">게스트로 시작</h3>
            <p className="text-sm text-center text-green-600 mt-1">
              회원가입 없이 바로 게임을 체험해보세요<br/>
              <span className="text-xs">(게임 진행 상황이 저장되지 않습니다)</span>
            </p>
          </button>

          {/* 회원 모드 버튼 */}
          <button
            onClick={onChooseAuth}
            className="w-full flex flex-col items-center justify-center py-6 px-4 border-2 border-blue-500 rounded-lg shadow-sm text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
          >
            <div className="text-3xl mb-2">👤</div>
            <h3 className="text-lg font-bold">회원으로 시작</h3>
            <p className="text-sm text-center text-blue-600 mt-1">
              계정을 만들고 게임 진행 상황을 저장하세요<br/>
              <span className="text-xs">(로그인 또는 회원가입 필요)</span>
            </p>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            BM 모델 구축을 위한 임시 게스트 모드입니다
          </p>
        </div>
      </div>
    </div>
  );
} 