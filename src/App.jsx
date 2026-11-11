import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar.jsx';
import { Sidebar } from './components/layout/Sidebar.jsx';
import { Dashboard } from './components/modules/Dashboard.jsx';
import { ArithmeticLab } from './components/modules/ArithmeticLab.jsx';
import { ParenthesesLab } from './components/modules/ParenthesesLab.jsx';
import { PalindromeLab } from './components/modules/PalindromeLab.jsx';
import { TheoryLab } from './components/modules/TheoryLab.jsx';
import { Terminal, Github, Heart } from 'lucide-react';

export function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Navbar */}
      <Navbar
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex">
        {/* Sidebar Navigation */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Workspace Area */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {activeModule === 'dashboard' && <Dashboard onSelectModule={setActiveModule} />}
          {activeModule === 'arithmetic' && <ArithmeticLab />}
          {activeModule === 'parentheses' && <ParenthesesLab />}
          {activeModule === 'palindrome' && <PalindromeLab />}
          {activeModule === 'theory' && <TheoryLab />}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-dark-800 bg-dark-900/60 py-6 px-4 md:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">PDA &amp; CFG LAB: Assessment Task 3 Prototype</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono">
            <span>React • Vite • Tailwind • Vitest</span>
            <span>•</span>
            <span>Automata Theory &amp; Formal Languages</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
