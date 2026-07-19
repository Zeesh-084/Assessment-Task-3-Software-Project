from flask import Flask
from flask import render_template
from flask import request
from flask import redirect
import model as dbHandler
import html

app = Flask(__name__)


@app.route("/login.html", methods=["GET", "POST"])
@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = html.escape(request.form["username"])
        password = html.escape(request.form["password"])
        users = dbHandler.getUser(username, password)
        if users:
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
    return render_template("index.html", page_class="index-page")

if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0', port=5000)