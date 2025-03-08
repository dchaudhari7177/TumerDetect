import React, { useState } from 'react';
import axios from 'axios';

const TextPrediction = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  // Directly store the Gemini API key here
  const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY'; // Replace with your actual Gemini API key

  // Function to handle the API call
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, // Use the correct Gemini endpoint here
        {
          model: "gemini-2.0-flash", // Specify the model you're using
          inputs: { text: text }, // Your input data
        },
        {
          headers: {
            Authorization: `Bearer ${GEMINI_API_KEY}`, // Send the API key in the Authorization header
          },
        }
      );

      // Assuming the response contains the prediction in 'data'
      setResult(response.data.output);
    } catch (error) {
      console.error("Error fetching data from Gemini API", error);
      setResult("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Text Prediction</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to summarize"
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Loading...' : 'Submit'}
      </button>
      <div>
        <h2>Result:</h2>
        <p>{result}</p>
      </div>
    </div>
  );
};

export default TextPrediction;
