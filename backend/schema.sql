
-- Table for authentication (all persons)
CREATE TABLE AuthenticatePersons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'faculty') NOT NULL
);

-- Student table
CREATE TABLE Student (
    id INT AUTO_INCREMENT PRIMARY KEY,
    auth_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    semester_id INT NOT NULL,
    FOREIGN KEY (auth_id) REFERENCES AuthenticatePersons(id),
    FOREIGN KEY (semester_id) REFERENCES Semester(id)
);

-- Faculty table
CREATE TABLE Faculty (
    id INT AUTO_INCREMENT PRIMARY KEY,
    auth_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department VARCHAR(100),
    FOREIGN KEY (auth_id) REFERENCES AuthenticatePersons(id)
);

-- Semester table
CREATE TABLE Semester (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- Course table
CREATE TABLE Course (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE
);

-- Subjects table
CREATE TABLE Subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    course_id INT NOT NULL,
    semester_id INT NOT NULL,
    faculty_id INT,
    FOREIGN KEY (course_id) REFERENCES Course(id),
    FOREIGN KEY (semester_id) REFERENCES Semester(id),
    FOREIGN KEY (faculty_id) REFERENCES Faculty(id)
);

-- SubjectMarks table
CREATE TABLE SubjectMarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    exam VARCHAR(50) NOT NULL,
    marks INT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES Student(id),
    FOREIGN KEY (subject_id) REFERENCES Subjects(id)
);

-- Attendance table
CREATE TABLE Attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('present', 'absent') NOT NULL,
    FOREIGN KEY (student_id) REFERENCES Student(id),
    FOREIGN KEY (subject_id) REFERENCES Subjects(id)
);

-- Notices table
CREATE TABLE Notices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Exam Timetable table
CREATE TABLE ExamTimetable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam VARCHAR(50),
    subject_id INT NOT NULL,
    date DATE,
    time VARCHAR(20),
    FOREIGN KEY (subject_id) REFERENCES Subjects(id)
);

-- Fees table
CREATE TABLE Fees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    status ENUM('paid', 'unpaid') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE,
    FOREIGN KEY (student_id) REFERENCES Student(id)
);
