// This imports necessary dependencies in modern JavaScript.
import { GoogleGenerativeAI } from "@google/generative-ai"; // Assuming ES6 module format
import mime from "mime-types";

// Replace with your real API key
const apiKey = "AIzaSyBGnEyZJHNa6px_iVrMin_BL3o2iFh2cno"; 

// Instantiate the GoogleGenerativeAI object.
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-thinking-exp-01-21",
});

// Generation configuration setup
const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 65536,
  responseModalities: [],
  responseMimeType: "text/plain",
};

// Main function to generate a response
async function run(prompt) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);
  const candidates = result.response.candidates;

  candidates.forEach((candidate, candidateIndex) => {
    candidate.content.parts.forEach((part, partIndex) => {
      if (part.inlineData) {
        const mimeType = mime.extension(part.inlineData.mimeType);
        const fileContent = atob(part.inlineData.data); // Base64 decoding in client-side JavaScript
        const filename = `output_${candidateIndex}_${partIndex}.${mimeType}`;
        
        // This approach allows for dynamically creating and downloading files.
        const blob = new Blob([fileContent], { type: part.inlineData.mimeType });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
      }
    });
  });

  console.log(result.response.text());
  return result.response.text()
}

// Export the run function for usage
export default run;
