import sqlite3 as sql

def insertUser(username, password, email):
    conn = sql.connect('../database.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", (username, password, email))
    conn.commit()
    conn.close()

def retrieveUsers():
    conn = sql.connect('../database.db')
    cursor = conn.cursor()
    cursor.execute("SELECT username, password, email FROM users")
    users = cursor.fetchall()
    conn.close()
    return users