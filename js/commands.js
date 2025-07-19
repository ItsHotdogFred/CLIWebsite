// --- Command Handlers ---
const commands = {
    help: () => {
        appendOutput(`<div>Available commands:</div>
        <div class="grid grid-cols-[100px_1fr] gap-x-4">
            <span>help</span><span>Show this help message</span>
            <span>ls</span><span>List files and directories</span>
            <span>cd [dir]</span><span>Change directory</span>
            <span>cat [file]</span><span>Display file content</span>
            <span>clear</span><span>Clear the terminal</span>
            <span>whoami</span><span>Display user info</span>
        </div><br>`);
    },

    ls: () => {
        const entries = Object.keys(cwd);
        if (entries.length === 0) return;
        
        const pathJson = escapeHtml(JSON.stringify(path));
        let listOutput = '<div class="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">';
        entries.forEach(entry => {
            const item = cwd[entry];
            const className = item.type === 'directory' ? 'directory' : 'file';
            listOutput += `<span class="selectable-item ${className}" data-name="${escapeHtml(entry)}" data-type="${item.type}" data-path='${pathJson}' onclick="handleItemClick(this)">${escapeHtml(entry)}</span>`;
        });
        listOutput += '</div>';
        appendOutput(listOutput);
    },

    cd: (args) => {
        const target = args.join(' ') || '';
        if (target === '.' || target === '') return;
        const { newCwd, newPath, error } = resolvePath(target);
        if (error) {
            appendOutput(`<div>${error}</div>`);
        } else {
            cwd = newCwd;
            path = newPath;
        }
    },

    pwd: () => {
        appendOutput(`<div>/${path}</div>`);
    },

    cat: (args) => {
        const fileName = args.join(' ');
        if (!fileName) {
            appendOutput(`<div>cat: missing operand</div>`);
            return;
        }
        const fileKey = findKeyCaseInsensitive(cwd, fileName);
        const file = fileKey ? cwd[fileKey] : null;

        if (file && file.type === 'file') {
            appendOutput(`<pre class="whitespace-pre-wrap">${escapeHtml(file.content)}</pre>`);
        } else if (file && file.type === 'directory') {
            appendOutput(`<div>cat: ${escapeHtml(fileName)}: Is a directory</div>`);
        } else {
            appendOutput(`<div>cat: ${escapeHtml(fileName)}: No such file or directory</div>`);
        }
    },

    clear: () => { output.innerHTML = ''; },

    whoami: () => { appendOutput(`<div>guest</div>`); },

    rickroll: () => {
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
        appendOutput(`<div>Never gonna give you up! 🎵</div>`);
    },

    fortune: () => {
        const fortunes = [
        "The best debugger is a good night's sleep.",
        "Code never lies, comments sometimes do.",
        "There are only 10 types of people: those who understand binary and those who don't.",
        "A programmer is just a tool which converts caffeine into code.",
        "Programming is like writing a book... except if you miss out a single comma on page 126, the whole thing makes no sense.",
        "Why do programmers prefer dark mode? Because light attracts bugs!",
        "It works on my machine ¯\\_(ツ)_/¯"
        ];
        const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        appendOutput(`<div class="text-green-300">${randomFortune}</div>`);
    },

    tetris: () => {
        appendOutput(`<div class="text-center">
            <div class="text-cyan-400 mb-2">🎮 TETRIS 🎮</div>
            <pre class="text-sm">
            ██    ██  
            ██    ██  
            ██    ██  
            ██    ██  
            ██████████

            Score: 1337
            Level: 42
            Lines: 69
            </pre>
            <div class="text-yellow-300">Game Over! (This is just ASCII art, sorry! 😄)</div>
        </div>`);
    },

    echo: (args) => {
        appendOutput(`<div>${args.join(' ')}</div>`);
    },

    matrix: () => {
        let matrixText = '';
        for (let i = 0; i < 20; i++) {
            let line = '';
            for (let j = 0; j < 80; j++) {
                line += Math.random() > 0.5 ? String.fromCharCode(0x30A0 + Math.random() * 96) : ' ';
            }
            matrixText += line + '\n';
        }
        appendOutput(`<pre class="text-green-400 text-xs overflow-hidden">${matrixText}</pre>`);
    },

    rm: (args) => {
        if (args.includes('-rf') || args.includes('-fr')) {
            appendOutput(`<div class="text-red-500">💀 CRITICAL ERROR: Attempting to delete system files...</div>`);
            appendOutput(`<div class="text-red-400">rm: cannot remove '/': Permission denied</div>`);
            appendOutput(`<div class="text-red-400">rm: cannot remove '/usr': Permission denied</div>`);
            appendOutput(`<div class="text-red-400">rm: cannot remove '/var': Permission denied</div>`);
            appendOutput(`<div class="text-yellow-300">🔥 System compromised! Initiating emergency shutdown...</div>`);
            
            setTimeout(() => {
                appendOutput(`<div class="text-red-600 text-center text-xl">💥 SYSTEM DESTROYED 💥</div>`);
                setTimeout(() => {
                    window.close();
                    // Fallback if window.close() doesn't work (some browsers block it)
                    if (!window.closed) {
                        appendOutput(`<div class="text-green-300">😄 Just kidding! Your system is safe. But seriously, never run 'rm -rf /' on a real Linux system!</div>`);
                    }
                }, 2000);
            }, 1500);
        } else {
            appendOutput(`<div>rm: missing operand. Try 'rm -rf' if you're feeling dangerous... 😈</div>`);
        }
    },

    exit: () => {
        window.close();

        if (!window.closed) {
            appendOutput(`Browser won't allow it, sorry bud.`)
        }
    },

    coinflip: () => appendOutput(Math.random(0, 1) < 0.5 ? "heads" : "tails")
};

// Export for use in other modules
window.commands = commands; 