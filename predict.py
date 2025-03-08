from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
import tensorflow as tf  # Use TensorFlow for loading .h5 model
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)

# Load the Keras .h5 model (ensure you have the correct path to your .h5 file)
MODEL_PATH = "model_v11.h5"
model = tf.keras.models.load_model(MODEL_PATH)

# Verify class indices with your model training setup
CLASS_NAMES = ['Glioma', 'Meningioma', 'No Tumor', 'Pituitary']  # Update according to your model

@app.route('/api/predict/01', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    try:
        # Process image with proper preprocessing
        file = request.files['image']
        
        # Convert and preprocess image
        image = Image.open(file.stream).convert('RGB')
        image = image.resize((150, 150))  # Match model's expected input shape
        
        # Convert to array and normalize image
        img_array = np.array(image, dtype=np.float32) / 255.0
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
        
        # Verify input shape matches model expectations
        if img_array.shape != (1, 150, 150, 3):
            raise ValueError(f"Invalid input shape: {img_array.shape}")

        # Make prediction using the loaded model
        predictions = model.predict(img_array)  # Predict using the loaded model
        predicted_index = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_index]) * 100

        # Get class name from predefined list
        tumor_type = CLASS_NAMES[predicted_index]

        return jsonify({
            'tumorType': tumor_type,
            'probability': round(confidence, 2)
        })

    except Exception as e:
        logging.error(f"Prediction error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
