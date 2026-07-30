import html
import os
from flask import Flask, render_template, request, redirect, session
from flask_wtf.csrf import CSRFProtect
import model as dbHandler

app = Flask(__name__)
app.config["SECRET_KEY"] = "my-super-secret-key"
csrf = CSRFProtect(app)

@app.after_request
def apply_csp(response):
    response.headers["Content-Security-Policy"] = (
    "default-src 'self'; "
    "script-src 'self'; "
    "style-src 'self' 'unsafe-inline'; "
    "img-src 'self' data:; "
    "connect-src 'self'; "
    "frame-ancestors 'none'; "
    "base-uri 'self'; "
    "form-action 'self'; "
    "object-src 'none'; "
    "manifest-src 'self'; "
    "worker-src 'self'; "
    "navigate-to 'self'; "
)
    return response


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

    #goals = dbHandler.getGoals(username)
    #tasks = dbHandler.getTasks(username)
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
        timetable=timetable,
        events=events,
        weekA=WeekA,
        weekB=WeekB,
        schedule=schedule
    )



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)