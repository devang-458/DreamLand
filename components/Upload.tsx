import { CheckCircle2, ImageIcon, UploadIcon } from 'lucide-react';
import React, { useState } from 'react'
import { useOutletContext } from 'react-router';
import { PROGRESS_INCREMENT, REDIRECT_DELAY_MS } from '../lib/constants';

interface UploadProps {
    onComplete: (base64Data: string) => void;
}

const Upload = ({ onComplete }: UploadProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState(0);

    const { isSignedIn } = useOutletContext<AuthContext>();

    const processFile = (fileToProcess: File) => {
        if (!isSignedIn) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Data = e.target?.result as string;
            let currentProgress = 0;

            const interval = setInterval(() => {
                currentProgress += PROGRESS_INCREMENT;
                if (currentProgress >= 100) {
                    currentProgress = 100;
                    setProgress(100);
                    clearInterval(interval);
                    setTimeout(() => {
                        onComplete(base64Data);
                    }, REDIRECT_DELAY_MS);
                } else {
                    setProgress(currentProgress);
                }
            }, 100);
        };
        reader.readAsDataURL(fileToProcess);
    };

    const handleFileSelect = (selectedFile: File) => {
        if (!isSignedIn) return;
        setFile(selectedFile);
        processFile(selectedFile);
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isSignedIn) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (!isSignedIn) return;

        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles && droppedFiles.length > 0) {
            const validFile = droppedFiles[0];
            if (validFile.type.match('image/(jpeg|png)')) {
                handleFileSelect(validFile);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isSignedIn) return;

        const selectedFiles = e.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            handleFileSelect(selectedFiles[0]);
        }
    };

    return (
        <div className='upload'>
            {!file ? (
                <div
                    className={`dropzone ${isDragging ? 'is-dragging' : ""}`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <input
                        type='file'
                        className='drop-input'
                        accept='.jpg,.jpeg,.png'
                        disabled={!isSignedIn}
                        onChange={handleChange}
                    />
                    <div className='drop-content'>
                        <div className='drop-icon'><UploadIcon size={20} /></div>
                        <p>{isSignedIn ? ("Click to upload or just drag and drop") : ("Sign in or Sign up with puter to upload ")}</p>
                    </div>
                </div>
            ) : (
                <div className='upload-status'>
                    <div className='status-content'>
                        <div className='status-icon'>
                            {progress === 100 ? (<CheckCircle2 className='check' />) : (<ImageIcon className='image' />)}
                        </div>
                        <h3>{file.name}</h3>
                        <div className='progress'>
                            <div className='bar' style={{ width: `${progress}%` }} />
                            <p className='status-text'>
                                {progress < 100 ? 'Analying Floor plan...' : 'Redirecting...'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Upload
