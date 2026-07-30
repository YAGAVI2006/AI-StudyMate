import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { BookOpen, Plus, Edit2, Trash2, CheckCircle2, Layers } from 'lucide-react';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Input from '../components/Input';
import ProgressBar from '../components/ProgressBar';

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    subjectName: '',
    color: '#2563EB',
    totalTopics: 10,
    completedTopics: 0,
  });

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/subjects');
      setSubjects(res.data);
    } catch (err) {
      console.error('Error fetching subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleOpenAddModal = () => {
    setEditingSubject(null);
    setFormData({
      subjectName: '',
      color: '#2563EB',
      totalTopics: 10,
      completedTopics: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sub) => {
    setEditingSubject(sub);
    setFormData({
      subjectName: sub.subjectName,
      color: sub.color || '#2563EB',
      totalTopics: sub.totalTopics || 10,
      completedTopics: sub.completedTopics || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await api.put(`/subjects/${editingSubject._id}`, formData);
      } else {
        await api.post('/subjects', formData);
      }
      setIsModalOpen(false);
      fetchSubjects();
    } catch (err) {
      console.error('Error saving subject:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/subjects/${id}`);
      setDeleteConfirmId(null);
      fetchSubjects();
    } catch (err) {
      console.error('Error deleting subject:', err);
    }
  };

  if (loading) {
    return <Loader message="Loading subject modules..." />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-[#2563EB]" /> Subject Management
          </h1>
          <p className="text-slate-500 text-xs">Organize your academic courses and topic progress</p>
        </div>

        <Button onClick={handleOpenAddModal} icon={Plus}>
          Add New Subject
        </Button>
      </div>

      {/* Subjects Cards Grid */}
      {subjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub) => {
            const completed = sub.completedTopics || 0;
            const total = sub.totalTopics || 1;
            const percentage = Math.round((completed / total) * 100);

            return (
              <div
                key={sub._id}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover-lift flex flex-col justify-between space-y-6 relative group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md"
                      style={{ backgroundColor: sub.color || '#2563EB' }}
                    >
                      {sub.subjectName ? sub.subjectName.charAt(0) : 'S'}
                    </span>

                    <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEditModal(sub)}
                        title="Edit Subject"
                        className="p-2 text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(sub._id)}
                        title="Delete Subject"
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 leading-snug">
                    {sub.subjectName}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold pt-1">
                    <span>
                      Topics: <strong className="text-slate-800">{completed}</strong> / {total}
                    </span>
                    <span className="text-[#2563EB] font-bold">{percentage}%</span>
                  </div>

                  <ProgressBar progress={percentage} color={sub.color || '#2563EB'} height="h-3" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 space-y-4">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700">No Subjects Created Yet</h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            Click "Add New Subject" to create your first academic module.
          </p>
          <Button onClick={handleOpenAddModal} icon={Plus}>
            Add First Subject
          </Button>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? 'Edit Subject' : 'Add New Subject'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Subject Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Java Programming"
              value={formData.subjectName}
              onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
              className="w-full bg-white border rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total Topics</label>
              <input
                type="number"
                min="1"
                required
                value={formData.totalTopics}
                onChange={(e) => setFormData({ ...formData, totalTopics: e.target.value })}
                className="w-full bg-white border rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Completed Topics</label>
              <input
                type="number"
                min="0"
                required
                value={formData.completedTopics}
                onChange={(e) => setFormData({ ...formData, completedTopics: e.target.value })}
                className="w-full bg-white border rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Theme Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-1"
              />
              <span className="text-xs text-slate-500 font-mono">{formData.color}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="w-1/2">
              Cancel
            </Button>
            <Button type="submit" className="w-1/2">
              {editingSubject ? 'Save Changes' : 'Create Subject'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <Modal
          isOpen={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId(null)}
          title="Confirm Delete"
        >
          <div className="space-y-4 text-center">
            <p className="text-sm text-slate-600">
              Are you sure you want to delete this subject? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className="w-1/2">
                Cancel
              </Button>
              <Button variant="danger" onClick={() => handleDelete(deleteConfirmId)} className="w-1/2">
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SubjectsPage;
