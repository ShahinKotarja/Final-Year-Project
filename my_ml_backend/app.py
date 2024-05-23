from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from model2 import load_products, load_interactions, create_interaction_matrix, hybrid_recommendation

app = Flask(__name__)
CORS(app)

# Load product and interaction data
products = load_products('groceryStoreDataset.json')
interactions = load_interactions('User_Interactions.csv')
interaction_matrix = create_interaction_matrix(interactions, 'userId', 'productId', 'rating')

@app.route('/recommendations', methods=['GET'])
def get_recommendations():
    user_id = int(request.args.get('user_id', 1))
    num_recommendations = int(request.args.get('num_recommendations', 5))
    diabetes_friendly = request.args.get('diabetes_friendly', 'false').lower() == 'true'
    
    recommended_products = hybrid_recommendation(products, interaction_matrix, user_id, num_recommendations, diabetes_friendly)
    return jsonify(recommended_products)

if __name__ == '__main__':
    app.run(debug=True)
