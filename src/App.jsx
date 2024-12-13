import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import ClassesTable from './components/tables/ClassesTable';
import TeachersTable from './components/tables/TeachersTable';
import StudentsTable from './components/tables/StudentsTable';
import ClassAnalytics from './components/analytics/ClassAnalytics';
import FinancialAnalytics from './components/analytics/FinancialAnalytics';
import Navbar from './components/ui/Navbar';
import Sidebar from './components/ui/Sidebar';
import AddClassForm from './components/forms/AddClassForm';
import AddTeacherForm from './components/forms/AddTeacherForm';
import AddStudentForm from './components/forms/AddStudentForm';

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <div className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/classes" element={<ClassesTable />} />
              <Route path="/teachers" element={<TeachersTable />} />
              <Route path="/students" element={<StudentsTable />} />
              <Route path="/class/:id" element={<ClassAnalytics />} />
              <Route path="/financial-analytics" element={<FinancialAnalytics />} />
              <Route path="/classes/add" element={<AddClassForm />} />
              <Route path="/classes/edit/:id" element={<AddClassForm />} />
              <Route path="/teachers/add" element={<AddTeacherForm />} />
              <Route path="/teachers/edit/:id" element={<AddTeacherForm />} />
              <Route path="/students/add" element={<AddStudentForm />} />
              <Route path="/students/edit/:id" element={<AddStudentForm />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;