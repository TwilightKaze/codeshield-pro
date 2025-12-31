
import React, { useRef, useState } from 'react';

interface EditorPaneProps {
  title: string;
  value: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
  statusColor: string;
  actions?: React.ReactNode;
  placeholder?: string;
}

export const EditorPane: React.FC<EditorPaneProps> = ({
  title,
  value,
  onChange,
  readOnly = false,
  statusColor,
  actions,
  placeholder
}) => {
  const lineNumbers = value.split('\n').length || 1;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isFocused ? 'scale-[1.002]' : ''}`}>
      {/* Pane Header */}
      <div className="h-10 flex items-center justify-between px-4 bg-white/50 dark:bg-surface-lighter/30 border-b border-zinc-200 dark:border-border-dark shrink-0 rounded-t-xl backdrop-blur-md mx-1 transition-colors duration-300">
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 flex items-center gap-2">
          <span className={`size-1.5 rounded-full shadow-sm ${statusColor} ${isFocused ? 'animate-pulse' : ''}`}></span>
          {title}
        </span>
        <div className="flex gap-3">
          {actions}
        </div>
      </div>

      {/* Outer Boundary Container */}
      <div className="flex-1 p-1 pb-2 bg-transparent">
        {/* Inner Editor Area with Border and Shadow */}
        <div className={`h-full flex flex-col rounded-b-xl border transition-all duration-500 overflow-hidden relative ${isFocused
          ? 'border-primary/30 bg-white/80 dark:bg-surface-dark/80 shadow-[0_0_30px_-10px_rgba(139,92,246,0.2)]'
          : 'border-zinc-200 dark:border-border-dark bg-white/30 dark:bg-surface-dark/40 hover:border-zinc-300 dark:hover:border-slate-600'
          }`}>
          <div className="flex-1 relative flex font-mono text-[13px] leading-[1.6]">
            {/* Gutter / Line Numbers */}
            <div
              ref={lineNumbersRef}
              className="w-12 bg-zinc-100/50 dark:bg-surface-lighter/20 border-r border-zinc-200 dark:border-border-dark text-zinc-400 dark:text-slate-600 text-right pr-3 pt-5 select-none overflow-hidden shrink-0 italic transition-colors duration-300"
            >
              {Array.from({ length: Math.max(lineNumbers, 30) }).map((_, i) => (
                <div key={i} className="h-[1.6em]">{i + 1}</div>
              ))}
            </div>

            {/* Input Wrapper */}
            <div className="flex-1 relative group">
              <textarea
                ref={textareaRef}
                onScroll={handleScroll}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full h-full bg-transparent text-zinc-800 dark:text-slate-200 border-none resize-none p-5 pt-5 focus:ring-0 custom-scrollbar whitespace-pre outline-none selection:bg-primary/30 selection:text-primary dark:selection:text-white placeholder:text-zinc-400 dark:placeholder:text-text-secondary transition-colors duration-300"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                readOnly={readOnly}
                spellCheck={false}
              />
              {/* Subtle inner signals */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
