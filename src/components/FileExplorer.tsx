'use client'
import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import path from 'path';

interface FileExplorerProps {
  initialPath: string;
}

interface File {
  name: string;
  isDirectory: boolean;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ initialPath }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [fileContent, setFileContent] = useState<string | null>(null);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const response = await fetch(`/api/files?dir=${encodeURIComponent(currentPath)}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: File[] = await response.json();
        setFiles(data);
        setFileContent(null);  // Reset file content when navigating
      } catch (error) {
        console.error('Error reading directory:', error);
      }
    };

    loadFiles();
  }, [currentPath]);

  const handleFileClick = async (file: File) => {
    if (file.isDirectory) {
      const newPath = path.join(currentPath, file.name).replace(/\\/g, '/');
      setCurrentPath(newPath);
    } else {
      try {
        const response = await fetch(`/api/files/content?file=${encodeURIComponent(`${currentPath}/${file.name}`)}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const content = await response.text();
        setFileContent(content);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
  };

  const handleBackClick = () => {
    const parentPath = path.dirname(currentPath).replace(/\\/g, '/');
    if (parentPath !== currentPath) {
      setCurrentPath(parentPath);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#2c2f33', color: 'white', padding: 2, minHeight: '100vh' }}>
      <Box sx={{ paddingBottom: 2, borderBottom: '1px solid #40444b' }}>
        <h2 style={{ margin: 0 }}>Current Path: {currentPath}</h2>
        <Button variant="contained" color="primary" onClick={handleBackClick} disabled={currentPath === '/'} sx={{ marginTop: 1 }}>
          Back
        </Button>
      </Box>
      {fileContent ? (
        <TextField
          multiline
          fullWidth
          variant="outlined"
          value={fileContent}
          InputProps={{
            readOnly: true,
            style: { color: 'white' },
          }}
          sx={{ marginTop: 2, backgroundColor: '#40444b', borderRadius: 1 }}
        />
      ) : (
        <List sx={{ maxHeight: '80vh', overflow: 'auto', backgroundColor: '#2c2f33', color: 'white', marginTop: 2 }}>
          {files.map((file) => (
            <ListItem button key={file.name} onClick={() => handleFileClick(file)} sx={{ padding: 1 }}>
              <IconButton edge="start" sx={{ color: 'white' }}>
                {file.isDirectory ? <FolderIcon /> : <DescriptionIcon />}
              </IconButton>
              <ListItemText primary={file.name} primaryTypographyProps={{ style: { color: 'white' } }} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default FileExplorer;
