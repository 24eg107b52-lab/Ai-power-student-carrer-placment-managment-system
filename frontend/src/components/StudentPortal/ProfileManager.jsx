import React, { useState } from 'react';
import { User, Mail, Phone, BookOpen, Sparkles, Plus, X, Save, FileUp } from 'lucide-react';

export default function ProfileManager({ student, onUpdateProfile, onOpenResumeParser }) {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    phone: student?.phone || '',
    department: student?.department || 'CSE',
    batch: student?.batch || '2026',
    cgpa: student?.cgpa || 8.5,
    targetRole: student?.targetRole || 'Software Development Engineer (SDE)',
    bio: student?.bio || '',
    skills: student?.skills || [],
    certifications: student?.certifications || []
  });

  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim().toLowerCase()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleAddCert = (e) => {
    e.preventDefault();
    if (newCert.trim() && !formData.certifications.includes(newCert.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCert.trim()]
      }));
      setNewCert('');
    }
  };

  const handleRemoveCert = (certToRemove) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== certToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await onUpdateProfile(student.id, formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <User className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Student Academic Profile & Competencies
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-800">
              Self-Service Hub
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Keep your academic stats, verified skills, and certifications up-to-date for accurate AI matching.
          </p>
        </div>

        <button
          onClick={onOpenResumeParser}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition"
        >
          <FileUp className="w-3.5 h-3.5" />
          <span>Upload & Parse Resume</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="pt-6 space-y-6">
        {/* Core Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Institutional Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 font-semibold"
            >
              <option value="CSE">Computer Science & Engineering (CSE)</option>
              <option value="IT">Information Technology (IT)</option>
              <option value="ECE">Electronics & Communication (ECE)</option>
              <option value="MECH">Mechanical Engineering (MECH)</option>
              <option value="CIVIL">Civil Engineering (CIVIL)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Current Cumulative CGPA</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={formData.cgpa}
              onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Role Track</label>
            <select
              value={formData.targetRole}
              onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 font-semibold text-indigo-700"
            >
              <option value="Software Development Engineer (SDE)">Software Development Engineer (SDE)</option>
              <option value="Full Stack Web Developer">Full Stack Web Developer</option>
              <option value="AI / Machine Learning Engineer">AI / Machine Learning Engineer</option>
              <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer</option>
              <option value="Data Analyst / BI Specialist">Data Analyst / BI Specialist</option>
            </select>
          </div>
        </div>

        {/* Bio / Summary */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Career Objective & Bio</label>
          <textarea
            rows={2}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50"
          />
        </div>

        {/* Verified Technical Skills Tag Manager */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-700">Verified Technical Skills:</label>
            <span className="text-[11px] text-slate-400">{formData.skills.length} skills listed</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3 p-3 rounded-xl bg-slate-50 border border-slate-200 min-h-[46px]">
            {formData.skills.map(sk => (
              <span
                key={sk}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-blue-800 border border-blue-200 shadow-xs flex items-center gap-1.5"
              >
                <span>{sk}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(sk)}
                  className="text-slate-400 hover:text-rose-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add skill (e.g. docker, pytorch, react)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 w-64"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Certifications Manager */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-700">Industry Certifications:</label>
            <span className="text-[11px] text-slate-400">{formData.certifications.length} listed</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3 p-3 rounded-xl bg-slate-50 border border-slate-200 min-h-[46px]">
            {formData.certifications.map(c => (
              <span
                key={c}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-emerald-800 border border-emerald-200 shadow-xs flex items-center gap-1.5"
              >
                <span>{c}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCert(c)}
                  className="text-slate-400 hover:text-rose-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add certification (e.g. AWS Solutions Architect, Coursera ML)..."
              value={newCert}
              onChange={(e) => setNewCert(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 flex-1 max-w-md"
            />
            <button
              type="button"
              onClick={handleAddCert}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 animate-fade-in">
                ✓ Profile saved and Employability Score updated!
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 disabled:opacity-50 transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Profile & Recalculate'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
