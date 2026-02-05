import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import (train_test_split, GridSearchCV, StratifiedKFold, cross_validate)
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import (accuracy_score, precision_score, recall_score, f1_score,confusion_matrix, classification_report)

data = pd.read_csv('/Users/rushab/Downloads/agriculture_dataset.csv')

if 'Crop_Type' not in data.columns: 
    raise ValueError("Expected 'Crop_Type' column in the CSV.")
X = data.drop('Crop_Type', axis=1)
y = data['Crop_Type']

X = pd.get_dummies(X, drop_first=True)

print("Missing values per column (features + target):")
print(pd.concat([X, y], axis=1).isnull().sum())


x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

dt = DecisionTreeClassifier(random_state=42)

param_grid = {"max_depth": [3, 5, 7, 10, None], "min_samples_split": [2, 5, 10]}


cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
grid = GridSearchCV(dt, param_grid, cv=cv, n_jobs=-1, verbose=1)
grid.fit(x_train, y_train)

best_model = grid.best_estimator_
print("\nBEST PARAMETERS:", grid.best_params_)

cv_results = cross_validate(best_model, X, y, cv=cv,scoring=['accuracy','precision_weighted','recall_weighted','f1_weighted'],n_jobs=-1)

print("\nCross-validation (5-fold) results (mean ± std):")
print(f"Accuracy:  {cv_results['test_accuracy'].mean():.4f} ± {cv_results['test_accuracy'].std():.4f}")
print(f"Precision: {cv_results['test_precision_weighted'].mean():.4f} ± {cv_results['test_precision_weighted'].std():.4f}")
print(f"Recall:    {cv_results['test_recall_weighted'].mean():.4f} ± {cv_results['test_recall_weighted'].std():.4f}")
print(f"F1-score:  {cv_results['test_f1_weighted'].mean():.4f} ± {cv_results['test_f1_weighted'].std():.4f}")


y_pred = best_model.predict(x_test)

acc = accuracy_score(y_test, y_pred)
prec = precision_score(y_test, y_pred, average='weighted', zero_division=0)
rec = recall_score(y_test, y_pred, average='weighted', zero_division=0)
f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)

print("\nTest set metrics:")
print(f"Accuracy:  {acc:.4f}")
print(f"Precision: {prec:.4f}")
print(f"Recall:    {rec:.4f}")
print(f"F1 Score:  {f1:.4f}")

print("\nClassification report (per-class):")
print(classification_report(y_test, y_pred, zero_division=0))


labels = best_model.classes_  
cm = confusion_matrix(y_test, y_pred, labels=labels)

plt.figure(figsize=(10, 8))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=labels, yticklabels=labels)
plt.ylabel('True label')
plt.xlabel('Predicted label')
plt.title('Confusion Matrix (test set)')
plt.tight_layout()
plt.show()
