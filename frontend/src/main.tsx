// frontend/src/main.tsx (or App.tsx)
import React from 'react'
import ReactDOM from 'react-dom/client'
import PdfUploader from './PdfUploader'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <PdfUploader />
    </React.StrictMode>,
)