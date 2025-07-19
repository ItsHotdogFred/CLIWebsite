// --- DOM Elements ---
const terminal = document.getElementById('terminal');
const output = document.getElementById('output');
const promptElement = document.getElementById('prompt');
const commandInput = document.getElementById('commandInput');

// --- State ---
let commandHistory = [];
let historyIndex = -1;

// Load command history from localStorage on startup
function loadCommandHistory() {
    const savedHistory = localStorage.getItem('cliCommandHistory');
    if (savedHistory) {
        try {
            commandHistory = JSON.parse(savedHistory);
            historyIndex = commandHistory.length;
        } catch (e) {
            console.warn('Failed to load command history from localStorage:', e);
            commandHistory = [];
            historyIndex = -1;
        }
    }
}

// Save command history to localStorage
function saveCommandHistory() {
    try {
        localStorage.setItem('cliCommandHistory', JSON.stringify(commandHistory));
    } catch (e) {
        console.warn('Failed to save command history to localStorage:', e);
    }
}

// --- Utility Functions ---
function getPrompt() {
    const pathString = path.length > 0 ? `~/${path.join('/')}` : '~';
    return `<span class="prompt-user">guest@itsfred.dev</span>:<span class="directory">${pathString}</span><span class="prompt-symbol">$</span>&nbsp;`;
}

function updatePrompt() {
    promptElement.innerHTML = getPrompt();
}

function appendOutput(html) {
    output.innerHTML += html;
    terminal.scrollTop = terminal.scrollHeight;
}

function deactivateOldLinks() {
    output.querySelectorAll('.selectable-item').forEach(item => {
        item.classList.remove('selectable-item');
        item.onclick = null;
    });
}

// This function is called from onclick attributes in the HTML
function handleItemClick(element) {
    deactivateOldLinks();

    const name = element.dataset.name;
    const type = element.dataset.type;
    const originalPath = JSON.parse(element.dataset.path);

    // Find the parent node in the file system using the original path
    let parentNode = fileSystem;
    for (const dir of originalPath) {
        parentNode = parentNode[dir].content;
    }
    const itemNode = parentNode[name];

    // Construct the full path for display
    const displayPath = [...originalPath, name].join('/');
    const commandStr = type === 'directory' ? `cd ${displayPath}` : `cat ${displayPath}`;
    appendOutput(`<div>${getPrompt()}${escapeHtml(commandStr)}</div>`);

    if (type === 'directory') {
        // Directly update cwd and path state
        path = [...originalPath, name];
        cwd = itemNode.content;
        updatePrompt();
    } else { // type === 'file'
        appendOutput(`<pre class="whitespace-pre-wrap">${escapeHtml(itemNode.content)}</pre>`);
    }
    terminal.scrollTop = terminal.scrollHeight;
}
window.handleItemClick = handleItemClick;

// --- Main Logic ---
function processCommand(commandStr) {
    deactivateOldLinks();
    
    const processQuotes = (str) => {
        const parts = str.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
        return parts.map(part => part.replace(/"/g, ''));
    };

    const displayStr = commandStr.startsWith('cd') || commandStr.startsWith('cat') ? commandStr : commandStr.toLowerCase();
    appendOutput(`<div>${getPrompt()}${escapeHtml(displayStr)}</div>`);
    
    if (commandStr.trim() !== '') {
        commandHistory.push(commandStr);
        saveCommandHistory(); // Save to localStorage after adding new command
    }
    historyIndex = commandHistory.length;

    const [command, ...args] = processQuotes(commandStr.trim());

    if (command) {
        const handler = commands[command.toLowerCase()];
        if (handler) {
            handler(args);
        } else {
            appendOutput(`<div>command not found: ${escapeHtml(command)}</div>`);
        }
    }
    updatePrompt();
}

// --- Event Listeners ---
commandInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        processCommand(commandInput.value);
        commandInput.value = '';
        return;
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (e.key === 'ArrowUp') {
            if (historyIndex > 0) {
                historyIndex--;
                commandInput.value = commandHistory[historyIndex];
            }
        } else { // ArrowDown
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                commandInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                commandInput.value = '';
            }
        }
        setTimeout(() => commandInput.selectionStart = commandInput.selectionEnd = commandInput.value.length, 0);
        return;
    }
    
    if (e.key === 'Tab') {
        e.preventDefault();
        const text = commandInput.value;
        const [command, ...args] = text.split(' ');
        const currentArg = args.length > 0 ? args[args.length - 1] : command;
        
        let possibilities = (args.length === 0 && !text.includes(' ')) ? Object.keys(commands) : Object.keys(cwd);

        const matches = possibilities.filter(p => p.toLowerCase().startsWith(currentArg.toLowerCase()));
        if (matches.length === 1) {
            let completed = matches[0];
            if (args.length === 0 && !text.includes(' ')) {
                commandInput.value = completed + ' ';
            } else {
                args[args.length - 1] = completed.includes(' ') ? `"${completed}"` : completed;
                commandInput.value = `${command} ${args.join(' ')}`;
            }
        }
    }
});

// --- Initialization ---
function init() {
    loadCommandHistory(); // Load command history from localStorage
    appendOutput(`<div>Welcome to ItsFred.dev CLI (v1.0.0)</div>`);
    processCommand('neofetch');
    processCommand('cat README.md');
    processCommand('ls');
    commandInput.focus();
}

// Export for use in other modules
window.terminal = terminal;
window.output = output;
window.promptElement = promptElement;
window.commandInput = commandInput;
window.commandHistory = commandHistory;
window.historyIndex = historyIndex;
window.getPrompt = getPrompt;
window.updatePrompt = updatePrompt;
window.appendOutput = appendOutput;
window.deactivateOldLinks = deactivateOldLinks;
window.processCommand = processCommand;
window.loadCommandHistory = loadCommandHistory;
window.saveCommandHistory = saveCommandHistory;
window.init = init; 