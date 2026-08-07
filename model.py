import sqlite3 as sql
import json


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
    con.row_factory = sql.Row
    cur = con.cursor()

    cur.execute("""
        SELECT * FROM grades
        WHERE user_id = ?
        ORDER BY grades_id ASC
    """, (user_id,))


    rows = cur.fetchall()
    con.close()
    return rows

def insertGrade(user_id, subject, term_1, term_2, semester_1, term_3, term_4, semester_2, average):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute("""
        INSERT INTO grades (user_id, subject, term_1, term_2, semester_1, term_3, term_4, semester_2, average)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (user_id, subject, term_1, term_2, semester_1, term_3, term_4, semester_2, average))

    con.commit()
    con.close()

def updateGrade(user_id, grades_id, subject, term_1, term_2, semester_1, term_3, term_4, semester_2, average):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute("""
        UPDATE grades
        SET subject=?, term_1=?, term_2=?, semester_1=?,
            term_3=?, term_4=?, semester_2=?, average=?
        WHERE grades_id=? AND user_id=?
    """, (
        subject, term_1, term_2, semester_1,
        term_3, term_4, semester_2, average,
        grades_id, user_id
    ))

    con.commit()
    con.close()


def deleteGrade(user_id, grades_id):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute("""
        DELETE FROM grades
        WHERE grades_id = ? AND user_id = ?
    """, (grades_id, user_id))

    con.commit()
    con.close()


def getTimetable(user_id):

    con = sql.connect("database_files/database.db")
    con.row_factory = sql.Row
    cur = con.cursor()

    cur.execute("""
        SELECT *
        FROM timetable
        WHERE user_id=?
    """,(user_id,))
    subjects = cur.fetchall()

    cur.execute("""
        SELECT weekA, weekB
        FROM timetable_grid
        WHERE user_id=?
    """,(user_id,))
    grid = cur.fetchone()

    if grid:
        weekA = json.loads(grid["weekA"] or "{}")
        weekB = json.loads(grid["weekB"] or "{}")
    else:
        weekA = {}
        weekB = {}

    con.close()
    return subjects, weekA, weekB


def insertSubject(user_id, subject, teacher, rooms):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute("""
        INSERT INTO timetable (user_id, subject, teacher, rooms)
        VALUES (?, ?, ?, ?)
    """, (user_id, subject, teacher, rooms))

    con.commit()
    con.close()

def updateSubject(timetable_id, subject, teacher, rooms):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute("""
        UPDATE timetable
        SET subject=?, teacher=?, rooms=?
        WHERE timetable_id=?
    """, (subject, teacher, rooms, timetable_id))

    con.commit()
    con.close()

def deleteSubject(timetable_id):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute("""
        DELETE FROM timetable
        WHERE timetable_id=?
    """, (timetable_id,))

    con.commit()
    con.close()

def saveWeekGrid(user_id, weekA, weekB):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    # Check if row exists
    cur.execute("SELECT grid_id FROM timetable_grid WHERE user_id=?", (user_id,))
    row = cur.fetchone()

    if row:
        # Update existing row
        cur.execute("""
            UPDATE timetable_grid
            SET weekA=?, weekB=?
            WHERE user_id=?
        """, (json.dumps(weekA), json.dumps(weekB), user_id))
    else:
        # Insert new row
        cur.execute("""
            INSERT INTO timetable_grid (user_id, weekA, weekB)
            VALUES (?, ?, ?)
        """, (user_id, json.dumps(weekA), json.dumps(weekB)))

    con.commit()
    con.close()


def getGoals(user_id):
    con = sql.connect("database_files/database.db")
    con.row_factory = sql.Row
    cur = con.cursor()

    cur.execute(
        "SELECT * FROM goals WHERE user_id=?", (user_id,)
    )
    rows = cur.fetchall()

    con.close()
    return rows

def insertGoal(user_id, goal, progress_goal):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute(
        "INSERT INTO goals (user_id, goal, progress_goal) VALUES (?, ?, ?)", 
        (user_id, goal, progress_goal)
    )

    con.commit()
    new_id = cur.lastrowid
    con.close()
    return new_id

def updateGoal(user_id, goals_id, goal, progress_goal):

    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute(
        """
        UPDATE goals
        SET goal=?, progress_goal=?
        WHERE goals_id=? AND user_id=?
        """,
        (
            goal,
            progress_goal,
            goals_id,
            user_id
        )
    )
    con.commit()
    con.close()

def updateGoalProgress(user_id, goals_id, progress_goal):

    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute(
        """
        UPDATE goals
        SET progress_goal=?
        WHERE goals_id=? AND user_id=?
        """,
        (
            progress_goal,
            goals_id,
            user_id
        )
    )

    con.commit()
    con.close()



def deleteGoal(user_id, goals_id):

    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute(
        """
        DELETE FROM goals
        WHERE goals_id=? AND user_id=?
        """,
        (
            goals_id,
            user_id
        )
    )

    con.commit()
    con.close()



def getTasks(user_id):
    con = sql.connect("database_files/database.db")
    con.row_factory = sql.Row
    cur = con.cursor()

    cur.execute(
        "SELECT * FROM tasks WHERE user_id=?", (user_id,)
    )
    rows = cur.fetchall()

    con.close()
    return rows


def insertTask(user_id, task, progress_task):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute(
        """
        INSERT INTO tasks (user_id, task, progress_task)
        VALUES (?, ?, ?)
        """,
        (user_id, task, progress_task)
    )

    con.commit()
    new_id = cur.lastrowid
    con.close()
    return new_id


def updateTask(user_id, tasks_id, task, progress_task):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute(
        """
        UPDATE tasks
        SET task=?, progress_task=?
        WHERE tasks_id=? AND user_id=?
        """,
        (
            task,
            progress_task,
            tasks_id,
            user_id
        )
    )

    con.commit()
    con.close()


def updateTaskProgress(user_id, tasks_id, progress_task):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute(
        """
        UPDATE tasks
        SET progress_task=?
        WHERE tasks_id=? AND user_id=?
        """,
        (
            progress_task,
            tasks_id,
            user_id
        )
    )

    con.commit()
    con.close()


def deleteTask(user_id, tasks_id):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute(
        """
        DELETE FROM tasks
        WHERE tasks_id=? AND user_id=?
        """,
        (
            tasks_id,
            user_id
        )
    )

    con.commit()
    con.close()



def getEvents(user_id):
    con = sql.connect("database_files/database.db")
    con.row_factory = sql.Row
    cur = con.cursor()

    cur.execute("""
        SELECT * FROM events
        WHERE user_id = ?
        ORDER BY event_date ASC
    """, (user_id,))

    rows = cur.fetchall()
    con.close()
    return [dict(row) for row in rows]


def insertEvent(user_id, event_date, event_time, event_repeat, event_deadline, event_detail):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute("""
        INSERT INTO events (user_id, event_date, event_time, event_repeat, event_deadline, event_detail)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (user_id, event_date, event_time, event_repeat, event_deadline, event_detail))

    con.commit()
    con.close()
    
def updateEvent(event_id, event_date, event_time, event_repeat, event_deadline, event_detail):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute("""
        UPDATE events
        SET event_date=?, event_time=?, event_repeat=?, event_deadline=?, event_detail=?
        WHERE event_id=?
    """, (event_date, event_time, event_repeat, event_deadline, event_detail, event_id))

    con.commit()
    con.close()


def deleteEvent(event_id):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute("DELETE FROM events WHERE event_id=?", (event_id,))
    con.commit()
    con.close()



def getSchedule(user_id):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()
    cur.execute("""
        SELECT schedule_id, user_id, schedule_day, schedule_time_start,
               schedule_time_end, schedule_colour, schedule_detail
        FROM schedule
        WHERE user_id = ?
    """, (user_id,))
    rows = cur.fetchall()
    con.close()

    return [
        {
            "schedule_id": r[0],
            "user_id": r[1],
            "schedule_day": r[2],
            "schedule_time_start": r[3],
            "schedule_time_end": r[4],
            "schedule_colour": r[5],
            "schedule_detail": r[6],
        }
        for r in rows
    ]


def insertSchedule(user_id, day, start, end, colour, detail):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()
    cur.execute("""
        INSERT INTO schedule (user_id, schedule_day, schedule_time_start,
                              schedule_time_end, schedule_colour, schedule_detail)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (user_id, day, start, end, colour, detail))
    con.commit()
    con.close()


def updateSchedule(schedule_id, day, start, end, colour, detail):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()
    cur.execute("""
        UPDATE schedule
        SET schedule_day = ?, schedule_time_start = ?, schedule_time_end = ?,
            schedule_colour = ?, schedule_detail = ?
        WHERE schedule_id = ?
    """, (day, start, end, colour, detail, schedule_id))
    con.commit()
    con.close()


def deleteSchedule(schedule_id, user_id):
    con = sql.connect("database_files/database.db")
    cur = con.cursor()

    cur.execute("""
        DELETE FROM schedule
        WHERE schedule_id = ? AND user_id = ?
    """, (schedule_id, user_id))

    con.commit()
    con.close()


import sqlite3 as sql
import base64

DB_PATH = "database_files/database.db"

def getSettings(user_id):
    con = sql.connect(DB_PATH)
    cur = con.cursor()
    cur.execute("""
        SELECT profile_picture, activate_2fa, theme, time_format
        FROM setting
        WHERE user_id=?
    """, (user_id,))
    row = cur.fetchone()
    con.close()

    if row is None:
        return {
            "profile_picture": None,
            "activate_2fa": 0,
            "theme": "light",
            "time_format": "12"
        }

    return {
        "profile_picture": row[0],
        "activate_2fa": row[1],
        "theme": row[2],
        "time_format": row[3]
    }

def createDefaultSettings(user_id):
    con = sql.connect(DB_PATH)
    cur = con.cursor()
    cur.execute("""
        INSERT INTO setting (user_id, profile_picture, activate_2fa, theme, time_format)
        VALUES (?, NULL, 0, 'light', '12')
    """, (user_id,))
    con.commit()
    con.close()

def updateProfilePicture(user_id, picture_data):
    con = sql.connect(DB_PATH)
    cur = con.cursor()
    cur.execute("""
        UPDATE setting
        SET profile_picture=?
        WHERE user_id=?
    """, (picture_data, user_id))
    con.commit()
    con.close()

def removeProfilePicture(user_id):
    con = sql.connect(DB_PATH)
    cur = con.cursor()
    cur.execute("""
        UPDATE setting
        SET profile_picture=NULL
        WHERE user_id=?
    """, (user_id,))
    con.commit()
    con.close()

def updateUserInfo(user_id, display_name, email):
    con = sql.connect(DB_PATH)
    cur = con.cursor()
    cur.execute("""
        UPDATE users
        SET username=?, email=?
        WHERE user_id=?
    """, (display_name, email, user_id))
    con.commit()
    con.close()

def changePassword(user_id, old, new):
    con = sql.connect(DB_PATH)
    cur = con.cursor()
    cur.execute("SELECT password FROM users WHERE user_id=?", (user_id,))
    row = cur.fetchone()
    if row is None:
        con.close()
        return False

    current = row[0]
    if current != old:
        con.close()
        return False

    cur.execute("""
        UPDATE users
        SET password=?
        WHERE user_id=?
    """, (new, user_id))
    con.commit()
    con.close()
    return True

def updateMiscSettings(user_id, theme, time_format):
    con = sql.connect(DB_PATH)
    cur = con.cursor()
    cur.execute("""
        UPDATE setting
        SET theme=?, time_format=?
        WHERE user_id=?
    """, (theme, time_format, user_id))
    con.commit()
    con.close()


def deleteAccount(user_id):
    con = sql.connect(DB_PATH)
    cur = con.cursor()
    cur.execute("DELETE FROM users WHERE user_id=?", (user_id,))
    cur.execute("DELETE FROM setting WHERE user_id=?", (user_id,))
    con.commit()
    con.close()

def getUserById(user_id):
    con = sql.connect(DB_PATH)
    cur = con.cursor()
    cur.execute("""
        SELECT user_id, username, email
        FROM users
        WHERE user_id=?
    """, (user_id,))
    row = cur.fetchone()
    con.close()
    if row:
        return {
            "user_id": row[0],
            "username": row[1],
            "email": row[2]
        }
    return 