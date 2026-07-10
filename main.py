from flask import Flask
from flask import render_template
from flask import request
from flask import redirect
import model as dbHandler

app = Flask(__name__)

@app.route('/login.html', methods=['GET'])
@app.route('/', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if dbHandler.validate_user(username, password):
            return redirect('/dashboard.html')
        else:
            return render_template('/login.html', error='Invalid username or password')
        return render_template('/login.html')


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0')