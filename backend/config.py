# # config.py
# from dotenv import load_dotenv
# import os

# load_dotenv()

# MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
# MYSQL_USER = os.getenv("MYSQL_USER", "root")
# MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
# MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "new_herbal_db")

# UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")
# ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

# APP_PORT = int(os.getenv("PORT", 5000))

# MYSQL_CONFIG = {
#     "host": MYSQL_HOST,
#     "user": MYSQL_USER,
#     "password": MYSQL_PASSWORD,
#     "database": MYSQL_DATABASE,
#     "auth_plugin": "mysql_native_password",
# }




# app.py file code 
# app.py
# from flask import Flask, jsonify
# from flask_cors import CORS
# from config import ALLOWED_ORIGINS, APP_PORT, UPLOAD_FOLDER
# import os

# # create upload dir
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# app = Flask(__name__)
# CORS(app, resources={r"/api/*": {"origins": ALLOWED_ORIGINS}}, supports_credentials=True)

# # register blueprints
# from routes.auth_routes import auth_bp
# from routes.agent_routes import agent_bp
# from routes.report_routes import report_bp

# app.register_blueprint(auth_bp)
# app.register_blueprint(agent_bp)
# app.register_blueprint(report_bp)

# @app.route("/api/health")
# def health():
#     return jsonify({"status": "ok"})

# if __name__ == "__main__":
#     app.run(debug=True, port=APP_PORT)