// 🔥 테스트 로그 - 새 빌드가 반영되었는지 확인
console.log('🔥 NEW BUILD LOADED! 새 빌드가 로드되었습니다!');
console.log('🕐 빌드 시간:', new Date().toLocaleString());

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('🚀 React 앱 시작!');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

console.log('✅ React 앱 렌더링 완료!');
