from flask import Flask, request, jsonify,request
from flask_cors import CORS
import pymysql.cursors
import os
import bcrypt
import jwt
import datetime
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from datetime import datetime, timedelta, timezone

import traceback
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from flask import send_from_directory

# Load environment variables
load_dotenv()

app = Flask(__name__)

# --- CORS ---
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000",  "http://localhost:3001", "http://127.0.0.1:3001" ]}})



# --- Database Config (use pymysql for everything) ---
db_config = {
    'host': os.getenv('MYSQL_HOST', 'localhost'),
    'user': os.getenv('MYSQL_USER', 'root'),
    'password': os.getenv('MYSQL_PASSWORD', ''),
    'database': os.getenv('MYSQL_DATABASE', 'body_analysis_db'),
    'cursorclass': pymysql.cursors.DictCursor,
}
JWT_SECRET = os.getenv('JWT_SECRET', 'your_super_secret_key')

def get_db_connection():
    return pymysql.connect(**db_config)

# --- File Upload Config ---
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# --- Helper function to handle empty values ---
def transform_data(value, type_cast=None):
    if value in (None, '', 'null', 'undefined'):
        return None
    try:
        if type_cast:
            return type_cast(value)
    except (ValueError, TypeError):
        return None
    return value


# =========================
# CUSTOMER ENDPOINTS
# =========================

@app.route('/api/submit-report', methods=['POST'])
def submit_report():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    print("Received data:", data)

    client_data = data.get('client', {})
    form1 = client_data.get('form1', {})
    form2 = client_data.get('form2', {})
    form3 = client_data.get('form3', {})
    full_data = {**form1, **form2, **form3}

    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # 1. Check if user exists by mobile
            mobile = transform_data(full_data.get('mobile'))
            name = transform_data(full_data.get('name'))

            cursor.execute("SELECT user_id FROM users WHERE mobile=%s", (mobile,))
            user = cursor.fetchone()

            if user:
                user_id = user['user_id']
            else:
                # Create new user with mobile and name, password can be default or empty
                # You may want to hash a default password or generate one
                default_password_hash = bcrypt.hashpw(mobile.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                cursor.execute(
                    "INSERT INTO users (name, mobile, password_hash) VALUES (%s, %s, %s)",
                    (name, mobile, default_password_hash)
                )
                connection.commit()
                user_id = cursor.lastrowid

            # 2. Insert report with user_id included
        sql = """
            INSERT INTO body_analysis_reports (
                user_id, name, mobile, village, age, height, report_date, dob, email,
                gender, weight, previous_weight, weight_change, ideal_weight, extra_weight, less_weight,
                body_fat, visceral_fat, resting_metabolism, bmi, body_age,
                whole_body_sub_fat, trunk_sub_fat, arm_sub_fat, leg_sub_fat,
                skeletal_muscle, trunk_muscle, arms_muscle, legs_muscle
            ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            """

        values = (
            user_id,
            name,
            mobile,
            transform_data(full_data.get('village')),
            transform_data(full_data.get('age'), int),
            transform_data(full_data.get('height'), float),
            transform_data(full_data.get('date')),
            transform_data(full_data.get('dob')),
            transform_data(full_data.get('email')),
            transform_data(full_data.get('gender')),
            transform_data(full_data.get('weight'), float),
            transform_data(full_data.get('previousWeight'), float),
            transform_data(full_data.get('weightChange'), float),
            transform_data(full_data.get('idealWeight'), float),
            transform_data(full_data.get('extra'), float),
            transform_data(full_data.get('less'), float),
            transform_data(full_data.get('bodyFat'), float),
            transform_data(full_data.get('visceralFat'), float),
            transform_data(full_data.get('restingMetabolism'), int),
            transform_data(full_data.get('bmi'), float),
            transform_data(full_data.get('bodyAge'), int),
            transform_data(full_data.get('wholeBodySubFat'), float),
            transform_data(full_data.get('trunkSubFat'), float),
            transform_data(full_data.get('armSubFat'), float),
            transform_data(full_data.get('legSubFat'), float),
            transform_data(full_data.get('skeletalMuscle'), float),
            transform_data(full_data.get('trunkMuscle'), float),
            transform_data(full_data.get('armsMuscle'), float),
            transform_data(full_data.get('legsMuscle'), float)
        )

        with connection.cursor() as cursor:

            cursor.execute(sql, values)
            connection.commit()
            report_id = cursor.lastrowid

        return jsonify({"message": "Report submitted", "reportId": report_id}), 201

    except Exception as e:
        connection.rollback()
        import traceback
        print("Exception traceback:")
        traceback.print_exc()
        return jsonify({"error": "Failed to submit report", "details": str(e)}), 500
    finally:
        connection.close()

@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json()
    name, mobile = data.get('name'), data.get('mobile')
    if not name or not mobile:
        return jsonify({"error": "Name and Mobile required"}), 400

    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT user_id, name, password_hash FROM users WHERE mobile=%s", (mobile,))
            user = cursor.fetchone()
            if not user or user['name'].lower() != name.lower():
                return jsonify({"error": "Invalid credentials"}), 401
            if not bcrypt.checkpw(mobile.encode('utf-8'), user['password_hash'].encode('utf-8')):
                return jsonify({"error": "Invalid credentials"}), 401

        token_payload = {"user_id": user['user_id'], "name": user['name'], "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)}
        token = jwt.encode(token_payload, JWT_SECRET, algorithm="HS256")
        return jsonify({"message": "Login successful", "accessToken": token, "user_id": user['user_id']}), 200
    except Exception as e:
        return jsonify({"error": "Login failed", "details": str(e)}), 500
    finally:
        connection.close()


# =========================
# AGENT ENDPOINTS
# =========================

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)



@app.route('/api/register', methods=['POST'])
def register_agent():
    form = request.form
    name = form.get("name") or f"{(form.get('firstName') or '').strip()} {(form.get('lastName') or '').strip()}".strip()
    email, phone, agency_name = form.get("email"), form.get("phone"), form.get("agencyName")
    wellness_center, position = form.get("wellnessCenterName"), form.get("position")
    contact_number, company, experience = form.get("contactNumber"), form.get("nameOfCompany"), form.get("experience")

    def allowed_file(filename):
        ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf'}
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

    def save_file(field):
        if field in request.files:
            file = request.files[field]
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(path)
                return filename  # Return only filename, NOT full path
        return None

    def normalize_path(path):
        if path:
            return path.replace('\\', '/')
        return path

    photo_path = save_file("photo")
    logo_path = save_file("logoImg")
    cert_path = save_file("foodCertification")

    # Normalize paths to use forward slashes
    photo_path = normalize_path(photo_path)
    logo_path = normalize_path(logo_path)
    cert_path = normalize_path(cert_path)

    # Validate required fields
    if not (name and email and agency_name and wellness_center and position and company and experience):
        return jsonify({"error": "Missing required fields"}), 400

    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # Check if agent already exists
            cursor.execute("SELECT id FROM agents WHERE email=%s", (email,))
            existing_agent = cursor.fetchone()

            if existing_agent:
                # Update existing agent with registration info
                cursor.execute("""
                    UPDATE agents SET
                        name=%s,
                        phone=%s,
                        agency_name=%s,
                        wellness_center_name=%s,
                        position=%s,
                        contact_number=%s,
                        name_of_company=%s,
                        experience=%s,
                        photo_path=%s,
                        logo_img_path=%s,
                        food_certification_path=%s,
                        is_fully_registered=TRUE
                    WHERE email=%s
                """, (
                    name, phone, agency_name, wellness_center, position, contact_number,
                    company, experience, photo_path, logo_path, cert_path, email
                ))
                connection.commit()
                cursor.execute("SELECT * FROM agents WHERE email=%s", (email,))
                agent = cursor.fetchone()

            else:
                # Insert new agent
                cursor.execute("""
                    INSERT INTO agents (
                        name, email, phone, agency_name, wellness_center_name,
                        position, contact_number, name_of_company, experience,
                        photo_path, logo_img_path, food_certification_path, is_fully_registered
                    ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,TRUE)
                """, (
                    name, email, phone, agency_name, wellness_center, position,
                    contact_number, company, experience, photo_path, logo_path, cert_path
                ))
                connection.commit()
                cursor.execute("SELECT * FROM agents WHERE email=%s", (email,))
                agent = cursor.fetchone()

        return jsonify({
            "message": "Agent registered successfully",
            "agent": agent
        }), 201

    except Exception as e:
        connection.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        connection.close()



@app.route('/api/agent-login', methods=['POST'])
def agent_login():
    data = request.get_json()
    email, password = data.get("email"), data.get("password")
    if not (email and password):
        return jsonify({"error": "Email and password required"}), 400

    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM agents WHERE email=%s", (email,))
            user = cursor.fetchone()
            if not user or password != user.get("password"):
                return jsonify({"error": "Invalid credentials"}), 401

            is_registered = all(user.get(f) not in (None, '') for f in ["wellness_center_name", "position", "name_of_company"])
            return jsonify({"message": "Login successful", "agent": {"id": user["id"], "name": user["name"], "email": user["email"], "isFullyRegistered": is_registered}}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

@app.route('/api/complete-registration', methods=['POST'])
def complete_registration():
    try:
        data = request.get_json()
        agent_id = data.get("agent_id")
        phone = data.get("phone")
        address = data.get("address")

        connection = get_db_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE agents 
                    SET phone=%s, address=%s, is_fully_registered=TRUE
                    WHERE id=%s
                """, (phone, address, agent_id))
                connection.commit()

            return jsonify({"message": "Registration completed"}), 200
        finally:
            connection.close()

    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route('/api/google-login', methods=['POST'])
def google_login():
    try:
        data = request.get_json()
        token = data.get("token")
        email=data.get('email')
        if not token:
            return jsonify({"error": "Missing Google token"}), 400

        # ✅ Verify token with Google
        try:
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request())
            email = idinfo.get("email")
            name = idinfo.get("name")
            picture = idinfo.get("picture")
        except Exception:
            return jsonify({"error": "Invalid Google token"}), 401

        connection = get_db_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM agents WHERE email=%s", (email,))
                user = cursor.fetchone()

                if not user:
                    # Auto-register new Google user
                    cursor.execute("""
                        INSERT INTO agents (name, email, photo_path,auth_provider,is_fully_registered)
                        VALUES (%s, %s, %s,'google',FALSE)
                    """, (name, email, picture))
                    connection.commit()
                    agent_id = cursor.lastrowid
                    cursor.execute("SELECT * FROM agents WHERE id=%s", (agent_id,))
                    user = cursor.fetchone()

            # ✅ Issue JWT
            payload = {
                "id": user["id"],
                "email": user["email"],
                "name": user["name"],
                "exp": datetime.now(timezone.utc) + timedelta(hours=24)
            }
            token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
                    # After user is fetched or created
            is_registered = user.get("is_fully_registered", False)

            return jsonify({
                "message": "Google login successful",
                "agent": {
                    "id": user["id"],
                    "name": user["name"],
                    "email": user["email"],
                    "photo": user.get("photo_path"),
                    "isFullyRegistered": is_registered
                },
                "accessToken": token
            }), 200

        finally:
            connection.close()

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Google login failed", "details": str(e)}), 500

# thisis getting oll data report for agents
@app.route('/api/reports', methods=['GET'])
def get_all_reports():
    # Optional: get agent id from query params or auth token to filter reports
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT * FROM body_analysis_reports ORDER BY report_date DESC
            """)
            reports = cursor.fetchall()
        return jsonify({"reports": reports}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()


# --- Agent Profile CRUD and Photo Upload ---

def save_uploaded_file(field_name):
    if field_name in request.files:
        file = request.files[field_name]
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return filename
    return None

@app.route('/api/agent/<int:agent_id>', methods=['GET'])
def get_agent(agent_id):
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM agents_profile WHERE id=%s", (agent_id,))
            agent = cursor.fetchone()
        conn.close()
        if agent:
            return jsonify(agent), 200
        else:
            return jsonify({"error": "Agent not found"}), 404
    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch agent"}), 500

@app.route('/api/agent/<int:agent_id>', methods=['PUT'])
def update_agent(agent_id):
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            data = request.form.to_dict()
            photo_path = save_uploaded_file('photo')

            fields = []
            values = []
            allowed_fields = [
                'name', 'email', 'phone', 'agency_name', 'wellness_center_name', 'position',
                'contact_number', 'name_of_company', 'experience', 'address', 'specialization',
                'consultation_hours', 'languages', 'facebook', 'twitter', 'instagram', 'linkedin', 'verified'
            ]
            for field in allowed_fields:
                if field in data:
                    fields.append(f"{field} = %s")
                    values.append(data[field])
            if photo_path:
                fields.append("photo_path = %s")
                values.append(photo_path)

            if not fields:
                return jsonify({"error": "No data to update"}), 400

            values.append(agent_id)
            sql = f"UPDATE agents_profile SET {', '.join(fields)} WHERE id = %s"
            cursor.execute(sql, tuple(values))
            conn.commit()
        conn.close()
        return jsonify({"message": "Agent updated successfully"}), 200
    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Failed to update agent"}), 500

@app.route('/api/agent', methods=['POST'])
def create_agent():
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            data = request.form.to_dict()
            photo_path = save_uploaded_file('photo')

            columns = []
            placeholders = []
            values = []
            allowed_fields = [
                'name', 'email', 'phone', 'agency_name', 'wellness_center_name', 'position',
                'contact_number', 'name_of_company', 'experience', 'address', 'specialization',
                'consultation_hours', 'languages', 'facebook', 'twitter', 'instagram', 'linkedin', 'verified'
            ]
            for field in allowed_fields:
                if field in data:
                    columns.append(field)
                    placeholders.append('%s')
                    values.append(data[field])
            if photo_path:
                columns.append('photo_path')
                placeholders.append('%s')
                values.append(photo_path)

            if not columns:
                return jsonify({"error": "No data provided"}), 400

            sql = f"INSERT INTO agents_profile ({', '.join(columns)}) VALUES ({', '.join(placeholders)})"
            cursor.execute(sql, tuple(values))
            conn.commit()
            new_id = cursor.lastrowid
        conn.close()
        return jsonify({"message": "Agent created successfully", "id": new_id}), 201
    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Failed to create agent"}), 500

@app.route('/api/agent/<int:agent_id>', methods=['DELETE'])
def delete_agent(agent_id):
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT photo_path FROM agents_profile WHERE id = %s", (agent_id,))
            agent = cursor.fetchone()
            if not agent:
                return jsonify({"error": "Agent not found"}), 404
            photo_path = agent.get('photo_path')
            if photo_path:
                photo_file = os.path.join(app.config['UPLOAD_FOLDER'], photo_path)
                if os.path.exists(photo_file):
                    os.remove(photo_file)

            cursor.execute("DELETE FROM agents_profile WHERE id = %s", (agent_id,))
            conn.commit()
        conn.close()
        return jsonify({"message": "Agent deleted successfully"}), 200
    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Failed to delete agent"}), 500




# =========================
# RUN APP
# =========================
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)






