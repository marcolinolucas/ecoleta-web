import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface Props {
  onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }: Props) => {
  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    const imageUrl = URL.createObjectURL(file);
    setSelectedImageUrl(imageUrl);

    onFileUploaded(file);
	}, [onFileUploaded]);
	
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      {
				selectedImageUrl
				  ? <img src={selectedImageUrl} alt="Thumbnail do Ponto" />
				  : (
						<p>
							<FiUpload />
							Image do estabelecimento
						</p>
				  )
			}
    </div>
  );
};

export default Dropzone;
