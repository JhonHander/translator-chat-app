import axios from 'axios';
import { GEMINI_API_KEY } from '@env';

// const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Función para traducir usando Gemini
export const translateWithAI = async (text) => {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: text
              }
            ]
          }
        ],
        systemInstruction: {
          parts: [
            {
              text: 'Eres un asistente de traducción experto. Tu tarea es detectar si el usuario quiere una traducción y realizarla con precisión. Si el mensaje contiene una solicitud de traducción, traduce el texto indicado al idioma solicitado. Si no hay un idioma específico mencionado pero se pide una traducción, traduce al inglés. Si el mensaje no parece una solicitud de traducción, responde como un asistente normal explicando que tu especialidad es la traducción.'
            }
          ]
        },
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error('Error calling Gemini:', error);
    throw new Error('Failed to get translation from AI');
  }
};