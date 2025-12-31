
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { EditorPane } from './components/EditorPane';
import { SettingsModal } from './components/SettingsModal';
import { Language, Intensity, ObfuscationSettings, AppState } from './types';
import { obfuscateCode } from './services/obfuscator';
import { localObfuscate } from './services/localObfuscator';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    sourceCode: `// Paste your JavaScript code here...
function calculateTotal(price, tax) {
    const total = price + (price * tax);
    console.log('Calculating...');
    return total.toFixed(2);
}

// Example usage
const cartTotal = calculateTotal(100, 0.08);
console.log('Total is:', cartTotal);`,
    codeBuffers: {
      'JavaScript': `// Paste your JavaScript code here...
function calculateTotal(price, tax) {
    const total = price + (price * tax);
    console.log('Calculating...');
    return total.toFixed(2);
}

// Example usage
const cartTotal = calculateTotal(100, 0.08);
console.log('Total is:', cartTotal);`
    },
    obfuscatedCode: `var _0x5a1b=["\\x77\\x6F\\x72\\x6C\\x64","\\x6C\\x6F\\x67"];
function hello(){console[_0x5a1b[1]](_0x5a1b[0])};`,
    settings: {
      language: 'JavaScript',
      intensity: 'medium',
      renameVariables: true,
      stringEncryption: true,
      controlFlowFlattening: false,
      deadCodeInjection: false,
      targetEnvironment: 'Browser (Universal)',
      exclusions: ''
    },
    isProcessing: false,
    error: null
  });

  const [showToast, setShowToast] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Theme initialization on mount
  useEffect(() => {
    const theme = localStorage.getItem('app_theme') || 'dark';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleObfuscate = async () => {
    if (!state.sourceCode.trim()) return;

    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    // Simulate processing time for "feel"
    await new Promise(resolve => setTimeout(resolve, 800));

    const apiKey = localStorage.getItem('gemini_api_key');

    try {
      let result = '';
      if (!apiKey) {
        // Offline Mode
        result = localObfuscate(state.sourceCode, state.settings);
        setState(prev => ({
          ...prev,
          error: "注意：未检测到 API Key，正在使用离线基础混淆模式。" // Not an error, but using the error toast for visibility or I can add a dedicated info toast.
          // Actually, let's use the error field for now as a "Status" message or add a specific UI signal.
          // For now, setting it as error shows a red box. Maybe I should just set the code and let the user know via the text content?
          // I will prepend a comment in the code (already done in localObfuscator).
          // And maybe clear the error if it was "No Key".
        }));
        // We can also allow the user to proceed without "Error" state blocking.
      } else {
        // Online Gemini Mode
        result = await obfuscateCode(state.sourceCode, state.settings, apiKey);
      }

      setState(prev => ({
        ...prev,
        obfuscatedCode: result,
        isProcessing: false
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        error: err.message || 'Obfuscation failed',
        isProcessing: false
      }));
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Optional: show a mini toast or feedback here, but standard behavior implies success
    } catch (err) {
      setState(prev => ({ ...prev, error: "复制失败，请手动选择复制。" }));
    }
  };

  const handleExport = () => {
    const blob = new Blob([state.obfuscatedCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `obfuscated-script-${Date.now()}.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setState(prev => ({
        ...prev,
        sourceCode: text,
        codeBuffers: { ...prev.codeBuffers, [prev.settings.language]: text }
      }));
    } catch (err: any) {
      // Handle the permission block error gracefully
      console.warn("Clipboard access blocked by browser policy:", err);
      setState(prev => ({
        ...prev,
        error: "浏览器禁用了自动粘贴。请点击编辑框并使用 Ctrl+V 手动粘贴。"
      }));

      // Automatically clear the error after a few seconds
      setTimeout(() => {
        setState(prev => ({ ...prev, error: null }));
      }, 5000);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-zinc-50 dark:bg-background-dark text-zinc-900 dark:text-white font-display transition-colors duration-300">
      {/* Abstract Background Elements - Removed for cleaner dark mode */}

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 shrink-0 z-20 border-b border-zinc-200 dark:border-border-dark bg-white/70 dark:bg-surface-dark/80 backdrop-blur-md transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div className="size-10 text-primary flex items-center justify-center bg-primary/10 rounded-xl border border-primary/20 shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]">
            <span className="material-symbols-outlined text-[24px]">shield_lock</span>
          </div>
          <div>
            <h2 className="text-zinc-900 dark:text-white text-lg font-black leading-tight tracking-tight flex items-center gap-2">
              CodeShield <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">Pro</span>
            </h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] leading-none mt-1">V2.5 Enterprise</p>
          </div>
        </div>

        <div className="hidden lg:flex items-center bg-zinc-100 dark:bg-surface-lighter/50 rounded-xl p-1 border border-zinc-200 dark:border-white/5 backdrop-blur-sm transition-colors duration-300">
          {(['JavaScript', 'Python', 'PHP', 'Go', 'Java'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setState(prev => ({
                ...prev,
                sourceCode: prev.codeBuffers[lang] || '',
                settings: { ...prev.settings, language: lang }
              }))}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${state.settings.language === lang
                ? 'bg-white dark:bg-primary/20 shadow-sm dark:shadow-[0_0_20px_-5px_rgba(139,92,246,0.4)] text-primary border border-zinc-200 dark:border-primary/20'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-surface-lighter'
                }`}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-border-dark bg-zinc-100 dark:bg-surface-lighter text-xs text-zinc-500 dark:text-text-secondary font-medium transition-colors">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            系统运行正常
          </div>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center justify-center size-10 rounded-xl bg-zinc-100 dark:bg-surface-lighter hover:bg-zinc-200 dark:hover:bg-surface-lighter/80 border border-zinc-200 dark:border-border-dark transition-colors text-zinc-500 dark:text-text-secondary hover:text-zinc-900 dark:hover:text-white"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
          <div className="h-8 w-[1px] bg-zinc-200 dark:bg-border-dark mx-1 transition-colors"></div>
          <button className="flex items-center justify-center size-10 rounded-xl overflow-hidden border border-zinc-200 dark:border-border-dark hover:border-primary/50 hover:shadow-[0_0_15px_-5px_rgba(139,92,246,0.5)] transition-all">
            <img
              alt="User"
              className="size-full object-cover"
              src="https://picsum.photos/seed/user/100/100"
            />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex flex-1 overflow-hidden relative z-10">
        <div className={`transition-all duration-300 ease-in-out origin-left ${isSidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
          <Sidebar
            settings={state.settings}
            setSettings={(settings) => setState(prev => ({ ...prev, settings }))}
            onObfuscate={handleObfuscate}
            isProcessing={state.isProcessing}
          />
        </div>

        <div className="flex-1 flex flex-col md:flex-row relative bg-transparent p-4 gap-4">
          <EditorPane
            title="源代码输入 (Source Code)"
            statusColor="bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
            value={state.sourceCode}
            onChange={(sourceCode) => setState(prev => ({
              ...prev,
              sourceCode,
              codeBuffers: { ...prev.codeBuffers, [prev.settings.language]: sourceCode }
            }))}
            placeholder="// 请在此粘贴您的代码..."
            actions={
              <>
                <button
                  onClick={handlePaste}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-50 dark:bg-surface-lighter dark:hover:bg-surface-lighter/80 text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:text-text-secondary dark:hover:text-white flex items-center gap-2 transition-all border border-zinc-200 dark:border-border-dark"
                >
                  <span className="material-symbols-outlined text-[14px]">content_paste</span>
                  粘贴 / PASTE
                </button>
                <button
                  onClick={() => setState(prev => ({
                    ...prev,
                    sourceCode: '',
                    codeBuffers: { ...prev.codeBuffers, [prev.settings.language]: '' }
                  }))}
                  className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 flex items-center gap-2 transition-all border border-red-200 dark:border-red-500/20"
                >
                  <span className="material-symbols-outlined text-[14px]">delete</span>
                  清空 / CLEAR
                </button>
              </>
            }
          />

          <EditorPane
            title="混淆代码输出 (Obfuscated Output)"
            statusColor="bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            value={state.obfuscatedCode}
            readOnly
            placeholder="// 等待输入..."
            actions={
              <>
                <button
                  onClick={handleExport}
                  disabled={!state.obfuscatedCode}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-50 dark:bg-surface-lighter dark:hover:bg-surface-lighter/80 text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:text-text-secondary dark:hover:text-white flex items-center gap-2 transition-all border border-zinc-200 dark:border-border-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[14px]">download</span>
                  导出 / EXPORT
                </button>
                <button
                  onClick={() => handleCopy(state.obfuscatedCode)}
                  disabled={!state.obfuscatedCode}
                  className="px-3 py-1.5 rounded-lg bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/20 text-[10px] font-bold uppercase tracking-wider text-primary hover:text-indigo-600 dark:hover:text-indigo-300 flex items-center gap-2 transition-all border border-primary/20 hover:shadow-[0_0_15px_-5px_rgba(139,92,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[14px]">content_copy</span>
                  复制 / COPY
                </button>
              </>
            }
          />
        </div>
      </main>

      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-10 duration-500">
          <div className="bg-surface-lighter/90 backdrop-blur-xl border border-primary/30 text-white pl-4 pr-10 py-4 rounded-xl shadow-2xl shadow-primary/10 flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="bg-primary/20 p-2 rounded-lg relative z-10">
              <span className="material-symbols-outlined text-primary text-[24px]">verified_user</span>
            </div>
            <div className="flex flex-col relative z-10">
              <span className="text-sm font-bold tracking-tight text-white">Secure Environment</span>
              <span className="text-[11px] text-zinc-400 font-medium">End-to-end encryption active</span>
            </div>
            <button onClick={() => setShowToast(false)} className="absolute top-2 right-2 text-zinc-600 hover:text-white transition-colors z-20">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Error Message Popup */}
      {state.error && (
        <div className="fixed bottom-6 left-6 z-[60] max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 text-white px-5 py-4 rounded-xl shadow-2xl flex items-start gap-4">
            <span className="material-symbols-outlined text-red-500 mt-0.5">error</span>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-red-500">System Error</span>
              <p className="text-xs text-zinc-300 leading-relaxed font-medium">{state.error}</p>
            </div>
            <button onClick={() => setState(prev => ({ ...prev, error: null }))} className="text-red-500/50 hover:text-red-500 transition-colors">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
