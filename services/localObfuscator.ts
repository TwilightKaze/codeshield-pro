import { ObfuscationSettings } from "../types";

export const localObfuscate = (code: string, settings: ObfuscationSettings): string => {
    let processedCode = code;
    const lang = settings.language;

    // --- Language Specific Headers & Comment Styles ---
    let header = `// [OFFLINE MODE] Basic Obfuscation Applied (${lang})`;
    if (lang === 'Python') header = `# [OFFLINE MODE] Basic Obfuscation Applied (${lang})`;

    // --- Obfuscation Logic ---

    // 1. Variable Renaming (Simulated)
    if (settings.renameVariables) {
        if (lang === 'JavaScript') {
            const commonVars = ['total', 'price', 'tax', 'count', 'index', 'data', 'result', 'value'];
            commonVars.forEach((v) => {
                const newName = `_0x${Math.random().toString(16).substr(2, 4)}`;
                const regex = new RegExp(`\\b${v}\\b`, 'g');
                processedCode = processedCode.replace(regex, newName);
            });
        } else if (lang === 'Python') {
            const commonVars = ['total', 'price', 'tax', 'count', 'data'];
            commonVars.forEach((v) => {
                const newName = `_var_${Math.random().toString(16).substr(2, 4)}`;
                const regex = new RegExp(`\\b${v}\\b`, 'g');
                processedCode = processedCode.replace(regex, newName);
            });
        }
        // PHP, Go, Java: Skip risky regex renaming in offline mode to avoid syntax errors
    }

    // 2. String Encryption (Base64)
    if (settings.stringEncryption) {
        // Universal quote matching (Works for JS, PHP, Java, Go, Python mostly)
        processedCode = processedCode.replace(/(['"])(.*?)\1/g, (match, quote, content) => {
            if (content.length < 2) return match;
            try {
                const encoded = btoa(content);
                if (lang === 'JavaScript') return `atob("${encoded}")`;
                if (lang === 'Python') return `base64.b64decode("${encoded}").decode('utf-8')`; // Requires import base64
                if (lang === 'PHP') return `base64_decode("${encoded}")`;
                if (lang === 'Go') return `string(base64.StdEncoding.DecodeString("${encoded}"))`; // Pseudo code
                if (lang === 'Java') return `new String(Base64.getDecoder().decode("${encoded}"))`;
                return match;
            } catch (e) {
                return match;
            }
        });
    }

    // 3. Dead Code Injection
    if (settings.deadCodeInjection) {
        let deadCode = '';
        if (lang === 'JavaScript' || lang === 'Java' || lang === 'Go' || lang === 'PHP') {
            deadCode = `
/* Protected by CodeShield */
// _0x4f2a1b check integrity
`;
        } else if (lang === 'Python') {
            deadCode = `
# Protected by CodeShield
# _0x4f2a1b check integrity
if False: pass
`;
        }
        processedCode = deadCode + processedCode;
    }

    // 4. Minification (Basic)
    if (settings.intensity === 'strong') {
        if (lang !== 'Python') { // Python relies on indentation
            processedCode = processedCode.replace(/\n\s+/g, ' ');
        } else {
            processedCode = processedCode.replace(/\n\n/g, '\n'); // Remove extra lines for Python
        }
    }

    return `${header}\n${processedCode}`;
};
