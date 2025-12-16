## 1. Overview

This is a robust full-stack application designed to convert multi-page PDF files into a downloadable ZIP archive containing a high-quality JPEG image for every page. The architecture is containerized using Docker Compose for simple deployment.

## 2. Technologies

| Component | Primary Technologies | Key Dependencies |
| :--- | :--- | :--- |
| **Backend** | Spring Boot (Java 21) | PDFBox (for conversion), Maven |
| **Frontend** | React (TypeScript) | Axios, Vite |
| **Deployment** | Docker & Docker Compose | Nginx (for serving frontend) |

## 3. Architecture and Data Flow

The application runs two primary services connected via a private Docker network (`pdfapp_net`).

1.  The **Frontend** (React/Nginx) is exposed on `localhost:3000`.
2.  The **Backend** (Spring Boot) is exposed on `localhost:8080`.

The React application makes an API request to the backend container using the internal service name `http://backend:8080`. This setup ensures smooth, container-to-container communication.



## 4. Getting Started

### Prerequisites

* Docker and Docker Compose installed.
* (Optional: Java 21+ and Node 20+ if running services locally)

### Running the Application

Navigate to the project root directory and execute the following single command to build the images and start both containers:
