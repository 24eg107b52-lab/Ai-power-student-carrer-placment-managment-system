import React, { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle, XCircle, Award, RotateCcw, Send, Sparkles } from 'lucide-react';
import { api } from '../../services/api';

export default function AptitudeAssessment({ student, onTestCompleted }) {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadTest();
  }, []);

  const loadTest = async () => {
    try {
      const res = await api.getAptitudeTest();
      if (res.success && res.data) {
        setQuestions(res.data);
        setSelectedAnswers({});
        setResult(null);
      }
    } catch (err) {
      console.error("Error loading aptitude test:", err);
    }
  };

  const handleSelectOption = (qId, optionIdx) => {
    if (result) return; // Locked once submitted
    setSelectedAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length === 0) return;
    setSubmitting(true);
    try {
      const res = await api.submitAptitude({
        answers: selectedAnswers,
        studentId: student?.id
      });
      if (res.success) {
        setResult(res);
        if (onTestCompleted) {
          onTestCompleted(res.scorePercent);
        }
      }
    } catch (err) {
      console.error("Error grading aptitude test:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Award className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              AI Campus Aptitude & Coding Screening Test
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800">
              Quantitative • Logical • CS Core
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Standardized placement round assessment designed to calibrate your algorithmic and numerical problem-solving speed.
          </p>
        </div>

        {result && (
          <button
            onClick={loadTest}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Test</span>
          </button>
        )}
      </div>

      {/* Result Card if submitted */}
      {result && (
        <div className="my-6 p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex flex-col items-center justify-center font-black">
              <span className="text-xl leading-none">{result.scorePercent}%</span>
              <span className="text-[10px] uppercase font-bold">Score</span>
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Test Completed: {result.correctCount} of {result.totalQuestions} Correct
              </h4>
              <p className="text-xs text-indigo-200">
                Score has been dynamically incorporated into your Employability Scorecard.
              </p>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-semibold text-amber-300">
            {result.scorePercent >= 80 ? '🌟 Tier-1 Benchmark Qualified' : '📚 Review Explanations Below'}
          </div>
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-6 pt-6">
        {questions.map((q, idx) => {
          const detail = result?.detailedResults?.find(r => r.id === q.id);
          const isAnswered = selectedAnswers[q.id] !== undefined;

          return (
            <div
              key={q.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                detail
                  ? detail.isCorrect
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-rose-200 bg-rose-50/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400">
                  Question {idx + 1} • <span className="text-indigo-600 font-semibold">{q.category}</span>
                </span>
                {detail && (
                  <span className={`text-xs font-bold flex items-center gap-1 ${detail.isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {detail.isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span>{detail.isCorrect ? 'Correct' : 'Incorrect'}</span>
                  </span>
                )}
              </div>

              <h4 className="text-sm font-semibold text-slate-900 mb-3.5">
                {q.question}
              </h4>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[q.id] === optIdx;
                  let optStyle = 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100';

                  if (detail) {
                    if (optIdx === detail.correctIndex) {
                      optStyle = 'border-emerald-500 bg-emerald-100 text-emerald-900 font-bold';
                    } else if (isSelected && !detail.isCorrect) {
                      optStyle = 'border-rose-500 bg-rose-100 text-rose-900 line-through';
                    } else {
                      optStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                    }
                  } else if (isSelected) {
                    optStyle = 'border-blue-600 bg-blue-50 text-blue-900 font-semibold ring-2 ring-blue-500/30';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`text-left p-3 rounded-xl border text-xs transition-all flex items-center gap-2.5 ${optStyle}`}
                    >
                      <span className="w-5 h-5 rounded-md border flex items-center justify-center text-[10px] font-bold bg-white/80">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Explanation */}
              {detail && (
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600">
                  <strong className="text-slate-800">Explanation: </strong>
                  {detail.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!result && (
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {Object.keys(selectedAnswers).length} of {questions.length} answered
          </span>
          <button
            onClick={handleSubmit}
            disabled={submitting || Object.keys(selectedAnswers).length === 0}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 disabled:opacity-50 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'Grading Test...' : 'Submit Aptitude Test'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
