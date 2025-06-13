import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppLayout from '../AppLayout';
import { AdminUser } from '../../types/admin';

// Mock dependencies
vi.mock('../../stores/gameStore', () => ({
  useGameState: vi.fn(() => null),
  useAdminMode: vi.fn(() => false),
  useGameActions: vi.fn(() => ({ setAdminMode: vi.fn() }))
}));

vi.mock('../../data/worldSettings', () => ({
  default: {
    getCurrentWorld: vi.fn(() => ({ name: 'Test World' }))
  }
}));

// Mock window.prompt and window.alert
Object.defineProperty(window, 'prompt', {
  writable: true,
  value: vi.fn()
});

Object.defineProperty(window, 'alert', {
  writable: true,
  value: vi.fn()
});

describe('AppLayout', () => {
  const mockAdminUser: AdminUser = {
    id: '1',
    username: 'admin',
    email: 'admin@test.com',
    role: 'super_admin',
    permissions: [],
    lastLogin: new Date(),
    isActive: true
  };

  const defaultProps = {
    adminUser: null,
    onAdminLogin: vi.fn(),
    onAdminLogout: vi.fn(),
    children: <div data-testid="test-children">Test Content</div>
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders header, main content, and footer', () => {
    render(<AppLayout {...defaultProps} />);

    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
    expect(screen.getByTestId('test-children')).toBeInTheDocument();
  });

  it('displays app title and subtitle', () => {
    render(<AppLayout {...defaultProps} />);

    expect(screen.getByText(/LLM/)).toBeInTheDocument();
    expect(screen.getByText(/LIKE/)).toBeInTheDocument();
    expect(screen.getByText('AI가 만드는 텍스트 로그라이크 어드벤처')).toBeInTheDocument();
  });

  it('shows admin login button when not in admin mode', () => {
    render(<AppLayout {...defaultProps} />);

    const adminButton = screen.getByRole('button', { name: /관리자/ });
    expect(adminButton).toBeInTheDocument();
    expect(adminButton).toHaveTextContent('관리자');
  });

  it('shows game mode button when in admin mode', () => {
    const propsWithAdmin = {
      ...defaultProps,
      adminUser: mockAdminUser
    };

    // Mock admin mode as true in the module mock above
    const mockUseAdminMode = vi.mocked(require('../../stores/gameStore').useAdminMode);
    mockUseAdminMode.mockReturnValue(true);

    render(<AppLayout {...propsWithAdmin} />);

    const gameModeButton = screen.getByRole('button', { name: /게임 모드로 돌아가기/ });
    expect(gameModeButton).toBeInTheDocument();
    expect(gameModeButton).toHaveTextContent('게임 모드');
  });

  it('displays copyright and status information in footer', () => {
    render(<AppLayout {...defaultProps} />);

    expect(screen.getByText(/© 2025/)).toBeInTheDocument();
    expect(screen.getByText(/LLMLIKE/)).toBeInTheDocument();
    expect(screen.getByText(/Claude API 기반 텍스트 로그라이크 어드벤처/)).toBeInTheDocument();
    expect(screen.getByText(/AI 서비스 운영 중/)).toBeInTheDocument();
  });

  it('handles admin login on button click with correct password', () => {
    const mockOnAdminLogin = vi.fn();
    const props = {
      ...defaultProps,
      onAdminLogin: mockOnAdminLogin
    };

    vi.mocked(window.prompt).mockReturnValue('admin123');

    render(<AppLayout {...props} />);

    const adminButton = screen.getByRole('button', { name: /관리자/ });
    fireEvent.click(adminButton);

    expect(window.prompt).toHaveBeenCalledWith('관리자 비밀번호를 입력하세요:');
    expect(mockOnAdminLogin).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'admin',
        role: 'super_admin'
      })
    );
  });

  it('shows error for incorrect admin password', () => {
    vi.mocked(window.prompt).mockReturnValue('wrong-password');
    vi.mocked(window.alert).mockImplementation(() => {});

    render(<AppLayout {...defaultProps} />);

    const adminButton = screen.getByRole('button', { name: /관리자/ });
    fireEvent.click(adminButton);

    expect(window.alert).toHaveBeenCalledWith('잘못된 비밀번호입니다.');
  });
}); 