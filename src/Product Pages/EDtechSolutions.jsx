import React, { useState, useEffect } from 'react';
import './EDtechSolutions.css';

const EduCollab = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(true);
  
  // Auth form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginTenantId, setLoginTenantId] = useState('');
  
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState('teacher');
  const [signupDept, setSignupDept] = useState('');
  const [signupTenantId, setSignupTenantId] = useState('');
  
  // Course form states
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseInstructor, setCourseInstructor] = useState('');
  const [courseCredits, setCourseCredits] = useState('');
  
  // Assignment form states
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDesc, setAssignmentDesc] = useState('');
  const [assignmentCourse, setAssignmentCourse] = useState('');
  const [assignmentDueDate, setAssignmentDueDate] = useState('');
  const [assignmentMaxScore, setAssignmentMaxScore] = useState('');
  
  // Quiz form states
  const [quizTitle, setQuizTitle] = useState('');
  const [quizCourse, setQuizCourse] = useState('');
  const [quizQuestions, setQuizQuestions] = useState('');
  const [quizDuration, setQuizDuration] = useState('');
  
  // Chat states
  const [teamMsg, setTeamMsg] = useState('');
  const [courseMsg, setCourseMsg] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  
  // Admin states
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('student');
  const [enrollEmail, setEnrollEmail] = useState('');
  const [enrollCourse, setEnrollCourse] = useState('');
  
  const [refresh, setRefresh] = useState(0);
  
  // Initialize database
  useEffect(() => {
    initDB();
  }, []);
  
  const initDB = () => {
    if (!localStorage.getItem('edtech_users')) {
      const users = { 
        "teacher@academy.edu": { 
          email: "teacher@academy.edu", 
          userId: "edu001", 
          name: "Professor Smith", 
          password: "teacher123", 
          tenantId: "ACADEMY_01", 
          role: "teacher", 
          department: "Computer Science" 
        } 
      };
      localStorage.setItem('edtech_users', JSON.stringify(users));
    }
    if (!localStorage.getItem('edtech_tenants')) {
      const tenants = { 
        "ACADEMY_01": { 
          id: "ACADEMY_01", 
          name: "Global Academy", 
          departments: ["Computer Science", "Mathematics", "Physics", "Literature"], 
          members: ["teacher@academy.edu"], 
          courses: [] 
        } 
      };
      localStorage.setItem('edtech_tenants', JSON.stringify(tenants));
    }
    if (!localStorage.getItem('edtech_courses')) localStorage.setItem('edtech_courses', JSON.stringify([]));
    if (!localStorage.getItem('edtech_assignments')) localStorage.setItem('edtech_assignments', JSON.stringify([]));
    if (!localStorage.getItem('edtech_quizzes')) localStorage.setItem('edtech_quizzes', JSON.stringify([]));
    if (!localStorage.getItem('edtech_submissions')) localStorage.setItem('edtech_submissions', JSON.stringify([]));
    if (!localStorage.getItem('edtech_grades')) localStorage.setItem('edtech_grades', JSON.stringify([]));
    if (!localStorage.getItem('edtech_messages')) localStorage.setItem('edtech_messages', JSON.stringify({ team: [], course: {} }));
  };
  
  // Helper functions
  const getUsers = () => JSON.parse(localStorage.getItem('edtech_users') || '{}');
  const saveUsers = (u) => localStorage.setItem('edtech_users', JSON.stringify(u));
  const getTenants = () => JSON.parse(localStorage.getItem('edtech_tenants') || '{}');
  const saveTenants = (t) => localStorage.setItem('edtech_tenants', JSON.stringify(t));
  const getCourses = () => JSON.parse(localStorage.getItem('edtech_courses') || '[]');
  const saveCourses = (c) => localStorage.setItem('edtech_courses', JSON.stringify(c));
  const getAssignments = () => JSON.parse(localStorage.getItem('edtech_assignments') || '[]');
  const saveAssignments = (a) => localStorage.setItem('edtech_assignments', JSON.stringify(a));
  const getQuizzes = () => JSON.parse(localStorage.getItem('edtech_quizzes') || '[]');
  const saveQuizzes = (q) => localStorage.setItem('edtech_quizzes', JSON.stringify(q));
  const getSubmissions = () => JSON.parse(localStorage.getItem('edtech_submissions') || '[]');
  const saveSubmissions = (s) => localStorage.setItem('edtech_submissions', JSON.stringify(s));
  const getGrades = () => JSON.parse(localStorage.getItem('edtech_grades') || '[]');
  const saveGrades = (g) => localStorage.setItem('edtech_grades', JSON.stringify(g));
  const getMessages = () => JSON.parse(localStorage.getItem('edtech_messages') || '{"team":[], "course":{}}');
  const saveMessages = (m) => localStorage.setItem('edtech_messages', JSON.stringify(m));
  
  // Auth functions
  const signup = (email, name, password, role, department, existingTenantId) => {
    const users = getUsers();
    if (users[email]) return { success: false, error: "Email exists" };
    let tenantId = existingTenantId;
    const tenants = getTenants();
    let newRole = role;
    if (!tenantId || !tenants[tenantId]) {
      tenantId = "SCHOOL_" + Math.random().toString(36).substring(2, 8).toUpperCase();
      tenants[tenantId] = { 
        id: tenantId, 
        name: `${name}'s Academy`, 
        departments: ["Mathematics", "Science", "Languages"], 
        members: [email], 
        courses: [] 
      };
      newRole = "admin";
      saveTenants(tenants);
    } else {
      if (!tenants[tenantId].members.includes(email)) tenants[tenantId].members.push(email);
      saveTenants(tenants);
    }
    users[email] = { 
      email, 
      userId: "stu_" + Math.random().toString(36).substring(2, 8), 
      name, 
      password, 
      tenantId, 
      role: newRole, 
      department: department || "General" 
    };
    saveUsers(users);
    return { success: true, tenantId, role: newRole };
  };
  
  const login = (email, password, tenantId) => {
    const users = getUsers();
    const user = users[email];
    if (!user) return { success: false, error: "User not found" };
    if (user.password !== password) return { success: false, error: "Wrong password" };
    if (user.tenantId !== tenantId) return { success: false, error: `Tenant mismatch. Your institution ID: ${user.tenantId}` };
    return { success: true, user };
  };
  
  // Education Operations
  const createCourse = (tenantId, title, description, instructor, credits, createdBy) => {
    const courses = getCourses();
    courses.push({ 
      id: Date.now(), 
      tenantId, 
      title, 
      description, 
      instructor, 
      credits: parseInt(credits), 
      createdBy, 
      enrolledStudents: [], 
      createdAt: new Date().toISOString() 
    });
    saveCourses(courses);
  };
  
  const postAssignment = (tenantId, title, description, courseId, dueDate, maxScore, createdBy) => {
    const assignments = getAssignments();
    assignments.push({ 
      id: Date.now(), 
      tenantId, 
      title, 
      description, 
      courseId: parseInt(courseId), 
      dueDate, 
      maxScore: parseInt(maxScore), 
      createdBy, 
      submissions: [] 
    });
    saveAssignments(assignments);
  };
  
  const createQuiz = (tenantId, title, courseId, questions, duration, createdBy) => {
    const quizzes = getQuizzes();
    quizzes.push({ 
      id: Date.now(), 
      tenantId, 
      title, 
      courseId: parseInt(courseId), 
      questions: questions.split('\n').filter(q => q.trim()), 
      duration: parseInt(duration), 
      createdBy, 
      attempts: [] 
    });
    saveQuizzes(quizzes);
  };
  
  const submitGrade = (studentEmail, courseId, assignmentId, score, graderEmail, tenantId) => {
    const grades = getGrades();
    grades.push({ 
      id: Date.now(), 
      studentEmail, 
      courseId: parseInt(courseId), 
      assignmentId: parseInt(assignmentId), 
      score: parseInt(score), 
      gradedBy: graderEmail, 
      tenantId,
      date: new Date().toISOString() 
    });
    saveGrades(grades);
  };
  
  const sendTeamMsg = (tenantId, fromUser, text) => {
    const msgs = getMessages();
    msgs.team.push({ 
      tenantId, 
      fromEmail: fromUser.email, 
      fromName: fromUser.name, 
      text, 
      timestamp: Date.now() 
    });
    saveMessages(msgs);
  };
  
  const sendCourseMsg = (tenantId, courseId, fromUser, text) => {
    const msgs = getMessages();
    const key = `${tenantId}:course:${courseId}`;
    if (!msgs.course[key]) msgs.course[key] = [];
    msgs.course[key].push({ fromName: fromUser.name, text, timestamp: Date.now() });
    saveMessages(msgs);
  };
  
  const enrollStudent = (email, courseId) => {
    const courses = getCourses();
    const course = courses.find(c => c.id === parseInt(courseId));
    if (course && email) {
      if (!course.enrolledStudents) course.enrolledStudents = [];
      if (!course.enrolledStudents.includes(email)) {
        course.enrolledStudents.push(email);
        saveCourses(courses);
        return true;
      }
    }
    return false;
  };
  
  const getTenantData = () => {
    if (!currentUser) return { allMembers: [], courses: [], assignments: [], quizzes: [], grades: [] };
    const tenantId = currentUser.tenantId;
    const users = getUsers();
    const tenants = getTenants();
    const allMembers = (tenants[tenantId]?.members || []).map(email => users[email]).filter(Boolean);
    const courses = getCourses().filter(c => c.tenantId === tenantId);
    const assignments = getAssignments().filter(a => a.tenantId === tenantId);
    const quizzes = getQuizzes().filter(q => q.tenantId === tenantId);
    const grades = getGrades().filter(g => g.tenantId === tenantId || g.studentEmail === currentUser.email);
    return { allMembers, courses, assignments, quizzes, grades, tenantId, tenants };
  };
  
  // Event Handlers
  const handleLogin = () => {
    if (!loginEmail || !loginPassword || !loginTenantId) {
      alert('Please fill in all fields');
      return;
    }
    const res = login(loginEmail, loginPassword, loginTenantId);
    if (res.success) {
      setCurrentUser(res.user);
      setActiveTab('dashboard');
    } else {
      alert(res.error);
    }
  };
  
  const handleSignup = () => {
    if (!signupName || !signupEmail || !signupPassword) {
      alert('Please fill in all required fields');
      return;
    }
    const res = signup(signupEmail, signupName, signupPassword, signupRole, signupDept, signupTenantId);
    if (res.success) {
      alert(`Registration successful! Your Institution ID: ${res.tenantId}. Please login.`);
      setShowLogin(true);
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupRole('teacher');
      setSignupDept('');
      setSignupTenantId('');
    } else {
      alert(res.error);
    }
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
  };
  
  const handleCreateCourse = () => {
    if (!courseTitle || !courseDesc || !courseInstructor || !courseCredits) {
      alert('Please fill in all course fields');
      return;
    }
    createCourse(currentUser.tenantId, courseTitle, courseDesc, courseInstructor, courseCredits, currentUser.email);
    setRefresh(prev => prev + 1);
    setCourseTitle('');
    setCourseDesc('');
    setCourseInstructor('');
    setCourseCredits('');
    alert('Course created successfully!');
  };
  
  const handlePostAssignment = () => {
    if (!assignmentTitle || !assignmentDesc || !assignmentCourse || !assignmentDueDate || !assignmentMaxScore) {
      alert('Please fill in all assignment fields');
      return;
    }
    postAssignment(currentUser.tenantId, assignmentTitle, assignmentDesc, assignmentCourse, assignmentDueDate, assignmentMaxScore, currentUser.email);
    setRefresh(prev => prev + 1);
    setAssignmentTitle('');
    setAssignmentDesc('');
    setAssignmentCourse('');
    setAssignmentDueDate('');
    setAssignmentMaxScore('');
    alert('Assignment posted successfully!');
  };
  
  const handleCreateQuiz = () => {
    if (!quizTitle || !quizCourse || !quizQuestions || !quizDuration) {
      alert('Please fill in all quiz fields');
      return;
    }
    createQuiz(currentUser.tenantId, quizTitle, quizCourse, quizQuestions, quizDuration, currentUser.email);
    setRefresh(prev => prev + 1);
    setQuizTitle('');
    setQuizCourse('');
    setQuizQuestions('');
    setQuizDuration('');
    alert('Quiz created successfully!');
  };
  
  const handleSendTeamMsg = () => {
    if (!teamMsg.trim()) return;
    sendTeamMsg(currentUser.tenantId, currentUser, teamMsg);
    setRefresh(prev => prev + 1);
    setTeamMsg('');
  };
  
  const handleSendCourseMsg = () => {
    if (!courseMsg.trim() || !selectedCourse) {
      alert('Please select a course and enter a message');
      return;
    }
    sendCourseMsg(currentUser.tenantId, selectedCourse, currentUser, courseMsg);
    setRefresh(prev => prev + 1);
    setCourseMsg('');
  };
  
  const handleAddUser = () => {
    alert("In production: Invitation system. For demo, use signup with existing Tenant ID.");
  };
  
  const handleEnrollStudent = () => {
    if (!enrollEmail || !enrollCourse) {
      alert('Please enter student email and select a course');
      return;
    }
    if (enrollStudent(enrollEmail, enrollCourse)) {
      alert(`Student ${enrollEmail} enrolled successfully!`);
      setRefresh(prev => prev + 1);
      setEnrollEmail('');
      setEnrollCourse('');
    } else {
      alert('Failed to enroll student. Please check the email and course.');
    }
  };
  
  const handleSubmitAssignment = (assignmentId) => {
    const score = prompt("Enter score for this submission (0-100):");
    if (score && currentUser.role === 'teacher') {
      const assignment = assignments.find(a => a.id === assignmentId);
      if (assignment) {
        submitGrade(currentUser.email, assignment.courseId, assignmentId, score, currentUser.email, currentUser.tenantId);
        setRefresh(prev => prev + 1);
        alert('Grade submitted successfully!');
      }
    } else if (score && currentUser.role === 'student') {
      alert("Assignment submitted! Waiting for teacher grading.");
    }
  };
  
  const handleTakeQuiz = (quiz) => {
    alert(`Quiz: ${quiz.title}\nQuestions: ${quiz.questions.join(', ')}\n\n(Simulated: In production, this would be a full quiz interface)`);
  };
  
  const { allMembers, courses, assignments, quizzes, grades, tenantId } = getTenantData();
  const teamMsgs = getMessages().team.filter(m => m.tenantId === tenantId);
  const courseMsgs = getMessages().course[`${tenantId}:course:${selectedCourse}`] || [];
  const isAdmin = currentUser?.role === 'admin';
  const isTeacher = currentUser?.role === 'teacher';
  
  // Calculate student stats
  const studentGrades = grades.filter(g => g.studentEmail === currentUser?.email);
  const avgScore = studentGrades.length ? (studentGrades.reduce((s, g) => s + g.score, 0) / studentGrades.length).toFixed(1) : 0;
  const upcomingDeadlines = assignments.filter(a => new Date(a.dueDate) > new Date()).slice(0, 5);
  
  const escapeHtml = (str) => {
    return str?.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    }) || '';
  };
  
  if (!currentUser) {
    return (
      <div className="educollab-container">
        <div className="auth-container">
          {showLogin ? (
            <div className="auth-card">
              <div className="edu-icon">🎓</div>
              <h2>EduCollab Platform</h2>
              <div className="subtitle">Multi-Tenant Learning Management System</div>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="teacher@school.edu" />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••" />
              </div>
              <div className="input-group">
                <label>Tenant ID (School/Institute ID)</label>
                <input type="text" value={loginTenantId} onChange={(e) => setLoginTenantId(e.target.value)} placeholder="e.g., SCHOOL_EDU01" />
              </div>
              <button className="btn-primary" onClick={handleLogin}>Login →</button>
              <div className="auth-switch">
                New institution? <span className="link" onClick={() => setShowLogin(false)}>Register School/College</span>
              </div>
              <div className="demo-info">
                <strong>Demo Login:</strong><br />
                teacher@academy.edu / teacher123 / ACADEMY_01
              </div>
            </div>
          ) : (
            <div className="auth-card">
              <div className="edu-icon">🏫</div>
              <h2>Register Institution</h2>
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" value={signupName} onChange={(e) => setSignupName(e.target.value)} placeholder="John Doe" />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="email@school.edu" />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="••••" />
              </div>
              <div className="input-group">
                <label>Role</label>
                <select value={signupRole} onChange={(e) => setSignupRole(e.target.value)}>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className="input-group">
                <label>Department/Course</label>
                <input type="text" value={signupDept} onChange={(e) => setSignupDept(e.target.value)} placeholder="Mathematics, Science, Computer Science" />
              </div>
              <div className="input-group">
                <label>Tenant ID (optional)</label>
                <input type="text" value={signupTenantId} onChange={(e) => setSignupTenantId(e.target.value)} placeholder="Leave blank for new institution" />
              </div>
              <button className="btn-primary" onClick={handleSignup}>Register Institution</button>
              <div className="auth-switch">
                <span className="link" onClick={() => setShowLogin(true)}>Back to Login</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="educollab-app">
      <div className="app-wrapper">
        <header className="app-header">
          <div className="logo-area">
            <h1>🎓 EduCollab | Learning Management System</h1>
          </div>
          <div className="user-info">
            <span>{currentUser.name} ({currentUser.role})</span>
            <span className="tenant-badge">🏫 {tenantId}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>
        
        <nav className="tabs">
          <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            📊 Dashboard
          </button>
          <button className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>
            📚 Courses
          </button>
          <button className={`tab-btn ${activeTab === 'assignments' ? 'active' : ''}`} onClick={() => setActiveTab('assignments')}>
            📝 Assignments
          </button>
          <button className={`tab-btn ${activeTab === 'quizzes' ? 'active' : ''}`} onClick={() => setActiveTab('quizzes')}>
            🧪 Quizzes & Tests
          </button>
          <button className={`tab-btn ${activeTab === 'grades' ? 'active' : ''}`} onClick={() => setActiveTab('grades')}>
            📊 Grades & Progress
          </button>
          <button className={`tab-btn ${activeTab === 'collab' ? 'active' : ''}`} onClick={() => setActiveTab('collab')}>
            💬 Class Chat
          </button>
          {isAdmin && (
            <button className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>
              ⚙️ Admin Panel
            </button>
          )}
        </nav>
        
        <main className="app-content">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="tab-content active">
              <div className="grid-3col">
                <div className="card">
                  <h3>📊 Learning Progress</h3>
                  <div className="learning-stats">
                    <div className="stat-card">
                      <div className="stat-number">{courses.length}</div>
                      <div>Courses Available</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">{assignments.length}</div>
                      <div>Assignments</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">{avgScore}%</div>
                      <div>Average Grade</div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <h3>📅 Upcoming Deadlines</h3>
                  {upcomingDeadlines.length > 0 ? (
                    upcomingDeadlines.map(a => (
                      <div key={a.id} className="assignment-item">
                        <strong>{a.title}</strong>
                        <br />
                        Due: {new Date(a.dueDate).toLocaleDateString()}
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">No upcoming deadlines</div>
                  )}
                </div>
                <div className="card">
                  <h3>🏆 Recent Achievements</h3>
                  <div className="empty-state">Complete courses to earn achievements!</div>
                </div>
              </div>
              <div className="card" style={{ marginTop: '1rem' }}>
                <h3>📈 Course Enrollment Overview</h3>
                {courses.map(c => (
                  <div key={c.id} className="course-card">
                    <strong>{c.title}</strong>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${Math.random() * 100}%` }}></div>
                    </div>
                    <small>{c.enrolledStudents?.length || 0} students enrolled</small>
                  </div>
                ))}
                {courses.length === 0 && <div className="empty-state">No courses available</div>}
              </div>
            </div>
          )}
          
          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="tab-content active">
              <div className="grid-2col">
                <div className="card">
                  <h3>➕ Create New Course</h3>
                  <input type="text" placeholder="Course Title" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />
                  <textarea placeholder="Course Description" rows="2" value={courseDesc} onChange={(e) => setCourseDesc(e.target.value)}></textarea>
                  <input type="text" placeholder="Instructor Name" value={courseInstructor} onChange={(e) => setCourseInstructor(e.target.value)} />
                  <input type="number" placeholder="Credits" value={courseCredits} onChange={(e) => setCourseCredits(e.target.value)} />
                  <button className="action-btn" onClick={handleCreateCourse}>Create Course</button>
                </div>
                <div className="card">
                  <h3>📚 Active Courses</h3>
                  <div className="scrollable-list">
                    {courses.map(c => (
                      <div key={c.id} className="course-card">
                        <strong>{c.title}</strong>
                        <br />
                        {c.description}
                        <br />
                        <small>Instructor: {c.instructor} | Credits: {c.credits}</small>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${Math.random() * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                    {courses.length === 0 && <div className="empty-state">No courses available</div>}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <div className="tab-content active">
              <div className="grid-2col">
                <div className="card">
                  <h3>📝 Post Assignment</h3>
                  <input type="text" placeholder="Assignment Title" value={assignmentTitle} onChange={(e) => setAssignmentTitle(e.target.value)} />
                  <textarea placeholder="Assignment Description" rows="2" value={assignmentDesc} onChange={(e) => setAssignmentDesc(e.target.value)}></textarea>
                  <select value={assignmentCourse} onChange={(e) => setAssignmentCourse(e.target.value)}>
                    <option value="">Select Course</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                  <input type="date" value={assignmentDueDate} onChange={(e) => setAssignmentDueDate(e.target.value)} />
                  <input type="number" placeholder="Max Score" value={assignmentMaxScore} onChange={(e) => setAssignmentMaxScore(e.target.value)} />
                  <button className="action-btn" onClick={handlePostAssignment}>Post Assignment</button>
                </div>
                <div className="card">
                  <h3>📋 Assignments & Submissions</h3>
                  <div className="scrollable-list">
                    {assignments.map(a => {
                      const course = courses.find(c => c.id === a.courseId);
                      return (
                        <div key={a.id} className="assignment-item">
                          <strong>{a.title}</strong>
                          <br />
                          {a.description}
                          <br />
                          <small>Course: {course?.title || 'N/A'} | Due: {new Date(a.dueDate).toLocaleDateString()} | Max Score: {a.maxScore}</small>
                          {(isAdmin || isTeacher) && (
                            <button className="action-btn small" onClick={() => handleSubmitAssignment(a.id)}>Grade Submission</button>
                          )}
                          {currentUser.role === 'student' && (
                            <button className="action-btn small" onClick={() => handleSubmitAssignment(a.id)}>Submit Assignment</button>
                          )}
                        </div>
                      );
                    })}
                    {assignments.length === 0 && <div className="empty-state">No assignments posted</div>}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Quizzes Tab */}
          {activeTab === 'quizzes' && (
            <div className="tab-content active">
              <div className="grid-2col">
                <div className="card">
                  <h3>✏️ Create Quiz</h3>
                  <input type="text" placeholder="Quiz Title" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} />
                  <select value={quizCourse} onChange={(e) => setQuizCourse(e.target.value)}>
                    <option value="">Select Course</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                  <textarea placeholder="Questions (one per line)" rows="3" value={quizQuestions} onChange={(e) => setQuizQuestions(e.target.value)}></textarea>
                  <input type="number" placeholder="Duration (minutes)" value={quizDuration} onChange={(e) => setQuizDuration(e.target.value)} />
                  <button className="action-btn" onClick={handleCreateQuiz}>Create Quiz</button>
                </div>
                <div className="card">
                  <h3>📋 Available Quizzes</h3>
                  <div className="scrollable-list">
                    {quizzes.map(q => {
                      const course = courses.find(c => c.id === q.courseId);
                      return (
                        <div key={q.id} className="quiz-item">
                          <strong>{q.title}</strong>
                          <br />
                          <small>Course: {course?.title || 'N/A'} | Questions: {q.questions.length} | Duration: {q.duration} min</small>
                          <button className="action-btn small" onClick={() => handleTakeQuiz(q)}>Take Quiz</button>
                        </div>
                      );
                    })}
                    {quizzes.length === 0 && <div className="empty-state">No quizzes available</div>}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Grades Tab */}
          {activeTab === 'grades' && (
            <div className="tab-content active">
              <div className="grid-2col">
                <div className="card">
                  <h3>📊 Grade Summary</h3>
                  <div className="stat-card">
                    <div className="stat-number">{studentGrades.length}</div>
                    <div>Graded Items</div>
                    <div className="stat-number">{avgScore}%</div>
                    <div>Average Score</div>
                  </div>
                </div>
                <div className="card">
                  <h3>📈 Performance Analytics</h3>
                  <div className="empty-state">Performance chart will appear here</div>
                </div>
              </div>
              <div className="card" style={{ marginTop: '1rem' }}>
                <h3>📋 Detailed Grades</h3>
                {studentGrades.map(g => {
                  const course = courses.find(c => c.id === g.courseId);
                  const assignment = assignments.find(a => a.id === g.assignmentId);
                  return (
                    <div key={g.id} className="grade-item">
                      <strong>{assignment?.title || 'Assignment'}</strong>
                      <br />
                      Course: {course?.title || 'N/A'} | Score: {g.score} | Graded by: {g.gradedBy}
                    </div>
                  );
                })}
                {studentGrades.length === 0 && <div className="empty-state">No grades yet</div>}
              </div>
            </div>
          )}
          
          {/* Collaboration Tab */}
          {activeTab === 'collab' && (
            <div className="tab-content active">
              <div className="grid-2col">
                <div className="card">
                  <h3>💬 Class Discussion</h3>
                  <div className="class-members-list">
                    {allMembers.map(m => (
                      <div key={m.email} className="member-item">
                        {m.name} ({m.role}) - {m.department}
                      </div>
                    ))}
                  </div>
                  <div className="chat-input-group">
                    <input type="text" placeholder="Message to class..." value={teamMsg} onChange={(e) => setTeamMsg(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendTeamMsg()} />
                    <button className="send-btn" onClick={handleSendTeamMsg}>Send</button>
                  </div>
                  <div className="chat-messages">
                    {teamMsgs.map((m, idx) => (
                      <div key={idx} className="message-bubble">
                        <strong>{m.fromName}</strong> <small>{new Date(m.timestamp).toLocaleTimeString()}</small>
                        <br />
                        {escapeHtml(m.text)}
                      </div>
                    ))}
                    {teamMsgs.length === 0 && <div className="empty-state">No messages</div>}
                  </div>
                </div>
                <div className="card">
                  <h3>🏫 Course Chat</h3>
                  <select className="course-selector" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                    <option value="">Select Course</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                  <div className="chat-messages">
                    {courseMsgs.map((m, idx) => (
                      <div key={idx} className="message-bubble">
                        <strong>{m.fromName}</strong> <small>{new Date(m.timestamp).toLocaleTimeString()}</small>
                        <br />
                        {escapeHtml(m.text)}
                      </div>
                    ))}
                    {courseMsgs.length === 0 && <div className="empty-state">No course messages</div>}
                  </div>
                  <div className="chat-input-group">
                    <input type="text" placeholder="Message to course..." value={courseMsg} onChange={(e) => setCourseMsg(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendCourseMsg()} disabled={!selectedCourse} />
                    <button className="send-btn" onClick={handleSendCourseMsg} disabled={!selectedCourse}>Send</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Admin Tab */}
          {activeTab === 'admin' && isAdmin && (
            <div className="tab-content active">
              <div className="grid-2col">
                <div className="card">
                  <h3>👥 User Management</h3>
                  <div className="user-list">
                    {allMembers.map(m => (
                      <div key={m.email} className="member-item">
                        {m.name} ({m.email}) - {m.role}
                      </div>
                    ))}
                  </div>
                  <div className="add-user">
                    <input type="email" placeholder="User email to add" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} />
                    <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)}>
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button className="action-btn" onClick={handleAddUser}>Add User</button>
                  </div>
                </div>
                <div className="card">
                  <h3>📚 Course Management</h3>
                  <div className="admin-course-list">
                    {courses.map(c => (
                      <div key={c.id} className="course-item">
                        {c.title} - {c.enrolledStudents?.length || 0} students
                      </div>
                    ))}
                  </div>
                  <div className="enroll-student">
                    <input type="email" placeholder="Student Email" value={enrollEmail} onChange={(e) => setEnrollEmail(e.target.value)} />
                    <select value={enrollCourse} onChange={(e) => setEnrollCourse(e.target.value)}>
                      <option value="">Select Course</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                    <button className="action-btn" onClick={handleEnrollStudent}>Enroll Student</button>
                  </div>
                </div>
                <div className="card">
                  <h3>📊 System Analytics</h3>
                  <div className="system-stats">
                    <div>Total Users: {allMembers.length}</div>
                    <div>Total Courses: {courses.length}</div>
                    <div>Total Assignments: {assignments.length}</div>
                    <div>Total Quizzes: {quizzes.length}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EduCollab;