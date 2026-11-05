import React, { useState, useEffect } from 'react';
import { UserPlus, UserCheck, X, RefreshCw } from 'lucide-react';

export default function StudentForm({ editingStudent, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    course: '',
    section: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        firstname: editingStudent.firstname || '',
        lastname: editingStudent.lastname || '',
        course: editingStudent.course || '',
        section: editingStudent.section || '',
      });
      setErrors({});
    } else {
      setFormData({
        firstname: '',
        lastname: '',
        course: '',
        section: '',
      });
    }
  }, [editingStudent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.firstname.trim()) errs.firstname = 'First name is required';
    if (!formData.lastname.trim()) errs.lastname = 'Last name is required';
    if (!formData.course.trim()) errs.course = 'Course is required';
    if (!formData.section.trim()) errs.section = 'Section is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit(
      {
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        course: formData.course.trim(),
        section: formData.section.trim(),
      },
      Boolean(editingStudent)
    );
  };

  const isFormDirty =
    Boolean(formData.firstname || formData.lastname || formData.course || formData.section);

  const handleReset = () => {
    setFormData({
      firstname: '',
      lastname: '',
      course: '',
      section: '',
    });
    setErrors({});
    if (editingStudent && onCancel) {
      onCancel();
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border transition-all duration-200 ${
      editingStudent ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
    }`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${
            editingStudent ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
          }`}>
            {editingStudent ? <UserCheck className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              {editingStudent ? 'Edit Student Details' : 'Add New Student'}
            </h2>
            <p className="text-xs text-slate-500">
              {editingStudent
                ? `Updating ID #${editingStudent.id} • ${editingStudent.firstname} ${editingStudent.lastname}`
                : 'Fill in the fields to enroll a student'}
            </p>
          </div>
        </div>

        {editingStudent && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-slate-100 transition"
          >
            <X className="w-3.5 h-3.5" />
            Cancel Edit
          </button>
        )}
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Name Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              First Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="e.g. Maria"
              className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 transition ${
                errors.firstname
                  ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-200 text-rose-900'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 text-slate-800'
              }`}
            />
            {errors.firstname && (
              <p className="text-xs text-rose-500 mt-1">{errors.firstname}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Last Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="e.g. Santos"
              className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 transition ${
                errors.lastname
                  ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-200 text-rose-900'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 text-slate-800'
              }`}
            />
            {errors.lastname && (
              <p className="text-xs text-rose-500 mt-1">{errors.lastname}</p>
            )}
          </div>
        </div>

        {/* Academic Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Course <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="e.g. BS Information Technology"
              className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 transition ${
                errors.course
                  ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-200 text-rose-900'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 text-slate-800'
              }`}
            />
            {errors.course && (
              <p className="text-xs text-rose-500 mt-1">{errors.course}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Section <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="section"
              value={formData.section}
              onChange={handleChange}
              placeholder="e.g. 3A"
              className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 transition ${
                errors.section
                  ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-200 text-rose-900'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 text-slate-800'
              }`}
            />
            {errors.section && (
              <p className="text-xs text-rose-500 mt-1">{errors.section}</p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-2 flex items-center justify-end gap-2.5">
          {(isFormDirty || editingStudent) && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
            >
              {editingStudent ? 'Cancel' : 'Clear Form'}
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold text-white shadow-sm transition disabled:opacity-50 ${
              editingStudent
                ? 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800'
                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
            }`}
          >
            {isSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            {editingStudent ? 'Save Changes' : 'Add Student'}
          </button>
        </div>
      </form>
    </div>
  );
}
