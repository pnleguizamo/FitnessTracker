import csv
import json
from datetime import datetime

def csv_to_json(csv_file_path, output_json_path=None):
    """
    Convert a CSV file with date and weight records to JSON format.
    
    Args:
        csv_file_path (str): Path to the input CSV file
        output_json_path (str, optional): Path to save the JSON output. 
                                         If None, prints to console.
    """
    json_data = []
    
    with open(csv_file_path, mode='r') as csv_file:
        reader = csv.DictReader(csv_file)
        
        for row in reader:
            # Get the date and weight values (case-insensitive)
            date_key = next(key for key in row.keys() if key.lower() == 'date')
            weight_key = next(key for key in row.keys() if key.lower() in ['recorded', 'weight', 'body_weight'])
            
            try:
                # Parse the date (handles multiple formats)
                date_obj = datetime.strptime(row[date_key], '%m/%d/%Y')
                formatted_date = date_obj.strftime('%B %-d, %Y')
                
                # Create JSON object
                json_obj = {
                    "date": formatted_date,
                    "body_weight": row[weight_key]
                }
                
                json_data.append(json_obj)
            except ValueError as e:
                print(f"Skipping row due to date format issue: {row}")
                continue
    
    # Output the result
    if output_json_path:
        with open(output_json_path, 'w') as json_file:
            json.dump(json_data, json_file, indent=4)
        print(f"Successfully converted data to {output_json_path}")
    else:
        print(json.dumps(json_data, indent=4))

input_csv = "weights.csv"  # Change to your CSV file path
output_json = "body_weight_test.json"  # Optional: set to None to print to console

csv_to_json(input_csv, output_json)