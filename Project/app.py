from flask import Flask, request, jsonify, send_from_directory
from PIL import Image
import torch
import torchvision.transforms as transforms
import numpy as np
import os
import io
from flask_cors import CORS
from datetime import datetime
from pymongo import MongoClient
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config['UPLOAD_FOLDER'] = 'uploads'
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

MONGO_URI = "mongodb+srv://tethys2004:pk9Gy0kPRCbeTUik@animegan.qosmyfa.mongodb.net/?retryWrites=true&w=majority&appName=AnimeGAN/AnimeGAN"
client = MongoClient(MONGO_URI)
db = client["AnimeGAN"]
collection = db["generation_history"]


# Set device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f'Using device: {device}')

# Load AnimeGAN model once
model = torch.hub.load('bryandlee/animegan2-pytorch:main', 'generator', 
                       pretrained='face_paint_512_v2', device=device)
model.eval()

# Transform for model input
transform = transforms.Compose([
    transforms.Resize((512, 512)),
    transforms.ToTensor(),
    transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])
])

@app.route('/animegan', methods=['POST'])
def generate_anime_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    try:
        # Load image
        file = request.files['image']
        
        original_img = Image.open(file.stream).convert('RGB')
        original_width, original_height = original_img.size
    
        print(f"Original image size: {original_width}x{original_height}")
        
        # Transform for model input
        img_for_model = transform(original_img).unsqueeze(0).to(device)
        
        # Generate anime image
        with torch.no_grad():
            anime_image = model(img_for_model)
        
        # Convert to numpy and adjust pixel values
        anime_image = anime_image.squeeze(0).permute(1, 2, 0).cpu().numpy()
        anime_image = ((anime_image + 1) * 127.5).astype(np.uint8)
        
        # Convert back to PIL image
        anime_pil = Image.fromarray(anime_image)
        
        # Resize back to original dimensions
        anime_pil_resized = anime_pil.resize((original_width, original_height), Image.LANCZOS)
        
        # Save the result to a static directory
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f'anime_output_{timestamp}.png'
        output_dir = 'static/output'
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, filename)
        anime_pil_resized.save(output_path)
        
        print(f'Success! Anime image saved to: {output_path} with original dimensions {original_width}x{original_height}')
        
        # Return JSON response with the URL of the generated image
        base_url = "http://localhost:5000"
        image_url = f"{base_url}/static/output/{filename}"
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        entry = {
            "input_image": filepath,
            "output_image": image_url,
            "timestamp": datetime.now()
        }
        result = collection.insert_one(entry)
        return jsonify({'message': 'Image generated successfully', 'image_url': image_url, "id": str(result.inserted_id)})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/', methods=['GET'])
def health_check():
    return "AnimeGAN Flask API is running!"

# Serve static files (Flask serves files from the 'static' folder by default)
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)


@app.route("/get-history", methods=["GET"])
def get_history():
    history = list(collection.find({}, {"_id": 0}))  # exclude Mongo _id if not needed
    return jsonify(history)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
