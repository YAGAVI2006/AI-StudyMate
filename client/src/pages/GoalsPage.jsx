import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Target, Plus, CheckCircle, Circle, Edit2, Trash2, Calendar, AlertCircle } from 'lucide-react';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import Button from '../components/Button';

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    targetDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    completed: false,
    priority: 'Medium',
  });

  const priorityColors = {
    High: 'bg-red-100 text-red-700 border-red-200',
    Medium: 'bg-amber-100 text-amber-700 border-amber-200',
    Low: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  const fetchGoals = async () => {
    try {
      const res = await api.get('/goals');
      setGoals(res.data);
    } catch (err) {
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleOpenAdd = () => {
    setEditingGoal(null);
    setFormData({
      title: '',
      targetDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      completed: false,
      priority: 'Medium',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      targetDate: new Date(goal.targetDate).toISOString().split('T')[0],
      completed: goal.completed || false,
      priority: goal.priority || 'Medium',
    });
    setIsModalOpen(true);
  };

  const toggleCompleted = async (goal) => {
    try {
      await api.put(`/goals/${goal._id}`, { completed: !goal.completed });
      fetchGoals();
    } catch (err) {
      console.error('Error toggling goal completion:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGoal) {
        await api.put(`/goals/${editingGoal._id}`, formData);
      } else {
        await api.post('/goals', formData);
      }
      setIsModalOpen(false);
      fetchGoals();
    } catch (err) {
      console.error('Error saving goal:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      fetchGoals();
    } catch (err) {
      console.error('Error deleting goal:', err);
    }
  };

  if (loading) {
    return <Loader message="Loading academic goals..." />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Target className="w-6 h-6 text-amber-500" /> Academic Goals
          </h1>
          <p className="text-slate-500 text-xs">Set deadlines and track study milestones</p>
        </div>

        <Button onClick={handleOpenAdd} icon={Plus}>
          Create New Goal
        </Button>
      </div>

      {/* Goals Grid */}
      {goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <div
              key={goal._id}
              className={`p-6 rounded-3xl border shadow-sm hover-lift flex flex-col justify-between space-y-4 transition-all ${
                goal.completed
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-white border-slate-200/80'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleCompleted(goal)}
                    className="flex items-center gap-2 text-xs font-bold focus:outline-none"
                  >
                    {goal.completed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400 hover:text-blue-600" />
                    )}
                    <span className={goal.completed ? 'text-emerald-700' : 'text-slate-500'}>
                      {goal.completed ? 'Completed' : 'In Progress'}
                    </span>
                  </button>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      priorityColors[goal.priority] || priorityColors.Medium
                    }`}
                  >
                    {goal.priority} Priority
                  </span>
                </div>

                <h3
                  className={`text-lg font-bold leading-snug ${
                    goal.completed ? 'line-through text-slate-500' : 'text-slate-900'
                  }`}
                >
                  {goal.title}
                </h3>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-semibold">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Target: {new Date(goal.targetDate).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(goal)}
                    className="p-1.5 text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(goal._id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 space-y-4">
          <Target className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700">No Goals Created Yet</h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            Click "Create New Goal" to add your first study milestone.
          </p>
          <Button onClick={handleOpenAdd} icon={Plus}>
            Create First Goal
          </Button>
        </div>
      )}

      {/* Add / Edit Goal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGoal ? 'Edit Goal' : 'Create New Goal'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Goal Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Master Tree Traversal Algorithms"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-white border rounded-xl py-2.5 px-3 text-sm outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Date *</label>
              <input
                type="date"
                required
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full bg-white border rounded-xl py-2.5 px-3 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-white border rounded-xl py-2.5 px-3 text-sm outline-none"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="w-1/2">
              Cancel
            </Button>
            <Button type="submit" className="w-1/2">
              {editingGoal ? 'Save Changes' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GoalsPage;
