import html
import os
from flask import Flask, render_template, request, redirect, session
from flask_wtf.csrf import CSRFProtect
import model as dbHandler
import jsonify
import base64


app = Flask(__name__)
app.config["SECRET_KEY"] = "my-super-secret-key"
csrf = CSRFProtect(app)


@app.route("/login", methods=["GET", "POST"])
@app.route("/", methods=["GET", "POST"])
def login():
    error = None
    if request.method == "POST":
        username = html.escape(request.form["username"])
        password = html.escape(request.form["password"])
        users = dbHandler.getUser(username, password)

        if users:
            session["user_id"] = users[0]
            session["username"] =users[1]
            return redirect("/index")
        else:
             error="Invalid username or password"

    return render_template("login.html", page_class="login-page", error=error)


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        username = html.escape(request.form["username"])
        password = html.escape(request.form["password"])
        email = html.escape(request.form.get("email"))

        dbHandler.insertUser(username, password, email)
        return redirect("/login")

    return render_template("signup.html", page_class="signup-page")


@app.route("/index")
def index():
    user_id = session.get("user_id")
    username = session.get("username")

    # Load all homepage data
    grades = dbHandler.getGrades(user_id)
    subjects, weekA, weekB = dbHandler.getTimetable(user_id)
    goals = dbHandler.getGoals(user_id)
    tasks = dbHandler.getTasks(user_id)
    events = dbHandler.getEvents(user_id)
    schedule = dbHandler.getSchedule(user_id)

    # Build timetable preview for homepage
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    periods = ["BeforeSchool", "P1", "P2", "P3", "P4", "AfterSchool"]

    # Create empty preview tables
    WeekA_preview = {day: {p: "" for p in periods} for day in days}
    WeekB_preview = {day: {p: "" for p in periods} for day in days}

    # Fill preview using saved timetable grid
    for day in days:
        for period in periods:
            WeekA_preview[day][period] = weekA.get(day, {}).get(period, "")
            WeekB_preview[day][period] = weekB.get(day, {}).get(period, "")

    return render_template(
        "index.html",
        page_class="home-page",
        user_id=user_id,
        username=username,
        grades=grades,
        goals=goals,
        tasks=tasks,
        timetable=subjects,   
        events=events,
        weekA=WeekA_preview,
        weekB=WeekB_preview,
        schedule=schedule
    )


@app.route("/save_goal", methods=["POST"])
def save_goal():

    user_id = session.get("user_id")

    goals_id = request.form.get("goals_id")
    goal = request.form.get("goal")
    progress_goal = request.form.get("progress_goal")


    if goals_id:
        if goal is not None and progress_goal is not None:
            dbHandler.updateGoal( user_id, goals_id, goal, progress_goal)
        elif progress_goal is not None:
            dbHandler.updateGoalProgress(user_id, goals_id, progress_goal)
        return "updated"
    if goal:
        dbHandler.insertGoal(user_id, goal, progress_goal)
        return "created"

    return "Invalid request", 400

@app.route("/delete_goal/<int:goals_id>", methods=["POST"])
def delete_goal(goals_id):
    user_id = session.get("user_id")
    dbHandler.deleteGoal(
        user_id,
        goals_id
    )
    return "OK"

@app.route("/save_task", methods=["POST"])
def save_task():

    user_id = session.get("user_id")

    tasks_id = request.form.get("tasks_id")
    task = request.form.get("task")
    progress_task = request.form.get("progress_task")

    if tasks_id:
        if task is not None and progress_task is not None:
            dbHandler.updateTask(user_id, tasks_id, task, progress_task)
        elif progress_task is not None:
            dbHandler.updateTaskProgress(user_id, tasks_id, progress_task)
        return "updated"
    if task:
        dbHandler.insertTask(user_id, task, progress_task)
        return "created"

    return "Invalid request", 400

@app.route("/delete_task/<int:tasks_id>", methods=["POST"])
def delete_task(tasks_id):
    user_id = session.get("user_id")
    dbHandler.deleteTask(
        user_id,
        tasks_id
    )
    return "OK"

@app.route("/grade_table", methods=["GET"])
def grade_table():
    user_id = session.get("user_id")
    grades = dbHandler.getGrades(user_id)
    return render_template("grade_table.html", grades=grades)

@app.route("/save_grades", methods=["POST"])
def save_grades():
    user_id = session.get("user_id")
    data = request.get_json()

    for grade in data:
        grades_id = grade.get("grades_id")

        if grades_id:
            dbHandler.updateGrade(
                user_id,
                grades_id,
                grade["subject"],
                grade["term_1"],
                grade["term_2"],
                grade["semester_1"],
                grade["term_3"],
                grade["term_4"],
                grade["semester_2"],
                grade["average"]
            )

        else:
            dbHandler.insertGrade(
                user_id,
                grade["subject"],     
                grade["term_1"],
                grade["term_2"],
                grade["semester_1"],
                grade["term_3"],
                grade["term_4"],
                grade["semester_2"],
                grade["average"]
            )

    return jsonify({"success": True})


@app.route("/delete_grade/<int:grades_id>", methods=["POST"])
def delete_grade(grades_id):
    user_id = session.get("user_id")
    dbHandler.deleteGrade(user_id, grades_id)
    return "OK"

@app.route("/timetable", methods=["GET"])
def timetable_page():
    user_id = session.get("user_id")
    subjects, weekA, weekB = dbHandler.getTimetable(user_id)
    return render_template(
        "timetable.html",
        timetable=subjects,
        weekA=weekA,
        weekB=weekB
    )


@app.route("/save_timetable", methods=["POST"])
def save_timetable():
    user_id = session.get("user_id")
    data = request.get_json()

    subjects = data["subjects"]
    weekA = data["weekA"]
    weekB = data["weekB"]

    # Save subjects
    for row in subjects:
        timetable_id = row.get("timetable_id")

        if timetable_id:
            dbHandler.updateSubject(
                timetable_id,
                row["subject"],
                row["teacher"],
                row["rooms"]
            )
        else:
            dbHandler.insertSubject(
                user_id,
                row["subject"],
                row["teacher"],
                row["rooms"]
            )

    # Save timetable grid
    dbHandler.saveWeekGrid(user_id, weekA, weekB)

    return jsonify({"success": True})

@app.route("/delete_subject/<int:timetable_id>", methods=["POST"])
def delete_subject(timetable_id):
    dbHandler.deleteSubject(timetable_id)
    return "OK"


@app.route("/calendar")
def calendar_page():
    user_id = session.get("user_id")
    events = dbHandler.getEvents(user_id)

    return render_template("calendar.html", events=events)


@app.route("/save_event", methods=["POST"])
def save_event():
    user_id = session.get("user_id")

    event_detail = request.form["event_detail"]
    event_date = request.form["event_date"]
    event_time = request.form["event_time"]
    event_repeat = request.form["event_repeat"]
    event_deadline = request.form["event_deadline"]

    source = request.form.get("source", "calendar")

    dbHandler.insertEvent(
        user_id,
        event_date,
        event_time,
        event_repeat,
        event_deadline,
        event_detail
    )

    if source == "index":
        return redirect("/index")
    return redirect("/calendar")


@app.route("/update_event", methods=["POST"])
def update_event():
    user_id = session.get("user_id")

    event_id = request.form.get("event_id")
    event_detail = request.form.get("event_detail")
    event_date = request.form.get("event_date")
    event_time = request.form.get("event_time")
    event_repeat = request.form.get("event_repeat")
    event_deadline = request.form.get("event_deadline")

    dbHandler.updateEvent(
        event_id,
        event_date,
        event_time,
        event_repeat,
        event_deadline,
        event_detail
    )

    return redirect("/calendar")


@app.route("/delete_event/<int:event_id>", methods=["POST"])
def delete_event(event_id):
    dbHandler.deleteEvent(event_id)
    return "OK", 200

@app.route("/schedule")
def schedule():
    user_id = session.get("user_id")
    schedule_rows = dbHandler.getSchedule(user_id)
    return render_template("schedule.html", schedule=schedule_rows)

@app.route("/save_schedule", methods=["POST"])
def save_schedule():
    user_id = session.get("user_id")

    day = request.form["schedule_day"]
    start = request.form["schedule_time_start"]
    end = request.form["schedule_time_end"]
    colour = request.form["schedule_colour"]
    detail = request.form["schedule_detail"]
    description = request.form["schedule_description"]

    source = request.form.get("source", "schedule")

    dbHandler.insertSchedule(user_id, day, start, end, colour, detail)

    if source == "index":
        return redirect("/index")
    return redirect("/schedule")

@app.route("/update_schedule", methods=["POST"])
def update_schedule():
    schedule_id = request.form["schedule_id"]
    day = request.form["schedule_day"]
    start = request.form["schedule_time_start"]
    end = request.form["schedule_time_end"]
    colour = request.form["schedule_colour"]
    detail = request.form["schedule_detail"]
    description = request.form["schedule_description"]

    source = request.form.get("source", "schedule")

    dbHandler.updateSchedule(schedule_id, day, start, end, colour, detail)

    if source == "index":
        return redirect("/index")
    return redirect("/schedule")


@app.route("/delete_schedule/<int:schedule_id>", methods=["POST"])
def delete_schedule(schedule_id):
    user_id = session.get("user_id")

    dbHandler.deleteSchedule(schedule_id, user_id)
    return "OK", 200


@app.route("/settings")
def settings():
    user_id = session.get("user_id")
    if not user_id:
        return redirect("/login")

    user = dbHandler.getUserById(user_id)
    settings = dbHandler.getSettings(user_id)

    return render_template(
        "setting.html",
        user=user,
        settings=settings,
        theme=settings["theme"]
    )


@app.route("/upload_profile_picture", methods=["POST"])
def upload_profile_picture():
    user_id = session.get("user_id")
    file = request.files.get("profile_picture")

    if not user_id or not file:
        return redirect("/settings")

    picture_data = base64.b64encode(file.read()).decode("utf-8")
    dbHandler.updateProfilePicture(user_id, picture_data)
    return redirect("/settings")

@app.route("/remove_profile_picture", methods=["POST"])
def remove_profile_picture():
    user_id = session.get("user_id")
    if not user_id:
        return redirect("/login")

    dbHandler.removeProfilePicture(user_id)
    return redirect("/settings")

@app.route("/update_user_info", methods=["POST"])
def update_user_info():
    user_id = session.get("user_id")
    if not user_id:
        return redirect("/login")

    display_name = request.form["display_name"]
    email = request.form["email"]
    dbHandler.updateUserInfo(user_id, display_name, email)
    return redirect("/settings")

@app.route("/change_password", methods=["POST"])
def change_password():
    user_id = session.get("user_id")
    if not user_id:
        return redirect("/login")

    old = request.form["old_password"]
    new = request.form["new_password"]
    dbHandler.changePassword(user_id, old, new)
    return redirect("/settings")

@app.route("/update_misc_settings", methods=["POST"])
def update_misc_settings():
    theme = request.form["theme"]
    time_format = request.form["time_format"]
    dbHandler.updateMiscSettings(session["user_id"], theme, time_format)
    return redirect("/settings")



@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return redirect("/login")

@app.route("/delete_account", methods=["POST"])
def delete_account():
    user_id = session.get("user_id")
    if user_id:
        dbHandler.deleteAccount(user_id)
    session.clear()
    return redirect("/signup")


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)