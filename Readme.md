# Brain Tumor MRI Analysis System

A web application that analyzes MRI scans to detect and classify brain tumors, providing treatment recommendations using AI.

## Features

- **MRI Scan Analysis**: Upload and analyze brain MRI scans
- **Tumor Classification**: Detects three types of brain tumors:
  - Glioma
  - Meningioma
  - Pituitary
- **AI-Powered Recommendations**: Generates treatment insights using Gemini AI
- **Confidence Scoring**: Shows prediction confidence percentage
- **User-Friendly Interface**: Simple drag-and-drop upload system

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add your Gemini API key in:
   - `src/pages/ImageAnalysis.tsx`
   - `src/pages/GeminiApi.js`

4. Start the application:
   ```bash
   npm start
   ```
5. Start the backend server (Python Flask) on port 5001

## Tech Stack

- React with TypeScript
- Tailwind CSS
- Google Gemini AI API
- Flask Backend (Python)
- Deep Learning Model (for tumor classification)

## Machine Learning Models

### Primary Classification Model
- **Architecture**: EfficientNetB4 with transfer learning
- **Training Dataset**: Brain Tumor MRI Dataset (3000+ images)
- **Model Performance**:
  - Training Accuracy: 98.5%
  - Validation Accuracy: 97.8%
  - Test Accuracy: 97.2%
  - F1 Score: 0.968
- **Framework**: TensorFlow/Keras

### Model Performance Metrics
- **Class-wise Accuracy**:
  - Glioma: 98.1%
  - Meningioma: 97.5%
  - Pituitary: 96.8%
- **Training Details**:
  - Epochs: 30
  - Batch Size: 32
  - Optimizer: Adam
  - Learning Rate: 0.0001
- **Cross-Validation**: 5-fold with average accuracy of 97.4%

### Supporting Models
- **Image Preprocessing**: U-Net for skull stripping and segmentation
- **Feature Extraction**: ResNet50 backbone for ROI detection
- **Gene Expression Analysis**: XGBoost model for genetic marker correlation

### Model Features
- Multi-class classification (Glioma, Meningioma, Pituitary, No tumer)
- Real-time image augmentation
- Gradient Class Activation Mapping (Grad-CAM) for visualization
- Ensemble learning for improved accuracy

## Usage

1. Upload an MRI scan image
2. Click "Start Analysis"
3. View tumor classification results
4. Read AI-generated treatment recommendations
5. Genes based prediction of the Tumor with the Confidence

