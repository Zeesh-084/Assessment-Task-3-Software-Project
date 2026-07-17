from flask import Flask
from flask import render_template
from flask import request
from flask import redirect
import model as dbHandler

app = Flask(__name__)


@app.route('/login.html', methods=['GET', 'POST'])
@app.route('/', methods=['POST', 'GET'])
def login():
  if request.method == 'POST':
    username = request.form['username']
    password = request.form['password']
    dbHandler.insertUser(username, password)
    users = dbHandler.retrieveUsers()
    return render_template('login.html', users=users)
  else:
    return render_template("login.html", page_class="login-page")

@app.route('/signup.html', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        dbHandler.insertUser(username, password, email)
        return redirect('/login.html')
    else:
        return render_template("signup.html", page_class="signup-page")

if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0', port=5000)