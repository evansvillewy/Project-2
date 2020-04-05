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
#logging.basicConfig(level=logging.DEBUG)
logging.basicConfig(level=logging.NOTSET)
logging.getLogger().disabled = True  # True, False

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

    # Use Pandas to perform the sql query
    stmt = (f'''SELECT distinct a.state FROM accidents a order by 1;''')

    results = pd.read_sql_query(stmt, db.session.bind)

    session.close()

    return jsonify(results.to_dict (orient='records'))

@app.route("/state_data/<theState>")
def state_data(theState):

    app.logger.info(f'{theState} state data endpoint - app.logger.info')

    # Create session link from Python to database
    session = Session(db.engine)  

    # Use Pandas to perform the sql query
    stmt = (f'''SELECT a.id,a.source,a.severity,a.start_time,a.street,a.side,a.city,
                a.county,a.state,a.zipcode,a.timezone,a.temperature,a.wind_chill,
                a.humidity,a.visibility,a.wind_speed,a.weather_condition,a.sunrise_sunset,
                a.lat, a.lon FROM accidents a WHERE state = '{theState}';''')

    results = pd.read_sql_query(stmt, db.session.bind)
    results = results.fillna('')
   
    session.close()

    return jsonify(results.to_dict (orient='records'))

@app.route("/state_data/hour/<theState>")
def state_hour_data(theState):

    app.logger.info(f'{theState} state data hour endpoint - app.logger.info')

    # Create session link from Python to database
    session = Session(db.engine)  

    # Use Pandas to perform the sql query
    stmt = (f'''select count(*)accident_count, substr(start_time, 12,2) hour from accidents WHERE state = '{theState}'
    group by substr(start_time, 12,2);''')
    
    results = pd.read_sql_query(stmt, db.session.bind)
    results = results.fillna('')
   
    session.close()

    return jsonify(results.to_dict (orient='records'))

@app.route("/state_data/weekday/<theState>")
def state_weekday_data(theState):

    app.logger.info(f'{theState} state data weekday endpoint - app.logger.info')

    # Create session link from Python to database
    session = Session(db.engine)  
    
    # Use Pandas to perform the sql query
    stmt = (f'''select count(*) accident_count, weekday from(SELECT strftime('%w',start_time) day_number,
        CASE strftime('%w',start_time) WHEN '0' THEN 'Sunday'
        WHEN '1' THEN 'Monday'
        WHEN '2' THEN 'Tuesday'
        WHEN '3' THEN 'Wednesday'
        WHEN '4' THEN 'Thursday'
        WHEN '5' THEN 'Friday'
        WHEN '6' THEN 'Saturday' END weekday
        FROM accidents a 
        WHERE state='{theState}')
        group by weekday
        order by day_number;''')                
    
    results = pd.read_sql_query(stmt, db.session.bind)
    
    session.close()
    
    return jsonify(results.to_dict (orient='records'))

@app.route("/state_data/count_by_day/<theState>")
def state_count_by_day(theState):

    app.logger.info(f'{theState} state data weekday endpoint - app.logger.info')
    
    # Create session link from Python to database
    session = Session(db.engine)  
    
    # Use Pandas to perform the sql query
    stmt = (f'''SELECT strftime('%d-%m-%Y',start_time) accident_date,count(*) accident_count
        FROM accidents a 
        WHERE state='{theState}'
        group by accident_date
        order by accident_count desc;''')             
    
    results = pd.read_sql_query(stmt, db.session.bind)
    
    session.close()
    
    return jsonify(results.to_dict (orient='records'))

@app.route("/state_data/accident")
def state_accident_data():

    app.logger.info(f'State data accident by lat lon heat endpoint - app.logger.info')

    # Create session link from Python to database
    session = Session(db.engine)  

    # Use Pandas to perform the sql query
    stmt = (f'''select lat, lon from accidents;''')
    
    results = pd.read_sql_query(stmt, db.session.bind)
    results = results.fillna('')

   
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