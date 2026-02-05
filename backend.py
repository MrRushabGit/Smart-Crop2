import pandas as pd
from sklearn.model_selection import train_test_split , GridSearchCV
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score ,precision_score, recall_score, f1_score 

data = pd.read_csv('/Users/rushab/Downloads/agriculture_dataset.csv') 
data = pd.get_dummies(data)

dt = DecisionTreeClassifier()

x =data.drop('Crop_Type',axis=1)
y = data['Crop_Type']   

print(data.isnull().sum())

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)

param_grid = {"max_depth": [3, 5, 7, 10, None],"min_samples_split": [2, 5, 10]}
grid = GridSearchCV(dt, param_grid,cv=5)
grid.fit(x_train, y_train)

best_model = grid.best_estimator_
print("BEST PARAMETERS:", grid.best_params_)

y_pred = best_model.predict(x_test)  

accuracy_score = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, average='weighted') 
recall = recall_score(y_test, y_pred, average='weighted')
f1 = f1_score(y_test, y_pred, average='weighted')

print(f"Accuracy: {accuracy_score}")
print(f"Precision: {precision}")
print(f"Recall: {recall}")
print(f"F1 Score: {f1}")
print(data.isnull().sum())
