# React + Vite + Tailwind CSS Frontend

A modern frontend setup using React 18, Vite, and Tailwind CSS 3.

## 🚀 Features

- ⚡️ **Vite** - Lightning fast build tool
- ⚛️ **React 18** - Latest React with concurrent features
- 🎨 **Tailwind CSS 3** - Utility-first CSS framework
- 🔥 **Hot Module Replacement** - Instant feedback during development
- 📦 **ESLint** - Code linting and formatting
- 🏗️ **Modern ES Modules** - Native ESM support

## 📋 Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- npm (comes with Node.js) or [yarn](https://yarnpkg.com/)

## 🛠️ Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

## 🏃‍♂️ Development

Start the development server:

```bash
npm run dev
```
or
```bash
yarn dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Build

Create a production build:

```bash
npm run build
```
or
```bash
yarn build
```

## 👀 Preview

Preview the production build locally:

```bash
npm run preview
```
or
```bash
yarn preview
```

## 🧹 Linting

Run ESLint to check for code issues:

```bash
npm run lint
```
or
```bash
yarn lint
```

## 📁 Project Structure

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── App.jsx          # Main App component
│   ├── index.css        # Tailwind CSS imports
│   └── main.jsx         # Application entry point
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.js       # Vite configuration
```

## 🎨 Tailwind CSS

This project is configured with Tailwind CSS 3. You can:

- Use utility classes directly in your JSX
- Customize the theme in `tailwind.config.js`
- Add custom CSS in `src/index.css`

Example usage:
```jsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Hello Tailwind!
</div>
```

## 🔧 Configuration

- **Vite Config**: `vite.config.js`
- **Tailwind Config**: `tailwind.config.js`
- **PostCSS Config**: `postcss.config.js`
- **ESLint Config**: `.eslintrc.cjs`

## 📚 Learn More

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
