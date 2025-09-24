# # utils/db.py
# from mysql.connector import connect, Error
# from config import MYSQL_CONFIG

# def get_db_connection():
#     """Return a new mysql.connector connection. Caller should close it."""
#     try:
#         conn = connect(**MYSQL_CONFIG)
#         return conn
#     except Error as e:
#         raise
