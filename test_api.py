import requests

url = "http://127.0.0.1:5000/add_medicine"

data = {
    "name": "Vitamin C",
    "dosage": "500mg",
    "time": "8AM",
    "status": "Pending"
}

response = requests.post(url, json=data)

print(response.json())