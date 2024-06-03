import pandas as pd
import json

# Load the CSV file
file_path = './Over 50cc Full year 2019.csv'
data = pd.read_csv(file_path, header=[0, 1])

# Rename columns for easier access
data.columns = ["MAKE", "MODEL", "SUBMODEL", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "YTD"]

# Drop rows where 'YTD' is NaN or less than or equal to 3
data = data.dropna(subset=['YTD'])
data['YTD'] = pd.to_numeric(data['YTD'], errors='coerce')
data = data.dropna(subset=['YTD'])
data = data[data['YTD'] > 20]

# Convert YTD to integer
data['YTD'] = data['YTD'].astype(int)

# Initialize the dictionary for JSON structure
output = {"name": "Motorcycles", "children": []}

# Group data by MAKE and MODEL and create the nested JSON structure
makes = data.groupby('MAKE')

for make_name, make_group in makes:
    make_entry = {"name": make_name, "children": []}
    models = make_group.groupby('MODEL')

    for model_name, model_group in models:
        model_entry = {"name": model_name, "children": []}
        for _, row in model_group.iterrows():
            if pd.isna(row['SUBMODEL']):
                model_entry["value"] = row['YTD']
            else:
                submodel_entry = {"name": row['SUBMODEL'], "value": row['YTD']}
                model_entry["children"].append(submodel_entry)

        make_entry["children"].append(model_entry)

    output["children"].append(make_entry)

# Save to JSON file
output_file_path = './Motorcycle_Sales_2019.json'
with open(output_file_path, 'w') as json_file:
    json.dump(output, json_file, indent=4)

print(f"JSON file has been saved to {output_file_path}")
