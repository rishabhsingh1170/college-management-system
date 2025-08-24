-- Users table (students and faculty)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'faculty') NOT NULL,
    name VARCHAR(100) NOT NULL
);

-- Marks table
CREATE TABLE marks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    subject VARCHAR(50),
    marks INT,
    exam VARCHAR(50),
    FOREIGN KEY (student_id) REFERENCES users(id)
);

-- Attendance table
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    date DATE,
    status ENUM('present', 'absent'),
    FOREIGN KEY (student_id) REFERENCES users(id)
);

-- Notices table
CREATE TABLE notices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Exam Timetable table
CREATE TABLE exam_timetable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam VARCHAR(50),
    subject VARCHAR(50),
    date DATE,
    time VARCHAR(20)
);

-- Fees table
CREATE TABLE fees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    status ENUM('paid', 'unpaid'),
    amount DECIMAL(10,2),
    due_date DATE,
    FOREIGN KEY (student_id) REFERENCES users(id)
);
