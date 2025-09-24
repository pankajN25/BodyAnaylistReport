# # routes/agent_routes.py
# from flask import Blueprint, request, jsonify
# from utils.db import get_db_connection
# from utils.file_upload import allowed_file, save_uploaded_file
# import os

# agent_bp = Blueprint("agent_bp", __name__)

# @agent_bp.route("/api/register", methods=["POST", "OPTIONS"])
# def register():
#     # handle preflight
#     if request.method == "OPTIONS":
#         return jsonify({}), 200

#     # Expecting FormData (files + fields)
#     form = request.form
#     files = request.files

#     email = (form.get("email") or "").strip()
#     firstName = form.get("firstName") or ""
#     lastName = form.get("lastName") or ""
#     name = form.get("name") or f"{firstName} {lastName}".strip()

#     agency_name = form.get("agencyName") or ""
#     wellness_center_name = form.get("wellnessCenterName") or ""
#     position = form.get("position") or ""
#     contact_number = form.get("contactNumber") or ""
#     name_of_company = form.get("nameOfCompany") or ""
#     experience = form.get("experience") or ""

#     # required check (as per your React required fields)
#     if not (name and email and agency_name and wellness_center_name and position and name_of_company and experience):
#         return jsonify({"error": "Missing required fields. Please fill all required fields"}), 400

#     # handle files
#     photo_path = None
#     logo_img_path = None
#     food_cert_path = None

#     if "photo" in files:
#         photo = files.get("photo")
#         if photo and allowed_file(photo.filename):
#             photo_path = save_uploaded_file(photo, subfolder="agents")
#         elif photo and photo.filename != "":
#             return jsonify({"error": "Invalid photo file type"}), 400

#     if "logoImg" in files:
#         logo = files.get("logoImg")
#         if logo and allowed_file(logo.filename):
#             logo_img_path = save_uploaded_file(logo, subfolder="agents")
#         elif logo and logo.filename != "":
#             return jsonify({"error": "Invalid logo file type"}), 400

#     if "foodCertification" in files:
#         cert = files.get("foodCertification")
#         if cert and allowed_file(cert.filename):
#             food_cert_path = save_uploaded_file(cert, subfolder="agents")
#         elif cert and cert.filename != "":
#             return jsonify({"error": "Invalid certification file type"}), 400

#     conn = None
#     try:
#         conn = get_db_connection()
#         cursor = conn.cursor(dictionary=True)

#         # check existing agent by email
#         cursor.execute("SELECT id FROM agents WHERE email=%s", (email,))
#         row = cursor.fetchone()

#         if row:
#             agent_id = row["id"]
#             # update existing agent (only update provided fields)
#             sql = """
#             UPDATE agents
#             SET name=%s, phone=%s, agency_name=%s,
#                 wellness_center_name=%s, position=%s, contact_number=%s,
#                 name_of_company=%s, experience=%s,
#                 photo_path=%s, logo_img_path=%s, food_certification_path=%s
#             WHERE id=%s
#             """
#             values = (
#                 name, form.get("phone"), agency_name,
#                 wellness_center_name, position, contact_number,
#                 name_of_company, experience,
#                 photo_path, logo_img_path, food_cert_path,
#                 agent_id
#             )
#             cursor.execute(sql, values)
#             conn.commit()
#             return jsonify({"message": "Agent profile updated", "agent_id": agent_id}), 200
#         else:
#             # create new agent
#             sql = """
#             INSERT INTO agents (
#                 name, email, phone, agency_name,
#                 wellness_center_name, position, contact_number,
#                 name_of_company, experience, photo_path, logo_img_path, food_certification_path
#             ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
#             """
#             values = (
#                 name, email, form.get("phone"), agency_name,
#                 wellness_center_name, position, contact_number,
#                 name_of_company, experience, photo_path, logo_img_path, food_cert_path
#             )
#             cursor.execute(sql, values)
#             conn.commit()
#             return jsonify({"message": "Agent registered", "agent_id": cursor.lastrowid}), 201

#     except Exception as e:
#         if conn:
#             conn.rollback()
#         return jsonify({"error": "Server error", "details": str(e)}), 500
#     finally:
#         if conn:
#             conn.close()
