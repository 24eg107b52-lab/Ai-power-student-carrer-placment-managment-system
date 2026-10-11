import React, { useState } from 'react';
import { X, FileText, Sparkles, Check, AlertCircle, ArrowRight, UploadCloud } from 'lucide-react';
import { api } from '../../services/api';

export default function ResumeParserModal({ isOpen, onClose, onSkillsExtracted, currentStudent }) {
  const [resumeText, setResumeText] = useState(
    `Aarav Sharma\nComputer Science & Engineering | CGPA: 9.12\nEmail: aarav.sharma@campus.edu | Phone: +91 98765 43210\n\nPROFESSIONAL SUMMARY:\nAspiring Software Development Engineer & Machine Learning researcher with robust hands-on experience in PyTorch, Python, Deep Learning, and Data Structures.\n\nTECHNICAL SKILLS:\nLanguages: Python, Java, C++, SQL, JavaScript\nFrameworks: PyTorch, TensorFlow, React, FastAPI, Docker\nDatabases & Cloud: PostgreSQL, AWS, Git, Linux, Kubernetes\nFoundations: Algorithms, System Design, Object-Oriented Programming\n\nPROJECTS:\n1. AI Placement Recommendation Engine - Implemented TF-IDF and Cosine similarity for matching candidate resumes to job postings.\n2. Distributed Task Queue - Engineered an asynchronous job processor using Redis, Python, and Docker containerization.`
  );
  const [parsing, setParsing] = useState(false);
  const [parseResult, setParseResult] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleParse = async () => {
    if (!resumeText.trim()) return;
    setParsing(true);
    setError(null);
    try {
      const res = await api.parseResume(resumeText);
      if (res.success && res.data) {
        setParseResult(res.data);
      } else {
        throw new Error('Failed to parse text');
      }
    } catch (err) {
      setError(err.message || 'Error executing NLP parser');
    } finally {
      setParsing(false);
    }
  };

  const handleApply = () => {
    if (parseResult && parseResult.extractedSkills) {
      onSkillsExtracted(parseResult.extractedSkills, parseResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                AI NLP Resume Parser
              </h3>
              <p className="text-xs text-slate-500">
                Extract technical competencies, academic stats, and verified skills
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Paste Resume Content or Raw Text:
            </label>
            <textarea
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste raw resume or CV text here..."
              className="w-full text-xs font-mono p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              {resumeText.split(/\s+/).filter(Boolean).length} words detected
            </span>
            <button
              onClick={handleParse}
              disabled={parsing || !resumeText.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 disabled:opacity-50 transition"
            >
              <Sparkles className={`w-3.5 h-3.5 ${parsing ? 'animate-spin' : ''}`} />
              <span>{parsing ? 'Parsing with NLP...' : 'Run NLP Skill Extractor'}</span>
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Parsed Result Preview */}
          {parseResult && (
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  NLP Extraction Complete
                </span>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  {parseResult.extractedSkills.length} Skills Identified
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white rounded-lg border border-blue-100">
                  <span className="text-[10px] text-slate-400 block uppercase">Extracted Email</span>
                  <span className="font-semibold text-slate-800">{parseResult.email || 'None'}</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-blue-100">
                  <span className="text-[10px] text-slate-400 block uppercase">Detected Degree</span>
                  <span className="font-semibold text-slate-800">{parseResult.educationHint}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-700 block mb-1.5">
                  Extracted Technical Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {parseResult.extractedSkills.map(sk => (
                    <span
                      key={sk}
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-white text-blue-800 border border-blue-200 shadow-xs"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-200/60 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!parseResult}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 disabled:opacity-50 transition"
          >
            <span>Update Student Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
