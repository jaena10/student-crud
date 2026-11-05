import React, { useState, useEffect, useRef } from 'react';
import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from './services/studentService';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import Notification from './components/Notification';
import { School, Database, Server } from 'lucide-react';

export default function App() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [notification, setNotification] = useState(null);

  const formRef = useRef(null);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const data = await getAllStudents();
      // Ensure data is an array
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setNotification({
        type: 'error',
        message:
          'Could not reach the Student API. Please ensure your Spring Boot server is running on port 8080.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleFormSubmit = async (formData, isEditing) => {
    setIsSubmitting(true);
    try {
      if (isEditing && editingStudent) {
        const updated = await updateStudent(editingStudent.id, formData);
        setStudents((prev) =>
          prev.map((s) => (s.id === editingStudent.id ? updated : s))
        );
        setEditingStudent(null);
        setNotification({
          type: 'success',
          message: `Student #${updated.id} (${updated.firstname} ${updated.lastname}) successfully updated.`,
        });
      } else {
        const created = await createStudent(formData);
        setStudents((prev) => [...prev, created]);
        setNotification({
          type: 'success',
          message: `Student "${created.firstname} ${created.lastname}" successfully added with ID #${created.id}.`,
        });
      }
    } catch (err) {
      console.error('Error submitting student:', err);
      setNotification({
        type: 'error',
        message: err.message || 'An error occurred while saving student information.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      if (editingStudent && editingStudent.id === id) {
        setEditingStudent(null);
      }
      setNotification({
        type: 'success',
        message: `Student #${id} was deleted successfully.`,
      });
    } catch (err) {
      console.error('Error deleting student:', err);
      setNotification({
        type: 'error',
        message: err.message || `Failed to delete student #${id}.`,
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <School className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                Student Management Portal
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Vite + React CRUD Frontend
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200/80">
              <Server className="w-3.5 h-3.5 text-emerald-600" />
              <span>Spring Boot API</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200/80">
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              <span>PostgreSQL /db_user</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Notification Banner */}
        <Notification
          notification={notification}
          onDismiss={() => setNotification(null)}
        />

        {/* Dashboard Grid: Form on Left, List on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form (Modal-Free, Inline Panel) */}
          <div ref={formRef} className="lg:col-span-5 sticky top-24">
            <StudentForm
              editingStudent={editingStudent}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelEdit}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Right Column: Student Table */}
          <div className="lg:col-span-7">
            <StudentList
              students={students}
              isLoading={isLoading}
              onRefresh={fetchStudents}
              onEdit={handleEdit}
              onDelete={handleDelete}
              editingStudentId={editingStudent ? editingStudent.id : null}
              deletingId={deletingId}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
          Student CRUD System &bull; Frontend connected to <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">/mangulabnan/students</code>
        </div>
      </footer>
    </div>
  );
}
