import React, { useState, useEffect } from 'react';
import s from './style.module.css'; // Assuming you have a CSS module for styles
import { First, Second } from '../../swgs'; // Navigate two levels up from components/UploadSVG to svgs/
import SVGList from '../SVGList/SVGList'; // Import the SVGList component
import SVGUploadModal from '../SVGUploadModal/SVGUploadModal'; // Import the modal component

interface SvgFile {
  name: string;
  file: JSX.Element | string;
  color: string;
  isDefault?: boolean;
}

const UploadSVG: React.FC = () => {
  const [svgFiles, setSvgFiles] = useState<SvgFile[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Ensure client-side only code runs after hydration
  useEffect(() => {
    setIsHydrated(true);
    if (typeof window !== 'undefined') {
      const savedSvgFiles = localStorage.getItem('svgFiles');
      if (savedSvgFiles) {
        const parsedFiles: SvgFile[] = JSON.parse(savedSvgFiles);
        const filesWithJSX = parsedFiles.map((file) => {
          if (file.isDefault) {
            if (file.name === 'Default 1') return { ...file, file: <First color={file.color} /> };
            if (file.name === 'Default 2') return { ...file, file: <Second color={file.color} /> };
          }
          return file;
        });
        setSvgFiles(filesWithJSX);
      } else {
        setSvgFiles([
          { name: 'Default 1', file: <First color="#000000" />, color: '#000000', isDefault: true },
          { name: 'Default 2', file: <Second color="#000000" />, color: '#000000', isDefault: true },
        ]);
      }
    }
  }, []);

  // Save svgFiles to localStorage whenever svgFiles state changes
  useEffect(() => {
    if (isHydrated) {
      const serializableFiles = svgFiles.map((file) => {
        if (file.isDefault) {
          return { name: file.name, color: file.color, isDefault: true };
        } else {
          return { name: file.name, file: file.file, color: file.color };
        }
      });
      localStorage.setItem('svgFiles', JSON.stringify(serializableFiles));
    }
  }, [svgFiles, isHydrated]);

  const handleUpload = (newFile: SvgFile) => {
    setSvgFiles((prevFiles) => [...prevFiles, newFile]);
  };

  if (!isHydrated) {
    return null; // Avoid mismatch during SSR hydration
  }

  return (
    <div className={s.container}>


      <SVGList svgFiles={svgFiles} setSvgFiles={setSvgFiles} />

      {showModal && (
        <SVGUploadModal
          closeModal={() => setShowModal(false)}
          svgFiles={svgFiles}
          setSvgFiles={setSvgFiles}
        />
      )}
      <div className={s.center}>
        <button onClick={() => setShowModal(true)} className={s.uploadButton}>
          Upload SVG Files
        </button>
      </div>
    </div>
  );
};

export default UploadSVG;
