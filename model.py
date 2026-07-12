import sqlite3 as sql

def insertUser(username, password):
    conn = sql.connect('../database.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
    conn.commit()
    conn.close()

def retrieveUsers():
    conn = sql.connect('../database.db')
    cursor = conn.cursor()
    cursor.execute("SELECT username, password FROM users")
    users = cursor.fetchall()
    conn.close()
    return users