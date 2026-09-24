from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import secrets
import string

app = Flask(__name__)
CORS(app)

BASE_URL = "https://api.mail.tm"


def generate_password(length=16):
  chars = string.ascii_letters + string.digits + "!@#$%^&*()_-+=<>?"
  return "".join(secrets.choice(chars) for _ in range(length))

#command to test
@app.route("/api/generate", methods=["POST"])
def generate_account():
  try:
    domain_res = requests.get(f"{BASE_URL}/domains")
    domain = domain_res.json()["hydra:member"][0]["domain"]

    random_name = "".join(
        secrets.choice(string.ascii_lowercase + string.digits) for _ in range(10)
    )
    email = f"{random_name}@{domain}"
    password = generate_password()

    payload = {"address": email, "password": password}
    create_res = requests.post(f"{BASE_URL}/accounts", json=payload)
    if create_res.status_code != 201:
      return jsonify({"error": "Error creating the inbox"}), 500

    token_res = requests.post(f"{BASE_URL}/token", json=payload)
    if token_res.status_code != 200:
      return jsonify({"error": "Login unsuccessful"}), 500

    token = token_res.json().get("token")

    return jsonify({
        "email": email,
        "username": random_name,
        "password": password,
        "token": token,
    })

  except Exception as e:
    return jsonify({"error": str(e)}), 500


@app.route("/api/check_inbox", methods=["POST"])
def check_inbox():
  data = request.get_json()
  token = data.get("token")
  if not token:
    return jsonify({"error": "No Token"}), 400

  headers = {"Authorization": f"Bearer {token}"}
  res = requests.get(f"{BASE_URL}/messages", headers=headers)
  if res.status_code != 200:
    return jsonify({"error": "Error"}), 500

  messages_summary = res.json().get("hydra:member", [])
  detailed_messages = []

  for msg in messages_summary:
    msg_id = msg.get("id")
    detail_res = requests.get(f"{BASE_URL}/messages/{msg_id}", headers=headers)
    if detail_res.status_code == 200:
      detail_data = detail_res.json()
      detailed_messages.append({
          "from": msg.get("from", {}).get("address"),
          "subject": msg.get("subject"),
          "intro": msg.get("intro"),
          "text": detail_data.get("text", ""),
          "html": detail_data.get("html", []),
      })

  return jsonify({"messages": detailed_messages})


if __name__ == "__main__":
  app.run(host="0.0.0.0", port=5000, debug=True)