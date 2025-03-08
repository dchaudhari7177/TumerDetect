import React, { useState } from 'react';
import axios from 'axios';

interface PredictionResult {
  tumorType: string;
  probability: number;
  predictions: { [key: string]: number }; // New field to hold all predictions
}

function TextPrediction() {
  const [demographics, setDemographics] = useState({
    gender: '',
    age: '',
    race: ''
  });

  const [geneMutations, setGeneMutations] = useState({
    IDH1: '0',
    TP53: '0',
    ATRX: '0',
    PTEN: '0',
    EGFR: '0',
    CIC: '0',
    MUC16: '0',
    PIK3CA: '0',
    NF1: '0',
    PIK3R1: '0',
    FUBP1: '0',
    RB1: '0',
    NOTCH1: '0',
    BCOR: '0',
    CSMD3: '0',
    SMARCA4: '0',
    GRIN2A: '0',
    IDH2: '0',
    FAT4: '0',
    PDGFRA: '0'
  });

  const [results, setResults] = useState<PredictionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDemographicsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDemographics(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleGeneMutationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGeneMutations(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/predict_text', {
        demographics: [
          demographics.gender,
          demographics.age,
          demographics.race
        ],
        geneMutations: Object.values(geneMutations)
      });

      setResults([{
        tumorType: response.data.tumorType,
        probability: response.data.probability,
        predictions: response.data.predictions // New: save full predictions
      }]);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Prediction failed: ${err.response?.data?.error || err.message}`);
      } else {
        setError('An unexpected error occurred while making the prediction. Please try again.');
      }
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setDemographics({ gender: '', age: '', race: '' });
    setGeneMutations(Object.fromEntries(
      Object.keys(geneMutations).map(key => [key, '0'])
    ));
    setResults([]);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tumor Prediction (Text Input)</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Demographic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={demographics.gender}
                onChange={handleDemographicsChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={demographics.age}
                onChange={handleDemographicsChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
                min="0"
                max="120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Race
              </label>
              <select
                name="race"
                value={demographics.race}
                onChange={handleDemographicsChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select Race</option>
                <option value="W">White</option>
                <option value="B">Black</option>
                <option value="A">Asian</option>
                <option value="O">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Gene Mutation Status</h2>
          <p className="text-sm text-gray-600 mb-4">
            Enter 1 for MUTATED and 0 for NOT_MUTATED
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(geneMutations).map(([gene, value]) => (
              <div key={gene}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {gene}
                </label>
                <input
                  type="number"
                  name={gene}
                  value={value}
                  onChange={handleGeneMutationChange}
                  min="0"
                  max="1"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Submit'}
          </button>
        </div>
      </form>

      {results.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Prediction Results</h2>
          {results.map((result, index) => (
            <div key={index} className="mb-6">
              <div className="mb-2">
                <span className="font-medium text-gray-900">{result.tumorType}</span> ({result.probability.toFixed(2)}%)
              </div>
              <div className="space-y-4">
                {Object.entries(result.predictions).map(([cls, prob]) => (
                  <div key={cls}>
                    <div className="flex justify-between text-xs text-gray-700">
                      <span>{cls}</span>
                      <span>{prob.toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${prob}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TextPrediction;
