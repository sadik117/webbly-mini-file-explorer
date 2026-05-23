# 📁 Wembbly Mini File Explorer

A modern, highly responsive, and feature-rich mini file explorer built with **Next.js**, **Tailwind CSS**, and **Zustand**. It provides a sleek interface to create, manage, and edit your files and folders seamlessly within your browser.

## Live Demo
https://wembbly-mini-file-explorer.vercel.app

## Features

- **Intuitive File Management**: Create, rename, and delete both files and folders with ease.
- **Nested Folder Structure**: A fully functional recursive sidebar that elegantly displays deeply nested directories.
- **Built-in Text Editor**: Edit your text files directly in the browser. Supports keyboard shortcuts (e.g., `Ctrl + S` to save).
- **Seamless Dark & Light Mode**: Premium dark mode support implemented using `next-themes` and Tailwind v4, ensuring no hydration mismatch.
- **📱 Fully Responsive**: 
  - **Desktop**: A comfortable, side-by-side view of your explorer and editor.
  - **Mobile**: The sidebar transforms into an off-canvas drawer with a blurred backdrop, and the editor takes full screen for distraction-free typing.
- **State Persistence**: Your files, folders, and edits are saved locally using Zustand's persist middleware.
- **Premium Aesthetics**: Features glassmorphism effects (`backdrop-blur`), subtle shadows, smooth micro-animations, and carefully crafted UI elements for a state-of-the-art feel.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (with persist middleware)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed. This project uses [Bun](https://bun.sh/) as the package manager, but you can also use `npm`, `yarn`, or `pnpm`.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sadik117/webbly-mini-file-explorer.git
   ```

2. Navigate into the project directory:
   ```bash
   cd webbly-mini-file-explorer
   ```

3. Install the dependencies:
   ```bash
   bun install
   # or npm install / yarn install
   ```

4. Start the development server:
   ```bash
   bun run dev
   # or npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000` to see the app in action!

## ⌨️ Keyboard Shortcuts

- `Ctrl + S` / `Cmd + S` : Save the currently open file in the text editor.
- `Escape` : Close active modals (Rename, Create New).
