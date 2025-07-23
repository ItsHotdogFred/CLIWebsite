// --- File System Simulation ---
const fileSystem = {
    'Aboutme': {
        type: 'directory',
        content: {
            'bio.txt': { type: 'file', content: `Hello! I'm a passionate developer who likes to create games using gdscript inside the Godot Game engine. I like to build custom systems which make my life easier or improve game performance. I've only released a few games that I've made which are on itch.io. I'm currently creating a rougelike / bullet hell game set in space.` },
            'contact.txt': { type: 'file', content: `You can find me on:\n- GitHub:   github.com/ItsHotdogFred\n- Itch.io:  itshotdogfred.itch.io\n- Email:    cli@itsfred.dev` },
            'skills.txt': { type: 'file', content: `░██████╗░░█████╗░██████╗░░█████╗░████████╗
██╔════╝░██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝
██║░░██╗░██║░░██║██║░░██║██║░░██║░░░██║░░░
██║░░╚██╗██║░░██║██║░░██║██║░░██║░░░██║░░░
╚██████╔╝╚█████╔╝██████╔╝╚█████╔╝░░░██║░░░
░╚═════╝░░╚════╝░╚═════╝░░╚════╝░░░░╚═╝░░░

My Skills:
- Godot (guh - dow) Game Developer
- Gdscript (Godots Built in Language)
- HTML, CSS, Bit of JS & TS
- Tailwind CSS
- Level 2 Svelte user
- LLMs
- Procrastinating 
- Golang (Currently learning and using to create cli tools)`}
        }
    },
    'Projects': {
        type: 'directory',
        content: {
            'cli-website.md': { type: 'file', content: `## The very website you're exploring right now!\n---------------------------------------\nI've been wanting to create a website for myself for a while now\nbut haven't had a good idea for what it should be it, till now!`},
            'pixelator.md': { type: 'file', content: `## Itch.io game - Pixelator\n---------------------------------------\nPixelator is the first game that I released! It's a short but challenging game, \nmaking the game taught me alot about the Godot Engine and now it's my choice of Game Engine.\nHere is a link to the game: https://itshotdogfred.itch.io/pixelator` },
            'space-roguelike.md': { type: 'file', content: `## Space Roguelike\n---------------------------------------\nThis is a game that I'm currently working on, it's a rougelike / bullet hell game set in space.\nI don't have much to show yet but I will update this file when I do!` }
        }
    },
    'README.md': { type: 'file', content: `Welcome to my interactive website!\nThis is a simulated terminal environment.\nHere are some commands you can try:\n- 'help'          : Show available commands.\n- 'ls'            : List files and directories.\n- 'cd [dir]'      : Change directory (e.g., 'cd Aboutme'). Use 'cd ..' to go back.\n- 'cat [file]'    : View the contents of a file.\n- 'clear'         : Clear the terminal screen.\n\nPro-tips:\n- Type 'ls' to show folders and files!\n- Items from 'ls' command are clickable!\n- Use Tab for autocompletion.\n- Use Arrow Keys (Up/Down) for command history.\n` },
    'Top-Secret': {
        type: 'directory',
        content: {
            '!@&%*@(%).txt': { type: 'file', content: `You weren't supposed to find this!\noh well...\nHere are some cool commands you can try out!\n- rickroll\n- fortune\n- tetris\n- matrix\n- rm\n- coinflip\n- magic8\n- snake\n` }
        }
    }
};

// --- State ---
let cwd = fileSystem;
let path = [];

// --- Utility Functions ---
function findKeyCaseInsensitive(obj, key) {
    if (!key) return null;
    const lowerKey = key.toLowerCase();
    return Object.keys(obj).find(k => k.toLowerCase() === lowerKey);
}

function resolvePath(targetPath) {
    let tempPath = [...path];
    if (targetPath === '..') {
        if (tempPath.length > 0) tempPath.pop();
    } else if (targetPath) {
        let currentLevel = fileSystem;
        for (const part of path) {
            currentLevel = currentLevel[part].content;
        }
        const realKey = findKeyCaseInsensitive(currentLevel, targetPath);
        const targetNode = realKey ? currentLevel[realKey] : null;
        if (targetNode && targetNode.type === 'directory') {
            tempPath.push(realKey);
        } else {
            return { error: `cd: no such file or directory: ${targetPath}` };
        }
    } else {
        tempPath = [];
    }
    let newCwd = fileSystem;
    for (const dir of tempPath) {
        newCwd = newCwd[dir].content;
    }
    return { newCwd, newPath: tempPath };
}

function escapeHtml(unsafe) {
    return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// Export for use in other modules
window.fileSystem = fileSystem;
window.cwd = cwd;
window.path = path;
window.findKeyCaseInsensitive = findKeyCaseInsensitive;
window.resolvePath = resolvePath;
window.escapeHtml = escapeHtml; 