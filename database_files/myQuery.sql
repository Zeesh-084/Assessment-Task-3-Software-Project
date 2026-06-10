-- database: ./database.db

--CREATE TABLE users(user_id INTEGER NOT NULL PRIMARY KEY, username VARCHAR(50) NOT NULL, password VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL);
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

CREATE TABLE timetable (
    timetable_id INTEGER NOT NULL, PRIMARY KEY,
    user_id INTEGER NOT NULL,
    subject TEXT NOT NULL,
    teacher TEXT NOT NULL,
    rooms TEXT NOT NULL); 
