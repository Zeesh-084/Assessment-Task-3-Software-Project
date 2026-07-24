from asyncio import events
import secrets
from flask import Flask, session
from flask import render_template
from flask import request
from flask import Flask, render_template, request
from flask_wtf.csrf import CSRFProtect
from flask import redirect
import model as dbHandler
import html
import os

app = Flask(__name__)
app.secret_key = secrets.token_hex(32)
app.config['SECRET_KEY'] = 'your-secure-random-string'
csrf = CSRFProtect(app)

@app.route("/login.html", methods=["GET", "POST"])
@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = html.escape(request.form["username"])
        password = html.escape(request.form["password"])
        users = dbHandler.getUser(username, password)
        if users:
            session["username"] = username
            return redirect("/index.html")
        else:
            return render_template( "login.html", page_class="login-page", error="Invalid username or password")
    else:
        return render_template("login.html", page_class="login-page")


@app.route("/signup.html", methods=["GET", "POST"])
def signup():
      if request.method == "POST":
        username = html.escape(request.form["username"])
        password = html.escape(request.form["password"])
        email = html.escape(request.form.get("email"))
        dbHandler.insertUser(username, password, email)
        return redirect("/login.html")
      else:
        return render_template("signup.html", page_class="signup-page")

@app.route("/index.html")
def index():
    username = session.get("username")

    grades = dbHandler.getGrades(username)
    timetable = dbHandler.getTimetable(username)
    goals = dbHandler.getGoals(username)
    tasks = dbHandler.getTassks(username)
    events = dbHandler.getEvents(username)
    schedule = dbHandler.getSchedule(username)

    return render_template(
        "index.html",
        page_class="home-page",
        username=username,
        grades=grades,
        timetable=timetable,
        goals=goals,
        tasks=tasks,
        events=events,
        schedule=schedule
    )

if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0', port=5000)