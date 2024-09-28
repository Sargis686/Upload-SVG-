import React from 'react';
import s from './style.module.css'; 
import SVGItem from '../SVGItem/SVGItem'; // Import the SVGItem component

interface SvgFile {
  name: string;
  file: JSX.Element | string;
  color: string;
  isDefault?: boolean;
}

interface SVGListProps {
  svgFiles: SvgFile[];
  setSvgFiles: React.Dispatch<React.SetStateAction<SvgFile[]>>;
}

const SVGList: React.FC<SVGListProps> = ({ svgFiles, setSvgFiles }) => {

  const handleEditFileName = (file: SvgFile, newName: string) => {
    const updatedFiles = svgFiles.map((f) => (f === file ? { ...f, name: newName } : f));
    setSvgFiles(updatedFiles);
  };

  const handleDeleteFile = (file: SvgFile) => {
    setSvgFiles(svgFiles.filter((f) => f !== file));
  };

  const handleColorChange = (color: any, file: SvgFile) => {
    const updatedFiles = svgFiles.map((f) => {
      if (f === file) {
        if (typeof f.file === 'string') {
          const updatedFileString = f.file.replace(/(fill|stroke)=['"]?#[^'"]*['"]?/g, `$1="${color.hex}"`);
          return { ...f, color: color.hex, file: updatedFileString };
        } else {
          return { ...f, color: color.hex, file: React.cloneElement(f.file, { color: color.hex }) };
        }
      }
      return f;
    });
    setSvgFiles(updatedFiles);
  };

  // Function to replace SVG content when a new file is dropped
  const handleFileReplace = (fileContent: string, file: SvgFile) => {
    const updatedFiles = svgFiles.map((f) => (f === file ? { ...f, file: fileContent } : f));
    setSvgFiles(updatedFiles);
  };

  return (
    <div className={s.svgList}>
      {svgFiles.map((file, index) => (
        <SVGItem
          key={index}
          file={file}
          index={index}
          handleEditFileName={handleEditFileName}
          handleDeleteFile={handleDeleteFile}
          handleColorChange={handleColorChange}
          handleFileReplace={handleFileReplace}  
        />
      ))}
    </div>
  );
};

export default SVGList;
