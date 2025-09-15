-- Table for storing OTPs for password reset
CREATE TABLE IF NOT EXISTS PasswordResetOTPs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    otp VARCHAR(10) NOT NULL,
    expires_at DATETIME NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- 1. Create database
CREATE DATABASE IF NOT EXISTS CollegeManagement;
USE CollegeManagement;

ALTER TABLE Student 
ADD COLUMN auth_id INT NOT NULL,
ADD CONSTRAINT fk_student_auth 
    FOREIGN KEY (auth_id) REFERENCES AuthenticatePersons(id);


-- 2. Authentication module

--there is circular dependency between Student, Faculty and AuthenticatePersons
---- Step 1: Create Student and Faculty without auth_id FK
-- Step 2: Create AuthenticatePersons
-- Step 3: Alter Student and Faculty to add auth_id FK

CREATE TABLE AuthenticatePersons (
    auth_id INT AUTO_INCREMENT PRIMARY KEY, 
    password VARCHAR(255) NOT NULL,
    user_type ENUM('student', 'faculty', 'admin') NOT NULL
);

select * from AuthenticatePersons;

-- 3. Standalone tables
CREATE TABLE Company (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    industry VARCHAR(100)
);

CREATE TABLE Books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100),
    category VARCHAR(100),
    available_copies INT DEFAULT 0
);

-- 4. Department (HOD FK added later)
CREATE TABLE Department (
    dep_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    hod_id INT
);

-- 5. Academic structure
CREATE TABLE Courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    duration VARCHAR(50),
    dep_id INT,
    FOREIGN KEY (dep_id) REFERENCES Department(dep_id)
);

CREATE TABLE Semester (
    semester_id INT AUTO_INCREMENT PRIMARY KEY,
    semester_no INT NOT NULL,
    course_id INT,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);

CREATE TABLE Subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    course_id INT,
    semester_id INT,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id),
    FOREIGN KEY (semester_id) REFERENCES Semester(semester_id)
);

-- 6. Students
CREATE TABLE Student (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    auth_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    DOB DATE,
    phone_no VARCHAR(15),
    email VARCHAR(100) UNIQUE,
    address TEXT,
    course_id INT,
    semester_id INT,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id),
    FOREIGN KEY (semester_id) REFERENCES Semester(semester_id),
    FOREIGN KEY (auth_id) REFERENCES AuthenticatePersons(auth_id)
);

select * from Student;

CREATE TABLE Admission (
    admission_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    admission_date DATE,
    fee_status ENUM('Paid','Unpaid') DEFAULT 'Unpaid',
    current_semester INT,
    FOREIGN KEY (student_id) REFERENCES Student(student_id)
);

CREATE TABLE Fees (
    fee_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    sem_id INT,
    paid_amount DECIMAL(10,2),
    due_date DATE,
    status ENUM('Paid','Due') DEFAULT 'Due',
    amount DECIMAL(10,2),
    FOREIGN KEY (student_id) REFERENCES Student(student_id),
    FOREIGN KEY (sem_id) REFERENCES Semester(semester_id)
);

-- 7. Faculty
CREATE TABLE Faculty (
    faculty_id INT AUTO_INCREMENT PRIMARY KEY,
    auth_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone_no VARCHAR(15),
    salary DECIMAL(10,2),
    designation VARCHAR(50),
    dep_id INT,
    FOREIGN KEY (dep_id) REFERENCES Department(dep_id),
    FOREIGN KEY (auth_id) REFERENCES AuthenticatePersons(auth_id)
);

-- Add hod_id foreign key now
ALTER TABLE Department
  ADD CONSTRAINT fk_department_hod
  FOREIGN KEY (hod_id) REFERENCES Faculty(faculty_id);

CREATE TABLE ClassSchedule (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    faculty_id INT,
    subject_id INT,
    course_id INT,
    room_no VARCHAR(20),
    start_time TIME,
    end_time TIME,
    day_of_week ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'),
    FOREIGN KEY (faculty_id) REFERENCES Faculty(faculty_id),
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);

-- 8. Exams and results
CREATE TABLE Examination (
    exam_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT,
    semester_id INT,
    date DATE,
    time TIME,
    exam_type VARCHAR(50),
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id),
    FOREIGN KEY (semester_id) REFERENCES Semester(semester_id)
);

CREATE TABLE ExamTimeTable (
    timetable_id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT,
    exam_date DATE,
    start_time TIME,
    end_time TIME,
    room_no VARCHAR(20),
    course_id INT,
    FOREIGN KEY (exam_id) REFERENCES Examination(exam_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);

CREATE TABLE SubjectMarks (
    subject_id INT,
    student_id INT,
    exam_id INT,
    marks INT,
    grade VARCHAR(5),
    PRIMARY KEY (subject_id, student_id, exam_id),
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id),
    FOREIGN KEY (student_id) REFERENCES Student(student_id),
    FOREIGN KEY (exam_id) REFERENCES Examination(exam_id)
);

CREATE TABLE Result (
    exam_id INT,
    student_id INT,
    sem_id INT,
    grade VARCHAR(5),
    total_marks INT,
    PRIMARY KEY (exam_id, student_id),
    FOREIGN KEY (exam_id) REFERENCES Examination(exam_id),
    FOREIGN KEY (student_id) REFERENCES Student(student_id),
    FOREIGN KEY (sem_id) REFERENCES Semester(semester_id)
);

-- 9. Attendance and back papers
CREATE TABLE Attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    subject_id INT,
    date DATE,
    status ENUM('Present','Absent') NOT NULL,
    FOREIGN KEY (student_id) REFERENCES Student(student_id),
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id)
);

CREATE TABLE BackPapers (
    student_id INT,
    subject_id INT,
    semester_id INT,
    exam_id INT,
    PRIMARY KEY (student_id, subject_id, semester_id, exam_id),
    FOREIGN KEY (student_id) REFERENCES Student(student_id),
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id),
    FOREIGN KEY (semester_id) REFERENCES Semester(semester_id),
    FOREIGN KEY (exam_id) REFERENCES Examination(exam_id)
);

-- 10. Support, placement
CREATE TABLE StudentSupport (
    support_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    status VARCHAR(50),
    issue TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (student_id) REFERENCES Student(student_id)
);

CREATE TABLE PlacementCell (
    placement_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    job_role VARCHAR(100),
    salary DECIMAL(10,2),
    year YEAR,
    company_id INT,
    placement_status ENUM('Placed', 'Pending', 'Rejected') DEFAULT 'Pending',
    FOREIGN KEY (student_id) REFERENCES Student(student_id),
    FOREIGN KEY (company_id) REFERENCES Company(company_id)
);

-- 11. Library (Fixed version for both student and faculty borrowers)

CREATE TABLE Library (
    library_id INT AUTO_INCREMENT PRIMARY KEY,
    borrower_id INT NOT NULL,
    borrower_type ENUM('student', 'faculty') NOT NULL,
    issue_date DATE,
    return_date DATE
);

CREATE TABLE BorrowBooks (
    borrower_id INT NOT NULL,
    borrower_type ENUM('student', 'faculty') NOT NULL,
    book_id INT NOT NULL,
    borrow_date DATE,
    return_date DATE,
    PRIMARY KEY (borrower_id, borrower_type, book_id, borrow_date),
    FOREIGN KEY (book_id) REFERENCES Books(book_id)
);
