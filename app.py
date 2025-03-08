from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
import pickle
import numpy as np
from PIL import Image
import random
import time

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5177"],
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Set up logging with more details
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Construct the absolute path to your model files
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
TEXT_MODEL_PATH = os.path.join(MODEL_DIR, 'model_v11.h5')
SCALER_PATH = os.path.join(MODEL_DIR, 'scaler.pkl')

# Initialize models as None
text_model = None
scaler = None

# Create models directory if it doesn't exist
os.makedirs(MODEL_DIR, exist_ok=True)

# Placeholder model and scaler for development
if not os.path.exists(TEXT_MODEL_PATH):
    # Create a simple placeholder model
    from sklearn.ensemble import RandomForestClassifier
    text_model = RandomForestClassifier(n_estimators=10)
    text_model.fit(np.random.rand(100, 23), np.random.randint(0, 4, 100))
    with open(TEXT_MODEL_PATH, 'wb') as f:
        pickle.dump(text_model, f)
    logging.info("Created placeholder text model.")

if not os.path.exists(SCALER_PATH):
    # Create a simple placeholder scaler
    from sklearn.preprocessing import StandardScaler
    scaler = StandardScaler()
    scaler.fit(np.random.rand(100, 23))
    with open(SCALER_PATH, 'wb') as f:
        pickle.dump(scaler, f)
    logging.info("Created placeholder scaler.")

# Load the models
try:
    with open(TEXT_MODEL_PATH, 'rb') as f:
        text_model = pickle.load(f)
    logging.info("Text model loaded successfully.")
except Exception as e:
    logging.error(f"Error loading text model: {e}")

try:
    with open(SCALER_PATH, 'rb') as f:
        scaler = pickle.load(f)
    logging.info("Scaler loaded successfully.")
except Exception as e:
    logging.error(f"Error loading scaler: {e}")

def map_demographic_value(value, value_type):
    """Helper function to map demographic values to numbers"""
    mapping = {
        'gender': {'M': 1.0, 'F': 0.0},
        'race': {'W': 1.0, 'B': 2.0, 'A': 3.0, 'O': 4.0}
    }
    if value_type in mapping and value in mapping[value_type]:
        return mapping[value_type][value]
    return float(value)

@app.route('/api/predict_text', methods=['POST', 'OPTIONS'])
def predict_text():
    if request.method == 'OPTIONS':
        return '', 204
        
    if text_model is None or scaler is None:
        logging.error("Models not properly loaded")
        return jsonify({'error': 'Models not properly initialized'}), 500

    if not request.is_json:
        logging.error("Invalid content type")
        return jsonify({'error': 'Content-Type must be application/json'}), 400

    try:
        data = request.get_json()
        logging.info("Received input data:")
        logging.info(f"Demographics: {data['demographics']}")
        logging.info(f"Gene Mutations: {data['geneMutations']}")

        if not data or 'demographics' not in data or 'geneMutations' not in data:
            logging.error("Missing required fields in request data")
            return jsonify({'error': 'Missing required fields'}), 400

        if len(data['demographics']) != 3:
            logging.error(f"Invalid demographics length: {len(data['demographics'])}")
            return jsonify({'error': 'Invalid demographics data'}), 400

        if len(data['geneMutations']) != 20:
            logging.error(f"Invalid gene mutations length: {len(data['geneMutations'])}")
            return jsonify({'error': 'Invalid gene mutations data'}), 400

        # Convert demographics to numeric values
        demographics = []
        demo_types = ['gender', 'age', 'race']
        for i, d in enumerate(data['demographics']):
            try:
                value = map_demographic_value(d, demo_types[i])
                demographics.append(value)
                logging.info(f"{demo_types[i]}: {d} -> {value}")
            except Exception as e:
                logging.error(f"Error mapping {demo_types[i]} value '{d}': {str(e)}")
                return jsonify({'error': f'Invalid {demo_types[i]} value: {d}'}), 400

        # Convert gene mutations to float
        try:
            gene_mutations = [float(g) for g in data['geneMutations']]
            logging.info("Gene mutations mapping:")
            for i, g in enumerate(gene_mutations):
                logging.info(f"Gene {i+1}: {data['geneMutations'][i]} -> {g}")
            if not all(g in [0.0, 1.0] for g in gene_mutations):
                raise ValueError("Gene mutations must be 0 or 1")
        except Exception as e:
            logging.error(f"Error processing gene mutations: {str(e)}")
            return jsonify({'error': 'Invalid gene mutation values'}), 400

        # Combine and validate features
        features = np.array([demographics + gene_mutations])
        logging.info(f"Combined feature vector shape: {features.shape}")
        logging.info(f"Feature vector: {features}")
        if features.shape != (1, 23):
            logging.error(f"Invalid feature shape: {features.shape}")
            return jsonify({'error': 'Invalid feature shape'}), 400

        # Scale features
        try:
            scaled_features = scaler.transform(features)
            logging.info(f"Scaled features: {scaled_features}")
            # Simulated progress logging (text prediction)
            logging.info("Progress: 33% - Features scaled")
        except Exception as e:
            logging.error(f"Error during feature scaling: {str(e)}")
            return jsonify({'error': 'Error during feature scaling'}), 500

        # Make prediction
        try:
            prediction = text_model.predict_proba(scaled_features)[0]
            logging.info("Progress: 66% - Model prediction complete")
            classes = ["Glioma", "Meningioma", "No Tumor", "Pituitary"]
            tumor_type = classes[np.argmax(prediction)]
            probability = float(np.max(prediction) * 100)
            
            logging.info("Prediction probabilities for each class:")
            for cls, prob in zip(classes, prediction):
                logging.info(f"{cls}: {prob*100:.2f}%")
            logging.info(f"Final prediction: {tumor_type} ({probability:.2f}%)")
            logging.info("Progress: 100% - Finalizing response")
            
            # New: Build a dictionary with all predictions (percentages)
            predictions_dict = {cls: prob * 100 for cls, prob in zip(classes, prediction)}
            
            return jsonify({
                'tumorType': tumor_type,
                'probability': probability,
                'predictions': predictions_dict
            })
        except Exception as e:
            logging.error(f"Error during model prediction: {str(e)}")
            return jsonify({'error': 'Error during prediction'}), 500

    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@app.route('/api/predict_image', methods=['POST', 'OPTIONS'])
def predict_image():
    if request.method == 'OPTIONS':
        return '', 204

    if not request.files or 'file' not in request.files:
        logging.error("No file provided")
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        logging.error("No file selected")
        return jsonify({'error': 'No file selected'}), 400

    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        logging.error("Invalid file type")
        return jsonify({'error': 'Invalid file type. Please upload PNG or JPG'}), 400

    try:
        # Simulate processing time
        time.sleep(random.uniform(1.0, 2.5))
        logging.info("Progress: 50% - Image received and processing started")

        # Convert and preprocess image
        image = Image.open(file.stream).convert('RGB')
        image = image.resize((150, 150))  # Match model's expected input shape
        img_array = np.array(image, dtype=np.float32) / 255.0
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension

        logging.debug(f"Image array shape: {img_array.shape}")

        # Verify input shape matches model expectations
        if img_array.shape != (1, 150, 150, 3):
            raise ValueError(f"Invalid input shape: {img_array.shape}")

        # Make prediction using the loaded model
        predictions = model.predict(img_array)
        logging.debug(f"Prediction raw output: {predictions}")

        predicted_index = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_index]) * 100

        # Get class name from predefined list
        tumor_type = CLASS_NAMES[predicted_index]

        logging.info("Progress: 100% - Image analysis complete")
        logging.info(f"Image analysis result: {tumor_type} ({confidence:.2f}%)")

        return jsonify({
            'tumorType': tumor_type,
            'probability': round(confidence, 2)
        })

    except Exception as e:
        logging.error(f"Error during image analysis: {str(e)}")
        return jsonify({'error': 'Error during image analysis'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)