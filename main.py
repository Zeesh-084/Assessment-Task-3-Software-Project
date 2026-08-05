import html
import os
from flask import Flask, render_template, request, redirect, session
from flask_wtf.csrf import CSRFProtect
import model as dbHandler
import jinja2

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

    grades = dbHandler.getGrades(user_id)
    timetable = dbHandler.getTimetable(user_id)
    goals = dbHandler.getGoals(user_id)
    tasks = dbHandler.getTasks(user_id)
    events = dbHandler.getEvents(user_id)
    schedule = dbHandler.getSchedule(user_id)

    #timetable display
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    periods = ["BeforeSchool", "P1", "P2", "P3", "P4", "AfterSchool"]

    WeekA = {day: {p: "" for p in periods} for day in  days}
    WeekB = {day: {p: "" for p in periods} for day in  days}

    for i in range(min(25, len(timetable))):
        subject, teacher, room = timetable[i]
        day = days[i // 5]
        period = periods[i % 5]
        WeekA[day][period] = f"{subject} - {room}"

    for i in range(25, min(50, len(timetable))):
        subject, teacher, room = timetable[i]
        index = i - 25
        day = days[index // 5]
        period = periods[index % 5]
        WeekB[day][period] = f"{subject} - {room}"

    return render_template(
        "index.html",
        page_class="home-page",
        user_id=user_id,
        username=session.get("username"),
        grades=grades,
        goals=goals,
        tasks=tasks,
        timetable=timetable,
        events=events,
        weekA=WeekA,
        weekB=WeekB,
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

@app.route("/timetable", methods=["GET"])
def timetable():
    user_id = session.get("user_id")
    timetable = dbHandler.getTimetable(user_id)
    return render_template("timetable.html", timetable=timetable)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)