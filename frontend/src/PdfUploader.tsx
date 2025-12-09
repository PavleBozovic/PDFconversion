import { useState } from 'react';
import type { ChangeEvent, FC } from 'react';
import axios from 'axios';

// Use FC (Functional Component) type for type safety
const PdfUploader: FC = () => {
    // Use explicit types for state
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    // Use ChangeEvent<HTMLInputElement> for type safety
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
        // Ensure files exist before setting the state
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
        setMessage('');
    };

    const handleUpload = async (): Promise<void> => {
        if (!file || file.type !== 'application/pdf') {
            setMessage('Please select a valid PDF file.');
            return;
        }

        setLoading(true);
        setMessage('Uploading and converting...');

        const formData = new FormData();
        // 'file' must match the @RequestParam("file") in your Spring Boot controller
        formData.append('file', file);

        try {
            // NOTE: Using port 8081 for the backend as you configured it locally.
            const response = await axios.post(
                'http://localhost:8081/api/convert/pdf-to-jpeg',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    responseType: 'blob', // IMPORTANT: Instructs axios to treat the response as binary data (the ZIP file)
                }
            );

            // --- Handle the Binary ZIP Download ---
            // 1. Create a Blob object from the binary response data
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            // 2. Create a temporary URL for the blob
            const downloadUrl = window.URL.createObjectURL(blob);
            // 3. Programmatically create and click an anchor tag to trigger download
            const link = document.createElement('a');
            link.href = downloadUrl;
            // 'download' attribute sets the default filename, matching the backend's Content-Disposition header
            link.setAttribute('download', 'converted_images.zip');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl); // Clean up the temporary URL

            setMessage('Conversion successful! Download started.');

        } catch (error) {
            console.error('Upload failed:', error);
            setMessage('Conversion failed. Check the server console and backend logs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>PDF to JPEG Converter</h2>
            <p>Backend API: <code style={{backgroundColor: '#eee', padding: '3px'}}>http://localhost:8081/api/convert/pdf-to-jpeg</code></p>
            <input type="file" accept="application/pdf" onChange={handleFileChange} disabled={loading} />
            <button
                onClick={handleUpload}
                disabled={loading || !file}
                style={{ marginLeft: '10px' }}>
                {loading ? 'Converting...' : 'Convert and Download ZIP'}
            </button>
            <p style={{ marginTop: '15px' }}>
                {message ? <strong>Status:</strong> : null} {message}
            </p>
            {loading && <p>Please wait, conversion of multi-page PDFs can take a moment...</p>}
        </div>
    );
};

export default PdfUploader;