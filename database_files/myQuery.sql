-- database: ./database.db

--CREATE TABLE users(
    -- user_id INTEGER NOT NULL PRIMARY KEY, 
    -- username VARCHAR(50) NOT NULL, 
    -- password VARCHAR(255) NOT NULL, 
    -- email VARCHAR(255) NOT NULL);

-- INSERT INTO users (user_id, username, password, email) VALUES (1, 'Zeesh_084', 'z33shAAn', 'zeeshali2409@gmail.com');

-- CREATE TABLE grades (
    -- grades_id INTEGER NOT NULL PRIMARY KEY, 
    -- user_id INTEGER NOT NULL, 
   -- subject TEXT NOT NULL,
    --term_1 INTEGER NOT NULL,
   -- term_2 INTEGER NOT NULL,
    --semester_1 TEXT NOT NULL,
    --term_3 INTEGER NOT NULL,
    --term_4 INTEGER NOT NULL,
    --semester_2 TEXT NOT NULL,
    --average INTEGER NOT NULL);

-- CREATE TABLE timetable (
   -- timetable_id INTEGER NOT NULL PRIMARY KEY,
   -- user_id INTEGER NOT NULL,
   -- subject TEXT NOT NULL,
   -- teacher TEXT NOT NULL,
   -- rooms TEXT NOT NULL);

-- CREATE TABLE goals (
   -- goals_id INTEGER NOT NULL PRIMARY KEY,
   -- user_id INTEGER NOT NULL,
   -- goal TEXT NOT NULL,
   -- progress_goal TEXT NOT NULL);

--CREATE TABLE tasks (
   -- task_id INTEGER NOT NULL PRIMARY KEY,
   -- user_id INTEGER NOT NULL,
   -- task TEXT NOT NULL,
   -- progress_task TEXT NOT NULL);

-- CREATE TABLE events (
    --event_id INTEGER NOT NULL PRIMARY KEY,
    -- user_id INTEGER NOT NULL,
    -- event_date DATE NOT NULL, 
    -- event_time TIME NOT NULL,
    -- event_repeat TEXT NULL NULL,
    -- event_deadline DATE NOT NULL,
    -- event_detail TEXT NOT NULL);

-- CREATE TABLE schedule (
    -- schedule_id INTEGER NOT NULL PRIMARY KEY,
    -- user_id INTEGER NOT NULL,
    -- schedule_day STRING NOT NULL,
    -- schedule_time_start TIME NOT NULL,
    -- schedule_time_end TIME NOT NULL,
    -- schedule_colour VARCHAR(7) NOT NULL,
    -- schedule_detail TEXT NOT NULL);

-- CREATE TABLE setting (
    -- setting_id INTEGER NOT NULL PRIMARY KEY,
    -- user_id INTEGER NOT NULL,
    -- profile_picture BLOB NULL,
    -- activate_2fa INTEGER NULL);