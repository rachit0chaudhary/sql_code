CREATE TABLE wow (
    userId VARCHAR(50) primary KEY,
    username VARCHAR(50) Unique,
    email VARCHAR(50)  UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL
);