
import React from 'react';
import { ObfuscationSettings, Intensity } from '../types';

interface SidebarProps {
  settings: ObfuscationSettings;
  setSettings: (settings: ObfuscationSettings) => void;
  onObfuscate: () => void;
  isProcessing: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ settings, setSettings, onObfuscate, isProcessing }) => {
  const updateSetting = <K extends keyof ObfuscationSettings>(key: K, value: ObfuscationSettings[K]) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <aside className="w-80 border-r border-zinc-200 dark:border-border-dark bg-white/50 dark:bg-surface-dark/90 backdrop-blur-xl flex flex-col shrink-0 overflow-y-auto custom-scrollbar z-10 transition-colors duration-300">
      <div className="p-6 flex flex-col gap-8">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">混淆强度 / INTENSITY</h3>
          <div className="grid grid-cols-3 gap-2">
            {(['light', 'medium', 'strong'] as Intensity[]).map((level) => (
              <label key={level} className="cursor-pointer group relative">
                <input
                  className="peer sr-only"
                  name="intensity"
                  type="radio"
                  checked={settings.intensity === level}
                  onChange={() => updateSetting('intensity', level)}
                />
                <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-zinc-200 dark:border-border-dark bg-white dark:bg-surface-lighter text-zinc-400 dark:text-text-secondary transition-all duration-300 peer-checked:border-primary/50 peer-checked:bg-primary/20 peer-checked:text-primary dark:peer-checked:text-white peer-checked:shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)] group-hover:bg-zinc-50 dark:group-hover:bg-surface-lighter/80">
                  <span className="material-symbols-outlined mb-1.5 text-[24px] transition-transform group-hover:scale-110">
                    {level === 'light' ? 'bolt' : level === 'medium' ? 'security' : 'encrypted'}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {level === 'light' ? '轻度' : level === 'medium' ? '中度' : '强力'}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">保护层级 / LAYERS</h3>
          <div className="space-y-3">
            {[
              { id: 'renameVariables', label: '变量重命名', desc: '将变量名替换为无意义字符' },
              { id: 'stringEncryption', label: '字符串加密', desc: '对字符串常量进行 AES加密' },
              { id: 'controlFlowFlattening', label: '控制流平坦化', desc: '打乱逻辑结构以对抗分析' },
              { id: 'deadCodeInjection', label: '死代码注入', desc: '注入误导性的无效代码' },
            ].map((opt) => (
              <label key={opt.id} className="flex items-start justify-between cursor-pointer group p-2 mx-[-8px] rounded-lg hover:bg-zinc-100 dark:hover:bg-surface-lighter/50 transition-colors">
                <div className="flex flex-col pr-3">
                  <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 transition-colors group-hover:text-zinc-900 dark:group-hover:text-white">{opt.label}</span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">{opt.desc}</span>
                </div>
                <div className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-zinc-200 dark:bg-surface-lighter border border-zinc-300 dark:border-border-dark transition-colors group-hover:border-zinc-400 dark:group-hover:border-slate-500 mt-1">
                  <input
                    className="peer sr-only"
                    type="checkbox"
                    checked={settings[opt.id as keyof ObfuscationSettings] as boolean}
                    onChange={(e) => updateSetting(opt.id as any, e.target.checked)}
                  />
                  <span className="h-3 w-3 translate-x-1 rounded-full bg-zinc-400 transition-all duration-300 peer-checked:translate-x-5 peer-checked:bg-primary peer-checked:shadow-[0_0_10px_rgba(139,92,246,0.8)]"></span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-200 dark:border-border-dark">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">配置 / CONFIGURATION</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-2 flex justify-between items-center">
                目标运行环境
              </label>
              <div className="relative">
                <select
                  value={settings.targetEnvironment}
                  onChange={(e) => updateSetting('targetEnvironment', e.target.value)}
                  className="w-full h-10 rounded-lg border-zinc-200 dark:border-border-dark bg-white dark:bg-surface-lighter text-sm text-zinc-900 dark:text-zinc-200 focus:ring-1 focus:ring-primary focus:border-primary/50 focus:bg-zinc-50 dark:focus:bg-surface-dark transition-all appearance-none px-3"
                >
                  <option>Browser (Universal)</option>
                  <option>Node.js</option>
                  <option>Service Worker</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-2 flex justify-between items-center">
                排除项 (逗号分隔)
              </label>
              <textarea
                value={settings.exclusions}
                onChange={(e) => updateSetting('exclusions', e.target.value)}
                className="w-full rounded-lg border-zinc-200 dark:border-border-dark bg-white dark:bg-surface-lighter text-sm text-zinc-900 dark:text-zinc-200 focus:ring-1 focus:ring-primary focus:border-primary/50 focus:bg-zinc-50 dark:focus:bg-surface-dark transition-all resize-none h-24 p-3 font-mono placeholder:text-zinc-500 dark:placeholder:text-text-secondary custom-scrollbar"
                placeholder="例如: jQuery, $, React..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-zinc-200 dark:border-border-dark bg-white/60 dark:bg-surface-dark/60 backdrop-blur-xl sticky bottom-0 transition-colors duration-300">
        <button
          onClick={onObfuscate}
          disabled={isProcessing}
          className={`group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-600 to-primary hover:from-indigo-500 hover:to-violet-400 h-12 px-4 text-white font-bold transition-all shadow-lg shadow-primary/20 ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-primary/40'}`}
        >
          <span className={`material-symbols-outlined text-[20px] ${isProcessing ? 'animate-spin' : ''}`}>
            {isProcessing ? 'sync' : 'auto_fix_high'}
          </span>
          <span>{isProcessing ? '系统处理中...' : '开始混淆代码'}</span>
        </button>
        <div className="flex justify-between items-center mt-3 px-1">
          <span className="text-[10px] text-zinc-500 font-medium">企业版 V2.5</span>
          <span className="text-[10px] text-zinc-500 font-medium">不限大小</span>
        </div>
      </div>
    </aside>
  );
};
