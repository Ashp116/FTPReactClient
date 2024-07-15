// src/app/page.tsx
import React from 'react';
import FileExplorer from '../components/FileExplorer';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Local File Explorer</h1>
      <FileExplorer initialPath="/" />
    </div>
  );
};

export default Home;
