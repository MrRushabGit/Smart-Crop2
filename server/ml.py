import sys
import json
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.preprocessing import LabelEncoder
import os

# Suppress warnings
import warnings
warnings.filterwarnings('ignore')

# Map frontend values to dataset values where they differ
SOIL_TYPE_MAP = {
    'Silt': 'Silty',
    'Silty': 'Silty',
    'Clay': 'Clay',
    'Loamy': 'Loamy',
    'Sandy': 'Sandy',
    'Peaty': 'Peaty',
}

IRRIGATION_TYPE_MAP = {
    'Rainfed': 'Rain-fed',
    'Rain-fed': 'Rain-fed',
    'Drip': 'Drip',
    'Sprinkler': 'Sprinkler',
    'Flood': 'Flood',
    'Manual': 'Manual',
}

def main():
    try:
        input_data = json.loads(sys.argv[1])
        print(f"DEBUG RAW INPUT: {json.dumps(input_data)}", file=sys.stderr)

        # Load dataset
        dataset_path = os.path.join(os.getcwd(), 'attached_assets', 'agriculture_dataset_1772556603012.csv')
        df = pd.read_csv(dataset_path)
        print(f"DEBUG DATASET SIZE: {len(df)}", file=sys.stderr)

        # Use ALL features including categorical ones for better discrimination
        numerical_features = ['Farm_Area(acres)', 'Fertilizer_Used(tons)', 'Pesticide_Used(kg)', 'Water_Usage(cubic meters)']
        categorical_features = ['Soil_Type', 'Irrigation_Type', 'Season']
        target_crop = 'Crop_Type'

        # Encode categorical features using LabelEncoders
        label_encoders = {}
        for col in categorical_features:
            le = LabelEncoder()
            df[col + '_enc'] = le.fit_transform(df[col])
            label_encoders[col] = le

        encoded_cat_features = [col + '_enc' for col in categorical_features]
        all_features = numerical_features + encoded_cat_features

        X = df[all_features]
        y_crop = df[target_crop]

        X_train, X_test, y_train_crop, y_test_crop = train_test_split(X, y_crop, test_size=0.2, random_state=42)

        # Train Crop Model with more estimators for better accuracy
        crop_model = RandomForestClassifier(n_estimators=100, random_state=42)
        crop_model.fit(X_train, y_train_crop)

        # Calculate metrics for Crop Model
        crop_preds = crop_model.predict(X_test)
        accuracy = accuracy_score(y_test_crop, crop_preds)
        precision = precision_score(y_test_crop, crop_preds, average='weighted', zero_division=0)
        recall = recall_score(y_test_crop, crop_preds, average='weighted', zero_division=0)
        f1 = f1_score(y_test_crop, crop_preds, average='weighted', zero_division=0)

        # Map frontend categorical values to dataset values
        raw_soil = input_data.get('soilType', 'Loamy')
        raw_irrigation = input_data.get('irrigationType', 'Drip')
        raw_season = input_data.get('season', 'Kharif')

        mapped_soil = SOIL_TYPE_MAP.get(raw_soil, raw_soil)
        mapped_irrigation = IRRIGATION_TYPE_MAP.get(raw_irrigation, raw_irrigation)
        mapped_season = raw_season  # Season values match between frontend and dataset

        print(f"DEBUG MAPPED CATEGORICALS: soil={mapped_soil}, irrigation={mapped_irrigation}, season={mapped_season}", file=sys.stderr)

        # Encode user categorical inputs using the fitted encoders
        # Handle unknown categories gracefully by defaulting to the most common class
        def safe_encode(encoder, value, col_name):
            if value in encoder.classes_:
                return encoder.transform([value])[0]
            else:
                print(f"WARNING: Unknown {col_name} value '{value}', known values: {list(encoder.classes_)}", file=sys.stderr)
                # Default to first class (most common after sorting)
                return 0

        soil_enc = safe_encode(label_encoders['Soil_Type'], mapped_soil, 'Soil_Type')
        irrigation_enc = safe_encode(label_encoders['Irrigation_Type'], mapped_irrigation, 'Irrigation_Type')
        season_enc = safe_encode(label_encoders['Season'], mapped_season, 'Season')

        user_df = pd.DataFrame([{
            'Farm_Area(acres)': float(input_data.get('farmArea', 100)),
            'Fertilizer_Used(tons)': float(input_data.get('fertilizerUsed', 5)),
            'Pesticide_Used(kg)': float(input_data.get('pesticideUsed', 2)),
            'Water_Usage(cubic meters)': float(input_data.get('waterUsage', 50000)),
            'Soil_Type_enc': soil_enc,
            'Irrigation_Type_enc': irrigation_enc,
            'Season_enc': season_enc,
        }])

        print(f"DEBUG ENCODED INPUT: {user_df.to_dict(orient='records')}", file=sys.stderr)

        pred_crop = crop_model.predict(user_df)[0]
        # Probability/Confidence
        probs = crop_model.predict_proba(user_df)[0]
        confidence = float(max(probs))

        print(f"DEBUG PREDICTION: crop={pred_crop}, confidence={confidence:.4f}", file=sys.stderr)
        print(f"DEBUG PROBABILITIES: {dict(zip(crop_model.classes_, [round(float(p), 4) for p in probs]))}", file=sys.stderr)

        # Mock disease prediction since it's not in dataset
        diseases = {
            'Cotton': 'Boll Rot',
            'Carrot': 'Leaf Blight',
            'Sugarcane': 'Red Rot',
            'Tomato': 'Late Blight',
            'Soybean': 'Rust',
            'Rice': 'Blast',
            'Maize': 'Stalk Rot',
            'Wheat': 'Powdery Mildew',
            'Barley': 'Net Blotch',
            'Potato': 'Early Blight'
        }
        pred_disease = diseases.get(pred_crop, 'None Detected')

        result = {
            "recommendedCrop": pred_crop,
            "diseasePrediction": pred_disease,
            "confidenceScore": confidence,
            "metrics": {
                "accuracy": accuracy,
                "precision": precision,
                "recall": recall,
                "f1Score": f1
            }
        }
        print(json.dumps(result))

    except Exception as e:
        import traceback
        print(f"ML ERROR: {str(e)}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()

