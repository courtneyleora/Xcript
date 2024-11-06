from flask import Flask 
from flask_sqlalchemy import SQLAlchemy 

# Create a Flask application instance
app = Flask(__name__)

# Configure the SQLAlchemy part of the app instance
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:cocopop@localhost/user'

# Create the SQLAlchemy db instance
db = SQLAlchemy(app)


# Create an event model 
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    
    # string rep of itself
    def __repr__(self):
        return f"Event:{self.userName}"


# Define a route for the root URL
@app.route('/')
def hello():
    # Return a simple response
    return 'Hello World!'

# Run the application
if __name__ == '__main__':
    app.run()