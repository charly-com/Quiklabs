import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: import('ethers').Eip1193Provider; // Use Eip1193Provider for MetaMask
    api: {
      selectFolder: () => Promise<string | null>;
      saveFile: (filename: string, content: string) => Promise<void>;
      listFiles: () => Promise<string[]>;
      readFile: (filename: string) => Promise<string>;
    };
  }
}

export default function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [folder, setFolder] = useState<string | null>(null);
  const [filename, setFilename] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFileContent, setSelectedFileContent] = useState('');

  async function signInWithEthereum() {
    if (!window.ethereum) {
      alert('MetaMask not detected');
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    // EIP-4361 message
    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Sign in to Web3 File App',
      uri: window.location.origin,
      version: '1',
      chainId: Number((await provider.getNetwork()).chainId), // Use provider.getNetwork()
      nonce: Math.random().toString(36).slice(2),
    });

    try {
      await signer.signMessage(message.prepareMessage()); // Signature not needed for display
      setWalletAddress(address);
    } catch (error) {
      console.error('Sign-in failed:', error);
      alert('Sign-in failed');
    }
  }

  async function selectFolder() {
    const folderPath = await window.api.selectFolder();
    if (folderPath) setFolder(folderPath);
  }

  async function saveFile() {
    if (!folder || !filename) return alert('Select a folder and enter a filename');
    await window.api.saveFile(filename, content);
    alert('File saved');
    setFilename('');
    setContent('');
    loadFiles();
  }

  // Use useCallback to memoize loadFiles
  const loadFiles = useCallback(async () => {
    if (!folder) return;
    const fileList = await window.api.listFiles();
    setFiles(fileList);
  }, [folder]); // Add folder as dependency

  async function openFile(file: string) {
    const fileContent = await window.api.readFile(file);
    setSelectedFileContent(fileContent);
  }

  // Include loadFiles in useEffect dependency array
  useEffect(() => {
    if (folder) loadFiles();
  }, [folder, loadFiles]);

  return (
    <div style={{ padding: '20px' }}>
      {!walletAddress ? (
        <button onClick={signInWithEthereum}>Sign in with MetaMask</button>
      ) : (
        <>
          <p>Connected: {walletAddress}</p>
          <button onClick={selectFolder}>Select Folder</button>
          {folder && <p>Selected Folder: {folder}</p>}
          <div>
            <h3>Save File</h3>
            <input
              type="text"
              placeholder="Filename (no .txt)"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
            <textarea
              placeholder="File content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button onClick={saveFile}>Save</button>
          </div>
          <div>
            <h3>Open File</h3>
            <ul>
              {files.map((file) => (
                <li key={file}>
                  <button onClick={() => openFile(file)}>{file}</button>
                </li>
              ))}
            </ul>
            {selectedFileContent && <pre>Content: {selectedFileContent}</pre>}
          </div>
        </>
      )}
    </div>
  );
}