create table if not exists accidents(
    id text primary key,
    source text not null,
    severity integer not null,
    start_time text not null,
    street text not null,
    side text not null,
    city  text,
    county  text not null,
    state  text not null,
    zipcode text ,
    timezone text ,
    temperature real ,
    wind_chill real,
    humidity real,
    visibility real,
    wind_speed real ,
    weather_condition text,
    sunrise_sunset text
);