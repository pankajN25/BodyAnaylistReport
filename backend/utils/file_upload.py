# # utils/file_upload.py
# import os
# from werkzeug.utils import secure_filename
# from config import UPLOAD_FOLDER

# ALLOWED_EXT = {"png", "jpg", "jpeg", "gif", "pdf"}

# def allowed_file(filename):
#     return filename and "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXT

# def save_uploaded_file(file_obj, subfolder=""):
#     """
#     Saves werkzeug FileStorage to disk, returns saved path relative to project root.
#     Returns None if file_obj is falsy.
#     """
#     if not file_obj:
#         return None
#     filename = secure_filename(file_obj.filename)
#     if filename == "":
#         return None
#     target_dir = os.path.join(UPLOAD_FOLDER, subfolder) if subfolder else UPLOAD_FOLDER
#     os.makedirs(target_dir, exist_ok=True)
#     dest = os.path.join(target_dir, filename)
#     file_obj.save(dest)
#     return dest
