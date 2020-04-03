import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from werkzeug.exceptions import default_exceptions, HTTPException

import logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///Resources/traffic.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
accidents = Base.classes.accidents

@app.route("/")
def index():
   
    app.logger.info('INDEX.HTML - app.logger.info')

    return render_template("index.html")

@app.route("/states")
def names():

    app.logger.info('states endpoint - app.logger.info')

    # Create session link from Python to database
    session = Session(db.engine)  

    """Return a list of states."""

    # Use Pandas to perform the sql query
    stmt = (f'''SELECT distinct a.state FROM accidents a order by 1;''')

    results = pd.read_sql_query(stmt, db.session.bind)

    session.close()

    return jsonify(results.to_dict (orient='records'))

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def handle_exception(e):
    if isinstance(e, HTTPException):
        return e
    return render_template('500.html'), 500

if __name__ == "__main__":
    app.run()