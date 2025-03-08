import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Brain, Upload, FileText, Info, Phone } from 'lucide-react';
import Home from './pages/Home';
import TextPrediction from './pages/TextPrediction';
import ImageAnalysis from './pages/ImageAnalysis';
import TumorInfo from './pages/TumorInfo';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex items-center">
                  <Brain className="h-8 w-8 text-indigo-600" />
                  <span className="ml-2 font-semibold text-xl text-gray-800">TumorDetect</span>
                </Link>
              </div>
              <div className="flex space-x-8">
                <Link to="/text-prediction" className="flex items-center px-3 py-2 text-gray-700 hover:text-indigo-600">
                  <FileText className="h-5 w-5 mr-1" />
                  <span>Text Prediction</span>
                </Link>
                <Link to="/image-analysis" className="flex items-center px-3 py-2 text-gray-700 hover:text-indigo-600">
                  <Upload className="h-5 w-5 mr-1" />
                  <span>MRI Analysis</span>
                </Link>
                <Link to="/tumor-info" className="flex items-center px-3 py-2 text-gray-700 hover:text-indigo-600">
                  <Info className="h-5 w-5 mr-1" />
                  <span>Tumor Info</span>
                </Link>
                <Link to="/contact" className="flex items-center px-3 py-2 text-gray-700 hover:text-indigo-600">
                  <Phone className="h-5 w-5 mr-1" />
                  <span>Contact</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/text-prediction" element={<TextPrediction />} />
            <Route path="/image-analysis" element={<ImageAnalysis />} />
            <Route path="/tumor-info" element={<TumorInfo />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;