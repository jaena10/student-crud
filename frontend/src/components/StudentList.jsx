import React, { useState } from 'react';
import {
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  AlertTriangle,
  GraduationCap,
  Hash,
  X,
  UserCheck,
} from 'lucide-react';

export default function StudentList({
  students,
  isLoading,
  onRefresh,
  onEdit,
  onDelete,
  editingStudentId,
  deletingId,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Filter students based on search term
  const filteredStudents = students.filter((s) => {
    const term = searchTerm.toLowerCase();
    const fullName = `${s.firstname || ''} ${s.lastname || ''}`.toLowerCase();
    const course = (s.course || '').toLowerCase();
    const section = (s.section || '').toLowerCase();
    const id = String(s.id || '');
    return (
      fullName.includes(term) ||
      course.includes(term) ||
      section.includes(term) ||
      id.includes(term)
    );
  });

  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const handleConfirmDelete = (id) => {
    setConfirmDeleteId(null);
    onDelete(id);
  };

  // Get initials for avatar badge
  const getInitials = (first, last) => {
    const f = (first || '').charAt(0).toUpperCase();
    const l = (last || '').charAt(0).toUpperCase();
    return `${f}${l}` || 'S';
  };

  // Deterministic pastel color for avatars based on name
  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-100 text-blue-700 border-blue-200',
      'bg-indigo-100 text-indigo-700 border-indigo-200',
      'bg-emerald-100 text-emerald-700 border-emerald-200',
      'bg-purple-100 text-purple-700 border-purple-200',
      'bg-rose-100 text-rose-700 border-rose-200',
      'bg-teal-100 text-teal-700 border-teal-200',
    ];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
      hash = (name.charCodeAt(i) + ((hash << 5) - hash)) % colors.length;
    }
    return colors[Math.abs(hash)];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      {/* Top Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-slate-200/60 rounded-lg text-slate-700">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-800">Student Directory</h2>
              <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                {students.length} Total
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Browse, filter, edit, and manage registered students
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, course, section..."
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh student list"
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4 w-16">ID</th>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Course</th>
              <th className="py-3 px-4">Section</th>
              <th className="py-3 px-4 text-right w-48">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading && students.length === 0 ? (
              // Loading Skeleton Rows
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4 px-4">
                    <div className="h-4 bg-slate-200 rounded w-8"></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                      <div className="space-y-1.5">
                        <div className="h-3.5 bg-slate-200 rounded w-28"></div>
                        <div className="h-2.5 bg-slate-100 rounded w-16"></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 bg-slate-200 rounded w-12"></div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="h-6 bg-slate-200 rounded w-20 ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : filteredStudents.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="max-w-xs mx-auto text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      {searchTerm ? 'No matching students found' : 'No students registered yet'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {searchTerm
                        ? `Try adjusting your search query "${searchTerm}"`
                        : 'Use the form on the side to create your first student record.'}
                    </p>
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => setSearchTerm('')}
                        className="text-xs text-indigo-600 font-medium hover:underline pt-1"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              // Student Rows
              filteredStudents.map((student) => {
                const isEditing = editingStudentId === student.id;
                const isDeleting = deletingId === student.id;
                const isConfirming = confirmDeleteId === student.id;

                return (
                  <tr
                    key={student.id}
                    className={`transition-colors hover:bg-slate-50/80 ${
                      isEditing ? 'bg-amber-50/60' : ''
                    }`}
                  >
                    {/* ID */}
                    <td className="py-3 px-4 font-mono text-xs text-slate-500">
                      <span className="inline-flex items-center gap-0.5 font-medium">
                        <Hash className="w-3 h-3 text-slate-400" />
                        {student.id}
                      </span>
                    </td>

                    {/* Student Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-semibold ${getAvatarColor(
                            student.firstname + ' ' + student.lastname
                          )}`}
                        >
                          {getInitials(student.firstname, student.lastname)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm leading-snug">
                            {student.firstname} {student.lastname}
                          </p>
                          {isEditing && (
                            <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider inline-flex items-center gap-1">
                              <UserCheck className="w-2.5 h-2.5" /> Editing now
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-md">
                        {student.course}
                      </span>
                    </td>

                    {/* Section */}
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                        {student.section}
                      </span>
                    </td>

                    {/* Actions - INLINE (NO MODAL) */}
                    <td className="py-3 px-4 text-right">
                      {isConfirming ? (
                        // Inline confirmation replacing buttons
                        <div className="inline-flex items-center gap-1.5 p-1 rounded-lg bg-rose-50 border border-rose-200">
                          <span className="text-[11px] font-semibold text-rose-700 flex items-center gap-1 pl-1">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            Delete?
                          </span>
                          <button
                            type="button"
                            onClick={() => handleConfirmDelete(student.id)}
                            className="px-2 py-0.5 text-[11px] font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded transition"
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelDelete}
                            className="px-1.5 py-0.5 text-[11px] font-medium text-slate-600 hover:text-slate-800 hover:bg-rose-100 rounded transition"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        // Normal Action Buttons
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onEdit(student)}
                            title="Edit student"
                            className={`p-1.5 rounded-lg border transition ${
                              isEditing
                                ? 'bg-amber-100 text-amber-700 border-amber-300'
                                : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border-transparent hover:border-indigo-100'
                            }`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteClick(student.id)}
                            disabled={isDeleting}
                            title="Delete student"
                            className="p-1.5 rounded-lg border border-transparent hover:border-rose-100 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition disabled:opacity-50"
                          >
                            {isDeleting ? (
                              <RefreshCw className="w-4 h-4 animate-spin text-rose-600" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer bar with count */}
      {students.length > 0 && (
        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> registered students
          </span>
          {searchTerm && (
            <span className="italic">
              Filter: "{searchTerm}"
            </span>
          )}
        </div>
      )}
    </div>
  );
}
