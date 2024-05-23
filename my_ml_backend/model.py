import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Function to load and normalize product data
def load_products(json_path):
    # Load JSON data
    products = pd.read_json(json_path)
    # Normalize the nested JSON data into flat columns
    products = pd.json_normalize(products.to_dict(orient='records'))
    return products

# Function to load user interactions (keeping this function in case it's needed for future uses)
def load_interactions(csv_path):
    interactions = pd.read_csv(csv_path)
    return interactions

# Content-Based Recommendation function using product descriptions
def recommend_products_content_based(products, num_recommendations=5):
    # Create a TF-IDF Vectorizer to analyze product descriptions
    tfidf = TfidfVectorizer(stop_words='english')
    products['description'] = products['description'].fillna('')
    tfidf_matrix = tfidf.fit_transform(products['description'])

    # Compute cosine similarity matrix
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

    # Function to get recommendations for each product
    def get_recommendations(product_id, cosine_sim=cosine_sim):
        # Get the index of the product that matches the product_id
        idx = products.index[products['productID'] == product_id].tolist()[0]

        # Get the pairwsie similarity scores of all products with that product
        sim_scores = list(enumerate(cosine_sim[idx]))

        # Sort the products based on the similarity scores
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

        # Get the scores of the most similar products
        sim_scores = sim_scores[1:num_recommendations+1]

        # Get the product indices
        product_indices = [i[0] for i in sim_scores]

        # Return the productIDs of the top most similar products
        return products.iloc[product_indices]['productID'].tolist()

    # Example: Recommend for a specific product, say productID 1
    return get_recommendations(1)

# Load datasets
products = load_products('groceryStoreDataset.json')
interactions = load_interactions('User_Interactions.csv')

# Example usage to get recommendations
product_recommendations = recommend_products_content_based(products, 12)
print(product_recommendations)
