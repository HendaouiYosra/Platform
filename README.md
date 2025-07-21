# Mapping Platform Frontend
## Description

This is the frontend of our Mapping Platform where users can perform various types of course mappings. The platform includes three main modules:

1. **Chatbot (RAG-based)**  
   A chatbot powered by Retrieval-Augmented Generation (RAG) that can answer questions about courses based on uploaded documents.

2. **Course-to-Course Mapping**  
   Given two courses, this module performs a detailed mapping between them. Courses can be selected from previously uploaded data or uploaded as new PDF files.

3. **Course-to-Program Mapping**  
   This module maps a course (PDF) to a program's outcomes (uploaded as a structured PDF). It identifies which skills or learning outcomes are covered by the course.

## Setup
Before you start, create a `.env.local` file at the root of the project with the following environment variable: 
NEXT_PUBLIC_API_URL=your_backend_api_url
Replace `your_backend_api_url` with the actual URL of the backend API.

1. Clone the repository. 
2. Run `npm install` to install dependencies.
3. Start the development server:
