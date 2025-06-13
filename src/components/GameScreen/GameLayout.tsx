import React from 'react';

interface GameLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  modal?: React.ReactNode;
}

/**
 * Game layout presentational component
 * Handles responsive grid layout without game logic
 */
export const GameLayout: React.FC<GameLayoutProps> = ({ 
  leftPanel, 
  rightPanel, 
  modal 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 animate-fadeIn">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="relative z-10 container mx-auto p-4 h-screen">
        <div className="bg-slate-800/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-900/20 h-full overflow-hidden">
          <div className="flex flex-col lg:flex-row h-full">
            
            {/* Left panel - Character stats */}
            <div className="lg:w-1/3 xl:w-2/5 h-full border-r border-purple-500/20 bg-gradient-to-b from-slate-800/50 to-slate-900/50">
              <div className="h-full p-4">
                {leftPanel}
              </div>
            </div>
        
            {/* Right panel - Story and controls */}
            <div className="lg:w-2/3 xl:w-3/5 flex flex-col h-full">
              {rightPanel}
            </div>
          </div>
        </div>
      </div>

      {modal}
    </div>
  );
}; 