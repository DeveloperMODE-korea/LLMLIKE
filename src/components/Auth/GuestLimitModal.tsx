interface GuestLimitModalProps {
  isOpen: boolean;
  onSignUp: () => void;
  onRestart: () => void;
}

export function GuestLimitModal({ isOpen, onSignUp, onRestart }: GuestLimitModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl shadow-2xl max-w-lg w-full border border-purple-500/30 relative overflow-hidden">
        
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-pink-600/10"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        <div className="relative z-10 p-8">
          
          {/* 아이콘 */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 shadow-lg">
              <span className="text-3xl">🎮</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              체험판 완료!
            </h2>
            <p className="text-purple-200 text-lg">
              10스테이지 모험을 마치셨습니다
            </p>
          </div>

          {/* 메시지 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
            <p className="text-white leading-relaxed mb-4">
              축하합니다! 🎉 게스트 모드로 10스테이지까지 모험을 완주하셨습니다.
            </p>
            <p className="text-purple-200 leading-relaxed">
              더 깊이 있는 모험을 계속하고 싶다면 회원가입을 통해 무제한으로 게임을 즐겨보세요!
            </p>
          </div>

          {/* 회원 혜택 */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 mb-6 border border-blue-500/30">
            <h3 className="text-yellow-300 font-bold text-lg mb-3">✨ 회원 혜택</h3>
            <ul className="space-y-2 text-white">
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>무제한 스테이지 진행</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span>더 정교한 AI 스토리텔링 (Claude Haiku → Sonnet)</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                <span>게임 진행 상황 자동 저장</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                <span>고급 캐릭터 커스터마이징</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>특별한 아이템과 스킬 해금</span>
              </li>
            </ul>
          </div>

          {/* 버튼들 */}
          <div className="space-y-3">
            <button
              onClick={onSignUp}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="text-lg">🚀 회원가입하고 모험 계속하기</span>
            </button>
            
            <button
              onClick={onRestart}
              className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>🔄 게스트 모드 재시작</span>
            </button>
          </div>

          {/* 하단 텍스트 */}
          <p className="text-center text-gray-400 text-sm mt-4">
            언제든지 회원가입 없이도 게스트 모드를 다시 체험하실 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
} 