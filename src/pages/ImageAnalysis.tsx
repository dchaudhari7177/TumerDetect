import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import axios from 'axios';

interface AnalysisResult {
  tumorType: string;
  probability: number;
}

function ImageAnalysis() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [predictionText, setPredictionText] = useState<string>(''); // For Gemini prediction
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      setResult(null);
      setPredictionText('');
    }
  };

  // Function to handle file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      setResult(null);
      setPredictionText('');
    } else {
      alert('Please drop an image file');
    }
  };

  // Function to handle drag over event
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Function to call the backend and analyze the image
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      // Step 1: Call the backend API for image analysis (tumor prediction)
      const { data } = await axios.post<AnalysisResult>(
        'http://localhost:5000/api/predict/01',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // Step 2: Set the result of the tumor prediction
      setResult({
        tumorType: data.tumorType,
        probability: Math.min(Math.max(data.probability, 0), 100), // Clamp between 0-100
      });

      // Step 3: Based on the tumorType, generate content using Gemini API
      await generateContent(data.tumorType);
    } catch (error) {
      console.error('Analysis error:', error);
      if (axios.isAxiosError(error)) {
        alert(`Analysis failed: ${error.response?.data?.message || error.message}`);
      } else {
        alert('Analysis failed. Please try again.');
      }
    }

    setIsLoading(false);
  };

  // Function to generate content based on the tumor type using the Gemini API
  const generateContent = async (tumorType: string) => {
    const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY'; // Replace with your actual API key
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          prompt: `Explain the treatment options for a tumor of type ${tumorType}. Provide advice and insights for patients.`,
          temperature: 0.7,
          max_tokens: 200,
        }
      );

      setPredictionText(response.data.output); // Update the text prediction result
    } catch (error) {
      console.error('Error generating content from Gemini API', error);
      setPredictionText('Error generating content.');
    }
  };

  // Function to reset the form
  const resetForm = () => {
    setSelectedFile(null);
    setPreview('');
    setResult(null);
    setPredictionText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">MRI Tumor Analysis</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />

            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Scan"
                  className="max-h-96 mx-auto rounded-lg"
                />
                <button
                  type="button"
                  onClick={resetForm}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Upload MRI Scan
                </button>
                <p className="text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            )}
          </div>

          {selectedFile && (
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
              >
                {isLoading ? 'Analyzing...' : 'Start Analysis'}
              </button>
            </div>
          )}
        </form>

        {result && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            <div className="space-y-4">
              <p className="text-lg font-medium">
                Tumor Type: <span className="text-indigo-600">{result.tumorType}</span>
              </p>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Confidence:</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-indigo-600 rounded-full"
                    style={{ width: `${result.probability}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">
                  {result.probability.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {predictionText && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Treatment Recommendations</h2>
            <p>{predictionText}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageAnalysis;
