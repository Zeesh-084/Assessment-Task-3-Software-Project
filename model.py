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

def getGrades(user_id):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute("""
        SELECT subject, term_1, term_2, semester_1, term_3, term_4, semester_2, ROUND((term_1 + term_2 + term_3 + term_4) / 4.0,1) AS average
        FROM grades
        WHERE user_id = ?
    """, (user_id,))


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

def insertGrade(user_id, subject, term_1, term_2, semester_1, term_3, term_4, semester_2, average):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute("""
        INSERT INTO grades (user_id, subject, term_1, term_2, semester_1, term_3, term_4, semester_2, average)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (user_id, subject, term_1, term_2, semester_1, term_3, term_4, semester_2, average))

    con.commit()
    con.close()


def getTimetable(user_id):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute("""
        SELECT subject, teacher, rooms
        FROM timetable
        WHERE user_id = ?
    """, (user_id,))

    rows = cur.fetchall()
    con.close()

    return rows

def getGoals(user_id):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute("""
        SELECT goal, progress_goal
        FROM goals
        WHERE user_id = ?
    """, (user_id,))

    rows = cur.fetchall()
    con.close()

    return [
        {
            "goal": row[0],
            "completed": row[1]
        }
        for row in rows
    ]

def getTasks(user_id):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute("""
        SELECT task, progress_task
        FROM tasks
        WHERE user_id = ?
    """, (user_id,))

    rows = cur.fetchall()
    con.close()

    return [
        {
            "task": row[0],
            "progress_task": row[1]
        }
        for row in rows
    ]

def getEvents(user_id):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute("""
        SELECT event_date, event_time, event_repeat, event_deadline, event_detail
        FROM events
        WHERE user_id = ?
    """, (user_id,))

    rows = cur.fetchall()
    con.close()

    return [
        {
            "event_date": row[0],
            "event_time": row[1],
            "event_repeat": row[2],
            "event_deadline": row[3],
            "event_detail": row[4],
        }
        for row in rows
    ]


def getSchedule(user_id):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute("""
        SELECT schedule_day, schedule_time_start, schedule_time_end, schedule_colour, schedule_detail
        FROM schedule
        WHERE user_id = ?
    """, (user_id,))

    rows = cur.fetchall()
    con.close()

    return [
        {
            "schedule_day": row[0],
            "schedule_time_start": row[1],
            "schedule_time_end": row[2],
            "schedule_colour": row[3],
            "schedule_detail": row[4],
        }
        for row in rows
    ]