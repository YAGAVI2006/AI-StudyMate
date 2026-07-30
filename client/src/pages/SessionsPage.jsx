import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Clock, Play, Plus, Trash2, Calendar, FileText } from 'lucide-react';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Table from '../components/Table';

const SessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    duration: 45,
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const fetchData = async () => {
    try {
      const [sessRes, subjRes] = await Promise.all([
        api.get('/sessions'),
        api.get('/subjects'),
      ]);
      setSessions(sessRes.data);
      setSubjects(subjRes.data);
      if (subjRes.data.length > 0 && !formData.subject) {
        setFormData((prev) => ({ ...prev, subject: subjRes.data[0].subjectName }));
      }
    } catch (err) {
      console.error('Error loading study sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      subject: subjects.length > 0 ? subjects[0].subjectName : 'Java Programming',
      topic: '',
      duration: 45,
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/sessions', formData);
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error saving study session:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/sessions/${id}`);
      fetchData();
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  if (loading) {
    return <Loader message="Loading study sessions..." />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-[#2563EB]" /> Study Sessions
          </h1>
          <p className="text-slate-500 text-xs">Log and track time spent on specific subjects and topics</p>
        </div>

        <Button onClick={handleOpenModal} icon={Plus}>
          Log New Session
        </Button>
      </div>

      {/* Study Sessions Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-lg">Session History</h3>

        <Table headers={['Subject', 'Topic', 'Duration', 'Date', 'Notes', 'Actions']}>
          {sessions.length > 0 ? (
            sessions.map((sess) => (
              <tr key={sess._id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900">{sess.subject}</td>
                <td className="py-3.5 px-4 text-slate-700">{sess.topic}</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#2563EB] font-bold text-xs">
                    ⏱ {sess.duration} mins
                  </span>
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-500">
                  {new Date(sess.date).toLocaleDateString()}
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-500 max-w-xs truncate">
                  {sess.notes || '—'}
                </td>
                <td className="py-3.5 px-4">
                  <button
                    onClick={() => handleDelete(sess._id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-8 text-slate-400 italic">
                No study sessions recorded yet. Click "Log New Session" to begin.
              </td>
            </tr>
          )}
        </Table>
      </div>

      {/* Log Session Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Study Session">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Choose Subject *</label>
            {subjects.length > 0 ? (
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-white border rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB] outline-none"
              >
                {subjects.map((sub) => (
                  <option key={sub._id} value={sub.subjectName}>
                    {sub.subjectName}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                required
                placeholder="e.g. Java Programming"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-white border rounded-xl py-2.5 px-3 text-sm outline-none"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Topic Covered *</label>
            <input
              type="text"
              required
              placeholder="e.g. Multithreading & Executors"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              className="w-full bg-white border rounded-xl py-2.5 px-3 text-sm outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Duration (minutes) *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full bg-white border rounded-xl py-2.5 px-3 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-white border rounded-xl py-2.5 px-3 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Session Notes</label>
            <textarea
              rows={3}
              placeholder="Summary of what you learned or key formulas..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-white border rounded-xl p-3 text-sm outline-none"
            />
          </div>

          <div className="flex gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="w-1/2">
              Cancel
            </Button>
            <Button type="submit" className="w-1/2">
              Save Session
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SessionsPage;
