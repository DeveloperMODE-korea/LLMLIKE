import React, { useState } from 'react';
import { Key, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { apiService } from '../services/apiService';

interface ApiKeySetupProps {
  onApiKeySet: () => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError('API 키를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // API 키 유효성 테스트
      const testResult = await apiService.testApiKey(apiKey);
      
      if (!testResult.isValid) {
        setError('유효하지 않은 API 키입니다. Claude API 키를 확인해주세요.');
        setIsLoading(false);
        return;
      }

      // API 키 저장
      await apiService.setApiKey(apiKey);
      setSuccess('API 키가 성공적으로 설정되었습니다!');
      
      setTimeout(() => {
        onApiKeySet();
      }, 1500);

    } catch (error) {
      console.error('API 키 설정 오류:', error);
      setError(error instanceof Error ? error.message : 'API 키 설정 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-800 rounded-lg border border-purple-900 p-6">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <Key className="w-12 h-12 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-purple-300 mb-2">Claude API 키 설정</h2>
        <p className="text-gray-400">
          AI 기반 스토리 생성을 위해 Claude API 키가 필요합니다.
        </p>
      </div>

      <div className="bg-slate-900 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-purple-300 mb-3">📋 API 키 설정 방법</h3>
        <ol className="text-sm text-gray-300 space-y-2">
          <li>1. <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">Anthropic Console</a>에 로그인</li>
          <li>2. "API Keys" 섹션에서 새 API 키 생성</li>
          <li>3. 생성된 API 키를 아래에 입력</li>
        </ol>
        <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
          <p className="text-yellow-400 text-sm">
            💡 <strong>보안:</strong> API 키는 안전하게 서버에 저장되며, 귀하의 게임에만 사용됩니다.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
            Claude API 키
          </label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-api03-..."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-purple-500 text-white pr-12"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              disabled={isLoading}
            >
              {showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-400 bg-red-900/20 border border-red-700 rounded-lg p-3">
            <AlertCircle size={20} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center space-x-2 text-green-400 bg-green-900/20 border border-green-700 rounded-lg p-3">
            <CheckCircle size={20} />
            <span className="text-sm">{success}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !apiKey.trim()}
          className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>API 키 확인 중...</span>
            </>
          ) : (
            <>
              <Key size={20} />
              <span>API 키 설정</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          API 키가 없으신가요?{' '}
          <a 
            href="https://docs.anthropic.com/claude/docs/getting-started" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            Claude API 시작 가이드
          </a>
        </p>
      </div>
    </div>
  );
};

export default ApiKeySetup; 