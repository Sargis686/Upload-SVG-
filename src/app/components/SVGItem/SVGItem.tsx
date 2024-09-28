import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faTrash, faPalette } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
import s from './style.module.css';

interface SvgFile {
  name: string;
  file: JSX.Element | string;
  color: string;
  isDefault?: boolean;
}

interface SVGItemProps {
  file: SvgFile;
  index: number;
  handleEditFileName: (file: SvgFile, newName: string) => void;
  handleDeleteFile: (file: SvgFile) => void;
  handleColorChange: (color: any, file: SvgFile) => void;
  handleFileReplace: (fileContent: string, file: SvgFile) => void;
}

const SVGItem: React.FC<SVGItemProps> = ({
  file,
  index,
  handleEditFileName,
  handleDeleteFile,
  handleColorChange,
  handleFileReplace
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const toggleColorPickerModal = () => {
    setIsPickerOpen(!isPickerOpen);
  };

  const closeColorPicker = () => {
    setIsPickerOpen(false);
  };

  // Drag-and-drop event handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles[0] && droppedFiles[0].type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          handleFileReplace(reader.result as string, file);
        }
      };
      reader.readAsText(droppedFiles[0]);
    } else {
      alert('Please drop a valid SVG file.');
    }
  };

  return (
    
    <div
      className={`${s.svgItem} ${isDragging ? s.dragging : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
    >
      <input
        type="text"
        value={file.name}
        onChange={(e) => handleEditFileName(file, e.target.value)}
        className={s.fileNameInput}
      />

      <div className={s.svgDisplay} style={{ borderColor: file.color }}>
        {typeof file.file === 'string' ? (
          <div dangerouslySetInnerHTML={{ __html: file.file }} />
        ) : (
          file.file
        )}
      </div>

      <div className={s.iconContainer}>
        {/* Color Picker Icon */}
        <button className={s.iconButton} onClick={toggleColorPickerModal}>
          <FontAwesomeIcon icon={faPalette} />
        </button>

        {/* Delete Icon */}
        <button className={s.iconButton} onClick={() => handleDeleteFile(file)}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>

      {/* Color Picker Modal */}
      {isPickerOpen && (
        <div className={s.modal}>
          <div className={s.modalContent}>
            <h3>Choose a Color</h3>
            <SketchPicker
              color={file.color}
              onChangeComplete={(color) => handleColorChange(color, file)}
            />
            <button className={s.closeButton} onClick={closeColorPicker}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SVGItem;
