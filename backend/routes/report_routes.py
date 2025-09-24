# # routes/report_routes.py
# from flask import Blueprint, request, jsonify
# from utils.db import get_db_connection
# import datetime

# report_bp = Blueprint("report_bp", __name__)

# @report_bp.route("/api/submit-report", methods=["POST", "OPTIONS"])
# def submit_report():
#     if request.method == "OPTIONS":
#         return jsonify({}), 200

#     if not request.is_json:
#         return jsonify({"error": "Request must be JSON"}), 400

#     body = request.get_json()
#     form1 = body.get("form1", {})
#     form2 = body.get("form2", {})
#     form3 = body.get("form3", {})
#     # merge
#     data = { **form1, **form2, **form3 }

#     client_name = data.get("name")
#     client_mobile = data.get("mobile")
#     agent_id = data.get("agent_id")  # optional: include agent_id from frontend if available

#     if not client_name or not client_mobile:
#         return jsonify({"error": "email and password required"}), 400

#     conn = None
#     try:
#         conn = get_db_connection()
#         cursor = conn.cursor()
#         sql = """
#         INSERT INTO body_analysis_reports (
#             agent_id, client_name, client_mobile, village, age, height, report_date, dob, client_email,
#             gender, weight, previous_weight, weight_change, ideal_weight, extra_weight, less_weight,
#             body_fat, visceral_fat, resting_metabolism, bmi, body_age,
#             whole_body_sub_fat, trunk_sub_fat, arm_sub_fat, leg_sub_fat,
#             skeletal_muscle, trunk_muscle, arms_muscle, legs_muscle, created_at
#         ) VALUES (
#             %s, %s, %s, %s, %s, %s, %s, %s, %s,
#             %s, %s, %s, %s, %s, %s, %s,
#             %s, %s, %s, %s, %s,
#             %s, %s, %s, %s,
#             %s, %s, %s, %s, %s
#         )
#         """
#         now = datetime.datetime.utcnow()
#         values = (
#             agent_id,
#             client_name,
#             client_mobile,
#             data.get("village"),
#             _to_int(data.get("age")),
#             _to_float(data.get("height")),
#             data.get("date") or now,
#             data.get("dob"),
#             data.get("email"),
#             data.get("gender"),
#             _to_float(data.get("weight")),
#             _to_float(data.get("previousWeight")),
#             _to_float(data.get("weightChange")),
#             _to_float(data.get("idealWeight")),
#             _to_float(data.get("extra")),
#             _to_float(data.get("less")),
#             _to_float(data.get("bodyFat")),
#             _to_float(data.get("visceralFat")),
#             _to_int(data.get("restingMetabolism")),
#             _to_float(data.get("bmi")),
#             _to_int(data.get("bodyAge")),
#             _to_float(data.get("wholeBodySubFat")),
#             _to_float(data.get("trunkSubFat")),
#             _to_float(data.get("armSubFat")),
#             _to_float(data.get("legSubFat")),
#             _to_float(data.get("skeletalMuscle")),
#             _to_float(data.get("trunkMuscle")),
#             _to_float(data.get("armsMuscle")),
#             _to_float(data.get("legsMuscle")),
#             now
#         )
#         cursor.execute(sql, values)
#         conn.commit()
#         return jsonify({"message": "Report saved", "reportId": cursor.lastrowid}), 201

#     except Exception as e:
#         if conn:
#             conn.rollback()
#         return jsonify({"error": "Failed to submit report", "details": str(e)}), 500
#     finally:
#         if conn:
#             conn.close()

# def _to_int(v):
#     try:
#         return int(v) if v is not None and v != "" else None
#     except:
#         return None

# def _to_float(v):
#     try:
#         return float(v) if v is not None and v != "" else None
#     except:
#         return None
