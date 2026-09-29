# 🎨 ComicCraft - AI Comic Story Creator

ComicCraft is an AI-powered web application that converts a simple story idea into an original structured comic using Google Gemini.

## Features

- AI comic story generation
- Character creation
- Comic title generation
- Story logline
- Multiple comic panels
- Narration
- Character dialogue
- AI image prompts
- Genre selection
- Tone selection
- Audience selection
- 3-10 panel support
- Print / Save as PDF
- Responsive interface

## Technologies

- Python
- Flask
- HTML
- CSS
- JavaScript
- Google Gemini API

## Folder Structure

ComicCraft/

    app.py
    requirements.txt
    .env.example
    .gitignore
    README.md
    LICENSE

    templates/
        index.html

    static/
        style.css
        app.js

## Installation

Clone the repository:

    git clone https://github.com/YOUR_USERNAME/ComicCraft.git

Open the project:

    cd ComicCraft

Create virtual environment:

Windows:

    python -m venv venv

    venv\Scripts\activate

Install packages:

    pip install -r requirements.txt

## Gemini API

Create a Gemini API key and place it inside `.env`.

Example:

    GEMINI_API_KEY=YOUR_API_KEY
    GEMINI_MODEL=gemini-3.8-flash

Do not upload `.env` to GitHub.

## Run

Start the Flask server:

    python app.py

Open:

    http://127.0.0.1:5000

## Application Flow

User enters story idea.

        ↓

ComicCraft frontend

        ↓

Flask backend

        ↓

Gemini API

        ↓

Gemini generates JSON

        ↓

Characters + panels + dialogue

        ↓

Comic displayed in browser

## Future Improvements

- AI-generated comic images
- PDF comic export
- User accounts
- Saved comics
- Character image references
- Multiple languages
- Drag-and-drop comic editor
- Voice narration
- Cloud database
