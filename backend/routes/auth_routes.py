# # routes/auth_routes.py
# from flask import Blueprint, request, jsonify
# from utils.db import get_db_connection

# auth_bp = Blueprint("auth_bp", __name__)

# @auth_bp.route("/api/login", methods=["POST", "OPTIONS"])
# def login():
#     # handle preflight
#     if request.method == "OPTIONS":
#         return jsonify({}), 200

#     data = request.get_json() or {}
#     email = (data.get("email") or "").strip()
#     password = data.get("password", "")

#     if not email or password is None:
#         return jsonify({"error": "Email and password are required"}), 400

#     conn = None
#     try:
#         conn = get_db_connection()
#         cursor = conn.cursor(dictionary=True)
#         cursor.execute("SELECT * FROM agents WHERE email=%s", (email,))
#         user = cursor.fetchone()

#         # If user exists -> check plaintext password
#         if user:
#             stored = user.get("password")
#             # stored might be None if registration created profile without password
#             if stored is None or stored != password:
#                 return jsonify({"error": "Invalid email or password"}), 401
#         else:
#             # create minimal agent record so frontend can go to registration page
#             cursor.execute(
#                 "INSERT INTO agents (name, email, password) VALUES (%s, %s, %s)",
#                 (email, email, password)
#             )
#             conn.commit()
#             new_id = cursor.lastrowid
#             cursor.execute("SELECT * FROM agents WHERE id=%s", (new_id,))
#             user = cursor.fetchone()

#         # determine fully-registered flag
#         is_fully_registered = bool(user.get("wellness_center_name")) and bool(user.get("position")) and bool(user.get("name_of_company"))

#         agent_data = {
#             "id": user["id"],
#             "name": user.get("name"),
#             "email": user.get("email"),
#             "isFullyRegistered": is_fully_registered
#         }

#         return jsonify({"message": "Login successful", "agent": agent_data}), 200

#     except Exception as e:
#         return jsonify({"error": "Server error", "details": str(e)}), 500
#     finally:
#         if conn:
#             conn.close()
