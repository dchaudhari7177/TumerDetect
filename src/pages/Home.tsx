import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Upload, FileText, ArrowRight } from 'lucide-react';

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Advanced Tumor Detection</span>
          <span className="block text-indigo-600">Powered by AI</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Cutting-edge machine learning models for accurate tumor detection and classification.
          Choose between text-based prediction using clinical data or MRI image analysis.
        </p>
      </div>

      <div className="mt-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="relative group">
            <Link
              to="/text-prediction"
              className="relative block w-full rounded-lg border-2 border-gray-300 p-8 hover:border-indigo-600 transition-colors"
            >
              <div className="flex items-center justify-center">
                <FileText className="h-12 w-12 text-indigo-600" />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">Text-based Prediction</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Input demographic information and gene mutation statuses for tumor classification
                </p>
              </div>
              <span className="absolute bottom-4 right-4 text-indigo-600 group-hover:translate-x-1 transition-transform">
                <ArrowRight className="h-5 w-5" />
              </span>
            </Link>
          </div>

          <div className="relative group">
            <Link
              to="/image-analysis"
              className="relative block w-full rounded-lg border-2 border-gray-300 p-8 hover:border-indigo-600 transition-colors"
            >
              <div className="flex items-center justify-center">
                <Upload className="h-12 w-12 text-indigo-600" />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">MRI Image Analysis</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Upload MRI scans for automated tumor detection and classification
                </p>
              </div>
              <span className="absolute bottom-4 right-4 text-indigo-600 group-hover:translate-x-1 transition-transform">
                <ArrowRight className="h-5 w-5" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-16 bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="relative h-64">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2000&q=80"
            alt="Medical Research"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-indigo-600/40 flex items-center">
            <div className="px-8">
              <h2 className="text-2xl font-bold text-white">Why Choose Our Platform?</h2>
              <p className="mt-2 text-white/90">
                Our AI models are trained on extensive medical datasets and validated by healthcare professionals.
                Get accurate predictions to support clinical decision-making.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;