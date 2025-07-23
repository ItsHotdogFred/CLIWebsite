# CLI Website - Interactive Terminal Portfolio

A unique portfolio website that simulates a terminal environment in the browser. Built with vanilla JavaScript, HTML, and CSS with a retro terminal aesthetic.

![CLI Website Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue)

## 🚀 Features

- **Interactive Terminal Interface** - Full command-line simulation in the browser
- **File System Navigation** - Browse directories and files with `ls`, `cd`, and `cat` commands
- **Command History** - Use arrow keys to navigate through previous commands (persisted in localStorage)
- **Tab Completion** - Auto-complete commands and file/directory names
- **Clickable File System** - Click on files and folders from `ls` output for quick navigation
- **Easter Eggs** - Hidden commands and fun interactions (try `rickroll`, `tetris`, or `matrix`)
- **Responsive Design** - Works on desktop and mobile devices
- **Retro Aesthetic** - Styled with a dark terminal theme and Fira Code font

## 🛠️ Commands Available

| Command | Description |
|---------|-------------|
| `help` | Show available commands |
| `ls` | List files and directories |
| `cd [dir]` | Change directory (use `cd ..` to go back) |
| `cat [file]` | Display file contents |
| `clear` | Clear the terminal screen |
| `clearhistory` | Clear command history |
| `whoami` | Display user info |
| `pwd` | Show current directory |
| `neofetch` | Display system information |
| `echo [text]` | Display text |
| `rps [choice]` | Play rock-paper-scissors |
| `coinflip` | Flip a coin |
| `magic8 [question]` | Ask the magic 8-ball |
| `fortune` | Get a random programming quote |
| `exit` | Attempt to close the browser tab |

### 🎮 Fun Commands
- `rickroll` - You know what this does
- `tetris` - ASCII art Tetris game
- `matrix` - Digital rain effect
- `rm -rf` - Simulated system destruction (safe!)

## 📁 Project Structure

```
├── index.html          # Main HTML file
├── styles.css          # Terminal styling
└── js/
    ├── main.js         # Core application logic
    ├── commands.js     # Command implementations
    └── filesystem.js   # Virtual file system
```

## 💡 Usage Tips

- **Tab Completion**: Press Tab to auto-complete commands and file names
- **Command History**: Use ↑/↓ arrow keys to navigate through previous commands
- **Clickable Items**: Items shown by `ls` are clickable for quick navigation
- **Case Insensitive**: Commands and file names work regardless of case
- **Quoted Arguments**: Use quotes for file names with spaces: `cat "my file.txt"`

## 🎨 Customization

### Adding New Commands
Add new commands in [`js/commands.js`](js/commands.js):

```javascript
const commands = {
    // ...existing commands...
    
    mycommand: (args) => {
        appendOutput(`<div>Hello from my custom command!</div>`);
    }
};
```

### Adding Files/Directories
Modify the file system structure in [`js/filesystem.js`](js/filesystem.js):

```javascript
const fileSystem = {
    'MyFolder': {
        type: 'directory',
        content: {
            'myfile.txt': { 
                type: 'file', 
                content: 'File contents here' 
            }
        }
    }
};
```

### Styling
Customize the terminal appearance in [`styles.css`](styles.css). The project uses:
- CSS custom properties for theming
- Tailwind CSS classes for layout
- Consolas font for that authentic terminal feel

## 🌐 Live Demo

Visit the live website: [itsfred.dev](https://itsfred.dev)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Add new commands or easter eggs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by classic terminal interfaces
- Built with vanilla JavaScript for maximum compatibility
- Styled with a Tokyo Night-inspired color scheme
- Uses Fira Code font for optimal code readability
- Used AI to speed up workflow
---

**Pro tip**: Try typing `cat Top-Secret/!@&%*@(%).txt` for some hidden commands! 🤫
