import sqlite3 as sql


def insertUser(username, password, email):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()
    cur.execute(
        "INSERT INTO users (username,password,email) VALUES (?,?,?)",
        (username, password, email),
    )
    con.commit()
    con.close()

def getUser(username, password):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()
    cur.execute(
        "SELECT * FROM users WHERE username=? AND password=?",
        (username, password)
    )
    user = cur.fetchone()
    con.close()
    return user

def getGrades(username):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute("""
        SELECT subject, term_1, term_2, semester_1, term_3, term_4, semester_2, average
        FROM grades
        WHERE username = ?
    """, (username,))

    rows = cur.fetchall()
    con.close()

    return [
        {
            "subject": row[0],
            "term_1": row[1],
            "term_2": row[2],
            "semester_1": row[3],
            "term_3": row[4],
            "term_4": row[5],
            "semester_2": row[6],
            "average": row[7]
        }
        for row in rows
    ]
