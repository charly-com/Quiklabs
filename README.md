# Web3 File App

A minimal cross-platform desktop app built with Electron, Vite, TypeScript, and MetaMask.

## Prerequisites

- Node.js ≥ 18
- pnpm (`npm install -g pnpm`)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/username/web3-file-app.git
   cd web3-file-app

2. 🚀 Install Dependencies

  - pnpm install
3. 👨‍💻 Run in Development Mode
  bash
- pnpm dev

4. 📦 Build Installers
bash

pnpm build
Output:
macOS: dist/web3-file-app-1.0.0.dmg

Windows: dist/web3-file-app-1.0.0.exe

Note: Built on [macOS/Windows]. Other platform not tested.

🧪 Test File Save/Open Flow
Launch the app (pnpm dev or run the installer).

Click "Sign in with MetaMask" and sign the message.

Click "Select Folder" and choose a local folder.

Enter a filename and content, then click "Save".

In the file list, click a .txt file to view its content.