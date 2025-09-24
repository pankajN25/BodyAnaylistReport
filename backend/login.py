# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import mysql.connector
# import bcrypt
# import os # Import os for file path operations
# from werkzeug.utils import secure_filename # For secure file naming

# app = Flask(__name__) # Standard Flask app initialization
# # Allow your React dev server (adjust port if you use 3001)
# CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})

# # --- Database connection (adjust user/password if needed) ---
# db = mysql.connector.connect(
#     host="localhost",
#     user="root",
#     password="pankajN90@",   # <-- change if your MySQL root has a different password
#     database="body_analysis_db"
# )
# cursor = db.cursor(dictionary=True)

# # --- File Upload Configuration ---
# UPLOAD_FOLDER = 'uploads'
# # Ensure the upload folder exists
# if not os.path.exists(UPLOAD_FOLDER):
#     os.makedirs(UPLOAD_FOLDER)
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max upload size
# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf'}

# def allowed_file(filename):
#     return '.' in filename and \
#            filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# # -------------------------------
# # Agent Registration API
# # -------------------------------
# @app.route('/api/register', methods=['POST'])
# def register():
#     first_name = request.form.get("firstName")
#     last_name = request.form.get("lastName")
#     name = request.form.get("name") or f"{(first_name or '').strip()} {(last_name or '').strip()}".strip()

#     email = request.form.get("email")
#     phone = request.form.get("phone")
#     agency_name = request.form.get("agencyName")

#     # New fields from the form
#     wellness_center_name = request.form.get("wellnessCenterName")
#     position = request.form.get("position")
#     contact_number = request.form.get("contactNumber")  # alternative contact number
#     name_of_company = request.form.get("nameOfCompany")
#     experience = request.form.get("experience")

#     # --- File uploads (same as before) ---
#     photo_path = None
#     logo_img_path = None
#     food_certification_path = None

#     # Handle file uploads
#     if 'photo' in request.files:
#         photo = request.files['photo']
#         if photo and allowed_file(photo.filename):
#             filename = secure_filename(photo.filename)
#             photo_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#             photo.save(photo_path)
#         elif photo.filename != '': # If a file was sent but not allowed
#             return jsonify({"error": "Invalid photo file type"}), 400

#     if 'logoImg' in request.files:
#         logo_img = request.files['logoImg']
#         if logo_img and allowed_file(logo_img.filename):
#             filename = secure_filename(logo_img.filename)
#             logo_img_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#             logo_img.save(logo_img_path)
#         elif logo_img.filename != '':
#             return jsonify({"error": "Invalid logo image file type"}), 400

#     if 'foodCertification' in request.files:
#         food_certification = request.files['foodCertification']
#         if food_certification and allowed_file(food_certification.filename):
#             filename = secure_filename(food_certification.filename)
#             food_certification_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#             food_certification.save(food_certification_path)
#         elif food_certification.filename != '':
#             return jsonify({"error": "Invalid food certification file type"}), 400

#     # Basic validation for required fields
#     if not (name and email and agency_name and
#         wellness_center_name and position and name_of_company and experience):
#        return jsonify({"error": "Missing required fields. Please fill all fields marked with *"}), 400

#     # Uniqueness check for email
#     cursor.execute("SELECT id FROM agents WHERE email=%s", (email,))
#     if cursor.fetchone():
#         return jsonify({"error": "Email already registered"}), 409

#     # Hash password (store as string)
#     # hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
#     # hashed_password_str = hashed_password.decode('utf-8')

#     try:
#         cursor.execute(
#             """
#             INSERT INTO agents (
#                 name, email, phone, agency_name,
#                 wellness_center_name, position, contact_number,
#                 name_of_company, experience, photo_path, logo_img_path, food_certification_path
#             )
#             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
#             """,
#                 (
#                     name, email, phone, agency_name,
#                     wellness_center_name, position, contact_number,
#                     name_of_company, experience, photo_path, logo_img_path, food_certification_path
#                 )
# )

#         db.commit()
#         return jsonify({"message": "Agent registered successfully"}), 201
#     except mysql.connector.Error as err:
#         db.rollback()
#         return jsonify({"error": str(err)}), 500


# # -------------------------------
# # Agent Login API (FIXED)
# # -------------------------------
# @app.route('/api/login', methods=['POST'])
# def login():
#     data = request.json or {}
#     email = data.get("email")
#     password = data.get("password")

#     if not (email and password):
#         return jsonify({"error": "Email and password are required"}), 400

#     cursor = db.cursor(dictionary=True)
#     cursor.execute("SELECT * FROM agents WHERE email=%s", (email,))
#     user = cursor.fetchone()

#     if not user:
#         return jsonify({"error": "Invalid email or password"}), 401

#     # Plain text comparison
#     if password != user['password']:
#         return jsonify({"error": "Invalid email or password"}), 401

#     # --- Registration check ---
#     is_fully_registered = (
#         user.get("wellness_center_name") not in (None, '') and
#         user.get("position") not in (None, '') and
#         user.get("name_of_company") not in (None, '')
#     )

#     user_data = {
#         "id": user["id"],
#         "name": user["name"],
#         "email": user["email"],
#         "isFullyRegistered": is_fully_registered
#     }

#     return jsonify({
#         "message": "Login successful",
#         "agent": user_data
#     }), 200



# if __name__ == "__main__":
#     app.run(debug=True, port=5000)
