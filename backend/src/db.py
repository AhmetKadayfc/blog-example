import psycopg2
from psycopg2.extras import RealDictCursor
from .config import Config

def get_db_connection():
    conn = psycopg2.connect(Config.DB_URL)
    return conn

def execute_query(query, params=None, fetch_one=False, fetch_all=False, commit=False):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    result = None
    try:
        cur.execute(query, params)
        if commit:
            conn.commit()
        if fetch_one:
            result = cur.fetchone()
        elif fetch_all:
            result = cur.fetchall()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
        conn.close()
    return result
