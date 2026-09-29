import os
import json
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

app = Flask(__name__)

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")

client = genai.Client(api_key=API_KEY) if API_KEY else None


def build_prompt(data):
    topic = data.get("topic", "").strip()
    genre = data.get("genre", "Adventure")
    tone = data.get("tone", "Fun")
    audience = data.get("audience", "General")
    characters = data.get("characters", "").strip()
    panels = int(data.get("panels", 6))

    return f"""
You are ComicCraft, an AI comic story creator.

Create an original comic story using these requirements:

Main idea:
{topic}

Genre:
{genre}

Tone:
{tone}

Target audience:
{audience}

Number of panels:
{panels}

Character ideas:
{characters or "Create suitable original characters."}

Return ONLY valid JSON.

Use exactly this structure:

{{
    "title": "comic title",
    "logline": "one sentence summary",

    "characters": [
        {{
            "name": "character name",
            "role": "role in story",
            "description": "short visual and personality description"
        }}
    ],

    "panels": [
        {{
            "panel": 1,
            "scene": "what is visually happening",
            "narration": "short narration",
            "dialogue": [
                {{
                    "character": "speaker",
                    "text": "dialogue"
                }}
            ],
            "image_prompt": "detailed prompt for generating this comic panel"
        }}
    ]
}}

Rules:

1. Create an original story.
2. Keep the story coherent from beginning to end.
3. Make the dialogue short and suitable for comic speech bubbles.
4. Make every panel visually different.
5. Do not use copyrighted characters.
6. Create original characters.
7. Match the selected genre and tone.
8. Return exactly {panels} panels.
"""


def generate_comic(data):

    if not API_KEY or not client:
        raise RuntimeError(
            "GEMINI_API_KEY is not configured. "
            "Please create a .env file and add your Gemini API key."
        )

    response = client.models.generate_content(
        model=MODEL,
        contents=build_prompt(data),
        config=types.GenerateContentConfig(
            temperature=0.9,
            response_mime_type="application/json"
        )
    )

    raw = response.text.strip()

    # Remove Markdown code fences if Gemini adds them
    if raw.startswith("```"):
        raw = raw.replace("```json", "", 1)
        raw = raw.replace("```", "", 1)
        raw = raw.strip()

    return json.loads(raw)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/generate", methods=["POST"])
def generate():

    try:

        data = request.get_json(force=True)

        if not data.get("topic", "").strip():
            return jsonify({
                "error": "Please enter a story idea."
            }), 400

        panels = int(data.get("panels", 6))

        if panels < 3 or panels > 10:
            return jsonify({
                "error": "Panels must be between 3 and 10."
            }), 400

        comic = generate_comic(data)

        return jsonify(comic)

    except json.JSONDecodeError:

        return jsonify({
            "error": "Gemini returned invalid JSON. Please try again."
        }), 502

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500


if __name__ == "__main__":

    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )
