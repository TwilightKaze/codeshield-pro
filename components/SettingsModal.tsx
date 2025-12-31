import React, { useState, useEffect } from 'react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const [apiKey, setApiKey] = useState('');
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const storedKey = localStorage.getItem('gemini_api_key') || '';
        setApiKey(storedKey);
        const storedTheme = localStorage.getItem('app_theme') || 'dark';
        setTheme(storedTheme);
    }, [isOpen]);

    const handleSave = () => {
        localStorage.setItem('gemini_api_key', apiKey);
        localStorage.setItem('app_theme', theme);
        // In a real app we'd trigger a theme change here, but for now we just save it.
        // Since the app is forced dark mode in index.html, this is mostly for the API key.
        onClose();
        window.location.reload(); // Simple way to ensure key and theme logic propagates if needed
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
                {/* Abstract Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] pointer-events-none"></div>

                <div className="flex items-center justify-between mb-6 relative z-10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">settings</span>
                        系统设置
                    </h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="space-y-6 relative z-10">
                    {/* API Key Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Gemini API Key</label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your Google Gemini API Key"
                            className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary text-sm text-white placeholder-zinc-600 outline-none transition-all"
                        />
                        <p className="text-[11px] text-zinc-500">
                            密钥将存储在本地浏览器的 LocalStorage 中，不会上传到服务器。
                        </p>
                    </div>

                    {/* Theme Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">界面主题</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setTheme('dark')}
                                className={`flex items-center justify-center gap-2 py-2 rounded-lg border transition-all ${theme === 'dark' ? 'bg-primary/20 border-primary/50 text-white' : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">dark_mode</span>
                                <span className="text-sm">深色 (默认)</span>
                            </button>
                            <button
                                onClick={() => setTheme('light')}
                                className={`flex items-center justify-center gap-2 py-2 rounded-lg border transition-all ${theme === 'light' ? 'bg-primary/20 border-primary/50 text-white' : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">light_mode</span>
                                <span className="text-sm">浅色</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 relative z-10">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 rounded-lg text-sm font-bold bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/25 transition-all hover:scale-[1.02]"
                    >
                        保存并应用
                    </button>
                </div>
            </div>
        </div>
    );
};
