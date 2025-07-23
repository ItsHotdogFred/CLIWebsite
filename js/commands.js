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
            <span>clearhistory</span><span>Clear command history</span>
            <span>whoami</span><span>Display user info</span>
            <span>rps</span><span>Play rock-paper-scissors</span>
            <span>snake</span><span>Play ASCII Snake game</span>
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

    clearhistory: () => {
        commandHistory.length = 0;
        historyIndex = -1;
        saveCommandHistory();
        appendOutput(`<div>Command history cleared.</div>`);
    },

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
            ██      ██  
            ██      ██  
            ██      ██  
            ██      ██  
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

    coinflip: () => appendOutput(Math.random(0, 1) < 0.5 ? "heads" : "tails"),

    rps: (args) => {
        const choices = ['rock', 'paper', 'scissors'];
        const playerChoice = args[0]?.toLowerCase();
        
        if (!playerChoice || !choices.includes(playerChoice)) {
            appendOutput(`<div>Usage: rps [rock|paper|scissors]</div>`);
            return;
        }
        
        const computerChoice = choices[Math.floor(Math.random() * 3)];
        const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };
        
        appendOutput(`<div>You: ${emojis[playerChoice]} ${playerChoice}</div>`);
        appendOutput(`<div>Computer: ${emojis[computerChoice]} ${computerChoice}</div>`);
        
        if (playerChoice === computerChoice) {
            appendOutput(`<div class="text-yellow-300">🤝 It's a tie!</div>`);
        } else if (
            (playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'paper' && computerChoice === 'rock') ||
            (playerChoice === 'scissors' && computerChoice === 'paper')
        ) {
            appendOutput(`<div class="text-green-400">🎉 You win!</div>`);
        } else {
            appendOutput(`<div class="text-red-400">😭 You lose!</div>`);
        }

    

    },

    magic8: (args) => {
        if (!args.length) {
            appendOutput(`<div>Usage: magic8 [your question]</div>`);
            return;
        }
        
        const responses = [
            "It is certain", "Reply hazy, try again", "Don't count on it",
            "It is decidedly so", "Ask again later", "My reply is no",
            "Without a doubt", "Better not tell you now", "My sources say no",
            "Yes definitely", "Cannot predict now", "Outlook not so good",
            "You may rely on it", "Concentrate and ask again", "Very doubtful",
            "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes"
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        appendOutput(`<div class="text-purple-400">🎱 Magic 8-Ball says: "${response}"</div>`);
},

        neofetch: () => {
        const browserInfo = navigator.userAgent;
        const platform = navigator.platform;
        const language = navigator.language;
        const cores = navigator.hardwareConcurrency || 'Unknown';
        const memory = navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'Unknown';
        const connection = navigator.connection ? navigator.connection.effectiveType : 'Unknown';
        
        const uptime = Math.floor((Date.now() - performance.timeOrigin) / 1000);
        const uptimeHours = Math.floor(uptime / 3600);
        const uptimeMinutes = Math.floor((uptime % 3600) / 60);
        const uptimeSeconds = uptime % 60;
        
        appendOutput(`<div class="neofetch-output">
            <pre class="text-sm">
<span style="color: #87c4ed">                .88888888:.              </span> <span class="text-green-400">guest</span>@<span class="text-green-400">web-terminal</span>
<span style="color: #87c4ed">               88888888.88888.           </span> <span class="text-gray-400">-----------------</span>
<span style="color: #87c4ed">             .8888888888888888.          </span> <span class="text-blue-400">OS:</span> WebOS Terminal v1.0
<span style="color: #87c4ed">             888888888888888888          </span> <span class="text-blue-400">Kernel:</span> Browser Engine
<span style="color: #87c4ed">             88' _\`88'_  \`88888          </span> <span class="text-blue-400">Uptime:</span> ${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s
<span style="color: #87c4ed">             88 88 88 88  88888          </span> <span class="text-blue-400">Shell:</span> WebShell 1.0
<span style="color: #87c4ed">             88_88_::_88_:88888          </span> <span class="text-blue-400">Resolution:</span> ${window.screen.width}x${window.screen.height}
<span style="color: #87c4ed">             88:::,::,:::::8888          </span> <span class="text-blue-400">Terminal:</span> CLI Website
<span style="color: #87c4ed">             88\`:::::::::\`8888           </span> <span class="text-blue-400">CPU:</span> ${cores} cores
<span style="color: #87c4ed">            .88  \`::::\`    8:88.         </span> <span class="text-blue-400">Memory:</span> ${memory}
<span style="color: #87c4ed">           8888            \`8:888.       </span> <span class="text-blue-400">Language:</span> ${language}
<span style="color: #87c4ed">         .8888\`             \`888888.     </span> <span class="text-blue-400">Platform:</span> ${platform}
<span style="color: #87c4ed">        .8888:..  .::.  ...:\`8888888:.   </span> <span class="text-blue-400">Connection:</span> ${connection}
<span style="color: #87c4ed">       .8888.\`     :\`     \`\`::\`88:88888  </span> 
<span style="color: #87c4ed">      .8888        \`         \`.888:8888. </span> <span class="text-red-400">███</span><span class="text-yellow-400">███</span><span class="text-green-400">███</span><span class="text-cyan-400">███</span><span class="text-blue-400">███</span><span class="text-purple-400">███</span><span class="text-pink-400">███</span><span class="text-white">███</span>
<span style="color: #87c4ed">     888:8         .           888:88888 </span> <span class="text-red-400">███</span><span class="text-yellow-400">███</span><span class="text-green-400">███</span><span class="text-cyan-400">███</span><span class="text-blue-400">███</span><span class="text-purple-400">███</span><span class="text-pink-400">███</span><span class="text-gray-400">███</span>
<span style="color: #87c4ed">   .888:88        .:           888:88888:</span>
<span style="color: #87c4ed">   8888888.       ::           88:888888 </span>
<span style="color: #87c4ed">   \`.::.888.      ::          .88888888  </span>
<span style="color: #87c4ed">  .::::::.888.    ::         :::\`8888\`.:</span>
<span style="color: #87c4ed"> ::::::::::.888   \`         .::::::::::::</span>
<span style="color: #87c4ed"> ::::::::::::.8    \`      .:8::::::::::::.</span>
<span style="color: #87c4ed">.::::::::::::::.        .:888:::::::::::::</span>
<span style="color: #87c4ed">:::::::::::::::88:.__..:88888:::::::::::\`</span>
<span style="color: #87c4ed"> \`\`.:::::::::::88888888888.88:::::::::\`  </span>
<span style="color: #87c4ed">       \`\`:::_:\` -- \`\` -\`-\` \`\`:_::::\`      </span>
            </pre>
        </div>`);
    },

    snake: () => {
        // Get high score from localStorage
        const getHighScore = () => parseInt(localStorage.getItem('snake-highscore') || '0');
        const setHighScore = (score) => localStorage.setItem('snake-highscore', score.toString());
        
        const gameId = `snake-game-${Date.now()}`;
        const width = 30;
        const height = 20;
        
        let snake = [{x: 15, y: 7}];
        let direction = {x: 1, y: 0};
        let fruit = {x: Math.floor(Math.random() * (width - 2)) + 1, y: Math.floor(Math.random() * (height - 2)) + 1};
        let score = 0;
        let highScore = getHighScore();
        let gameRunning = true;
        let gameInterval;
        
        const createBoard = () => {
            let board = Array(height).fill().map(() => Array(width).fill(' '));
            
            // Create border
            for (let x = 0; x < width; x++) {
                board[0][x] = 'X';
                board[height - 1][x] = 'X';
            }
            for (let y = 0; y < height; y++) {
                board[y][0] = 'X';
                board[y][width - 1] = 'X';
            }
            
            // Place fruit
            board[fruit.y][fruit.x] = '@';
            
            // Place snake
            snake.forEach((segment, index) => {
                if (index === 0) {
                    board[segment.y][segment.x] = '#'; // Head
                } else {
                    board[segment.y][segment.x] = '#'; // Body
                }
            });
            
            return board;
        };
        
        const renderGame = () => {
            const board = createBoard();
            const gameTimestamp = gameId.split('-')[2];
            let gameHTML = `<div class="snake-game" id="${gameId}" style="text-align: center;">
                <div class="mb-2">
                    <span class="text-blue-400">Score: ${score}</span> | 
                    <span class="text-green-400">High Score: ${highScore}</span>
                </div>`;

            if (!gameRunning) {
                // Game over - show button in the middle of the game area
                gameHTML += `<div style="position: relative; display: inline-block;">
                    <pre class="text-sm select-none" style="line-height: 0.8; font-family: 'Courier New', Consolas, monospace; letter-spacing: 0; opacity: 0.3;">`;
                
                board.forEach((row, y) => {
                    row.forEach((cell, x) => {
                        if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
                            gameHTML += '<span style="color: #666;">X</span>'; // Grey border
                        } else if (cell === '@') {
                            gameHTML += '<span style="color: #ff4444;">@</span>'; // Red fruit
                        } else if (cell === '#') {
                            gameHTML += '<span style="color: #44ff44;">#</span>'; // Green snake
                        } else {
                            gameHTML += ' ';
                        }
                    });
                    gameHTML += '\n';
                });

                gameHTML += `</pre>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                        <div class="text-red-400 mb-2" style="font-weight: bold;">Game Over!</div>
                        <button onclick="window.restartSnakeGame_${gameTimestamp}()" class="bg-blue-400 hover:bg-blue-400 px-4 py-2 rounded text-white font-bold">Restart</button>
                    </div>
                </div>`;
            } else {
                // Game running - show normal board
                gameHTML += `<pre class="text-sm select-none" style="line-height: 0.8; font-family: 'Courier New', Consolas, monospace; letter-spacing: 0; display: inline-block;">`;
                
                board.forEach((row, y) => {
                    row.forEach((cell, x) => {
                        if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
                            gameHTML += '<span style="color: #666;">X</span>'; // Grey border
                        } else if (cell === '@') {
                            gameHTML += '<span style="color: #ff4444;">@</span>'; // Red fruit
                        } else if (cell === '#') {
                            gameHTML += '<span style="color: #44ff44;">#</span>'; // Green snake
                        } else {
                            gameHTML += ' ';
                        }
                    });
                    gameHTML += '\n';
                });

                gameHTML += `</pre>`;
            }
            
            gameHTML += `<div class="text-sm mt-2">
                    <div style="color: #c0caf5">Use WASD or Arrow Keys to move</div>
                </div>
            </div>`;
            
            // Find and replace the game div
            const existingGame = document.getElementById(gameId);
            if (existingGame) {
                existingGame.outerHTML = gameHTML;
            } else {
                appendOutput(gameHTML);
            }
        };
        
        const moveSnake = () => {
            if (!gameRunning) return;
            
            const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
            
            // Check wall collision
            if (head.x <= 0 || head.x >= width - 1 || head.y <= 0 || head.y >= height - 1) {
                endGame();
                return;
            }
            
            // Check self collision
            if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                endGame();
                return;
            }
            
            snake.unshift(head);
            
            // Check fruit collision
            if (head.x === fruit.x && head.y === fruit.y) {
                score++;
                if (score > highScore) {
                    highScore = score;
                    setHighScore(highScore);
                }
                // Generate new fruit
                do {
                    fruit.x = Math.floor(Math.random() * (width - 2)) + 1;
                    fruit.y = Math.floor(Math.random() * (height - 2)) + 1;
                } while (snake.some(segment => segment.x === fruit.x && segment.y === fruit.y));
            } else {
                snake.pop();
            }
            
            renderGame();
        };
        
        const endGame = () => {
            gameRunning = false;
            clearInterval(gameInterval);
            renderGame();
        };
        
        const restartGame = () => {
            snake = [{x: 15, y: 7}];
            direction = {x: 1, y: 0};
            fruit = {x: Math.floor(Math.random() * (width - 2)) + 1, y: Math.floor(Math.random() * (height - 2)) + 1};
            score = 0;
            gameRunning = true;
            clearInterval(gameInterval);
            gameInterval = setInterval(moveSnake, 150);
            renderGame();
        };
        
        const handleKeyPress = (e) => {
            if (!gameRunning) return;
            
            const key = e.key.toLowerCase();
            if ((key === 'w' || key === 'arrowup') && direction.y !== 1) {
                e.preventDefault(); // Prevent page scrolling
                direction = {x: 0, y: -1};
            } else if ((key === 's' || key === 'arrowdown') && direction.y !== -1) {
                e.preventDefault(); // Prevent page scrolling
                direction = {x: 0, y: 1};
            } else if ((key === 'a' || key === 'arrowleft') && direction.x !== 1) {
                e.preventDefault(); // Prevent page scrolling
                direction = {x: -1, y: 0};
            } else if ((key === 'd' || key === 'arrowright') && direction.x !== -1) {
                e.preventDefault(); // Prevent page scrolling
                direction = {x: 1, y: 0};
            }
        };
        
        // Create global restart function
        const gameTimestamp = gameId.split('-')[2];
        window[`restartSnakeGame_${gameTimestamp}`] = restartGame;
        
        // Start the game
        document.addEventListener('keydown', handleKeyPress);
        gameInterval = setInterval(moveSnake, 150);
        renderGame();
        
        // Clean up when terminal is cleared (optional enhancement)
        setTimeout(() => {
            const cleanup = () => {
                document.removeEventListener('keydown', handleKeyPress);
                clearInterval(gameInterval);
                // Clean up the global restart function
                delete window[`restartSnakeGame_${gameTimestamp}`];
            };
            
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        const gameElement = document.getElementById(gameId);
                        if (!gameElement) {
                            cleanup();
                            observer.disconnect();
                        }
                    }
                });
            });
            
            observer.observe(output, { childList: true, subtree: true });
        }, 100);
    },


};

// Export for use in other modules
window.commands = commands; 