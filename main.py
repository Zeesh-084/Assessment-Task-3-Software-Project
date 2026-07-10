from flask import Flask
from flask import render_template
from flask import request
from flask import redirect
import model as dbHandler

app = Flask(__name__)

@app.route('login.html', methods=['GET', 'POST'])
@app.route('/', methods=['POST', 'GET'])
def login():
  return render_template('login.html')

if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0', port=5000)