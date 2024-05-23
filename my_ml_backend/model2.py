import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

# Function to load and normalize product data
def load_products(json_path):
    products = pd.read_json(json_path)
    products = pd.json_normalize(products.to_dict(orient='records'))
    return products

# Function to load user interactions
def load_interactions(csv_path):
    interactions = pd.read_csv(csv_path)
    return interactions

# Function to create an interaction matrix for collaborative filtering
def create_interaction_matrix(df, user_col, item_col, rating_col, threshold=None):
    interactions = df.groupby([user_col, item_col])[rating_col].sum().unstack().reset_index().fillna(0)
    if threshold is not None:
        interactions = interactions.applymap(lambda x: 1 if x > threshold else 0)
    interactions.set_index(user_col, inplace=True)
    return interactions

# Hybrid recommendation function
def hybrid_recommendation(products, interactions, user_id, num_recommendations=5, diabetes_friendly=False):
    # Create TF-IDF matrix for product descriptions
    tfidf = TfidfVectorizer(stop_words='english')
    products['description'] = products['description'].fillna('')
    tfidf_matrix = tfidf.fit_transform(products['description'])
    
    # Cosine similarity for content-based filtering
    content_sim = cosine_similarity(tfidf_matrix)

    # Collaborative filtering similarity matrix
    user_sim = cosine_similarity(interactions)
    user_sim_df = pd.DataFrame(user_sim, index=interactions.index, columns=interactions.index)

    # Convert user_id to index in the user similarity matrix if needed
    user_idx = interactions.index.get_loc(user_id)

    # Get top similar users
    if user_id in user_sim_df.index:
        similar_users = user_sim_df.loc[user_id].sort_values(ascending=False)[1:11]  # Top 10 similar users
    else:
        return []

    # Aggregating product scores from similar users
    similar_users_interactions = interactions.loc[similar_users.index]
    product_scores = similar_users_interactions.multiply(similar_users.values, axis=0).sum(axis=0)
    product_scores = product_scores.sort_values(ascending=False)

    # Ensure that indices for product scores are in the product catalog
    valid_product_indices = [products.index[products['productID'] == pid].tolist()[0] for pid in product_scores.index if pid in products['productID'].values]

    # Combining scores from content-based and collaborative filtering
    combined_scores = pd.Series(
        product_scores.loc[product_scores.index.intersection(products['productID'])].values + 
        content_sim[user_idx, valid_product_indices], 
        index=product_scores.index.intersection(products['productID'])
    )
    combined_scores = combined_scores.sort_values(ascending=False)

    # Filter products based on diabetes suitability if necessary
    final_products = products.loc[combined_scores.index].copy()
    final_products['score'] = combined_scores.values
    if diabetes_friendly:
        final_products = final_products[final_products['suitableFor.diabetes.general'] > 0]

    # Return the top N product IDs, filtered as necessary
    return final_products.sort_values(by='score', ascending=False).head(num_recommendations)['productID'].tolist()

# Load datasets
products = load_products('groceryStoreDataset.json')
interactions = load_interactions('User_Interactions.csv')

# Create interaction matrix
interaction_matrix = create_interaction_matrix(interactions, 'userId', 'productId', 'rating')

# Example usage to get recommendations for a specific user
product_recommendations = hybrid_recommendation(products, interaction_matrix, 1, 5, diabetes_friendly=True)
print(product_recommendations)
