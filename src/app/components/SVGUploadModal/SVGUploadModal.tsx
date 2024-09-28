import React from 'react';
import s from './style.module.css';

interface SvgFile {
  name: string;
  file: JSX.Element | string;
  color: string;
  isDefault?: boolean;
}

interface SVGUploadModalProps {
  closeModal: () => void;
  svgFiles: SvgFile[];
  setSvgFiles: React.Dispatch<React.SetStateAction<SvgFile[]>>;
}

const SVGUploadModal: React.FC<SVGUploadModalProps> = ({ closeModal, svgFiles, setSvgFiles }) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onloadend = () => {
        if (reader.result) {
          const newFile: SvgFile = {
            name: file.name,
            file: reader.result as string,
            color: '#000000',
          };
          setSvgFiles([...svgFiles, newFile]);
        }
      };
    } else {
      alert('Please upload a valid SVG file.');
    }
  };

  return (
    <div className={s.modal}>
      <div className={s.modalContent}>
        <h2>Upload and Manage SVG Files</h2>
        <input
          type="file"
          accept="image/svg+xml"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />
        <button onClick={() => fileInputRef.current?.click()} className={s.selectFileButton}>
          Select SVG File
        </button>

        <button onClick={closeModal} className={s.closeModalButton}>
          Close Modal
        </button>
      </div>
    </div>
  );
};

export default SVGUploadModal;
