import React, { useState, useEffect } from 'react';
import { MessageSquareCode, Mic, MicOff, Sparkles, CheckCircle2, AlertCircle, HelpCircle, ArrowRight, Play, RotateCcw } from 'lucide-react';
import { api } from '../../services/api';

export default function MockInterviewModule({ student, onInterviewCompleted }) {
  const [selectedRole, setSelectedRole] = useState('Software Development Engineer (SDE)');
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [responseText, setResponseText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [showIdeal, setShowIdeal] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [timerActive, setTimerActive] = useState(false);

  // Load questions for the selected role
  useEffect(() => {
    let mounted = true;
    async function loadQuestions() {
      try {
        const res = await api.getInterviewQuestions(selectedRole);
        if (mounted && res.success && res.questions) {
          setQuestions(res.questions);
          setCurrentIdx(0);
          setResponseText('');
          setEvaluation(null);
          setShowIdeal(false);
        }
      } catch (err) {
        console.error("Error loading interview questions:", err);
      }
    }
    loadQuestions();
    return () => { mounted = false; };
  }, [selectedRole]);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const currentQ = questions[currentIdx] || null;

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimerActive(true);
      // Simulate real-time speech input if empty
      if (!responseText) {
        setResponseText(
          "In modern systems, a process is an isolated execution context with dedicated virtual memory and page tables, whereas threads are lightweight threads of execution inside that process that share the heap and address space. For inter-process communication, we rely on IPC mechanisms like unix domain sockets, shared memory buffers, message queues, and pipes."
        );
      }
    } else {
      setIsRecording(false);
      setTimerActive(false);
    }
  };

  const handleEvaluate = async () => {
    if (!currentQ || !responseText.trim()) return;
    setEvaluating(true);
    try {
      const res = await api.evaluateInterview({
        questionId: currentQ.id,
        responseText,
        role: selectedRole,
        studentId: student?.id
      });
      if (res.success && res.data) {
        setEvaluation(res.data);
        if (onInterviewCompleted) {
          onInterviewCompleted(res.data.score);
        }
      }
    } catch (err) {
      console.error("Evaluation error:", err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setResponseText('');
      setEvaluation(null);
      setShowIdeal(false);
      setTimerSeconds(120);
      setTimerActive(false);
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <MessageSquareCode className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              AI Mock Interview Simulator
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-indigo-100 text-indigo-800">
              Verbal & Technical Feedback
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time simulated technical interview evaluated on conceptual depth, clarity, keyword coverage, and STAR formulation.
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">Track:</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="Software Development Engineer (SDE)">Software Development Engineer (SDE)</option>
            <option value="Full Stack Web Developer">Full Stack Web Developer</option>
            <option value="AI / Machine Learning Engineer">AI / Machine Learning Engineer</option>
            <option value="Behavioral & HR Round">Behavioral & HR Round</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {currentQ ? (
        <div className="pt-6 space-y-6">
          {/* Question Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 font-semibold border border-indigo-400/30">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300 font-medium">{currentQ.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-xs font-semibold">
                  Difficulty: {currentQ.difficulty}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-800 font-mono text-xs text-indigo-300 border border-slate-700">
                  ⏱ {formatTimer(timerSeconds)}
                </span>
              </div>
            </div>

            <h4 className="text-base sm:text-lg font-bold leading-snug text-white">
              "{currentQ.question}"
            </h4>
          </div>

          {/* Response Box & Input Controls */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <span>Your Verbal / Written Technical Response:</span>
              </label>

              <button
                onClick={toggleRecording}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition ${
                  isRecording 
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-indigo-600" />}
                <span>{isRecording ? 'Listening / Transcribing...' : 'Simulate Voice Response'}</span>
              </button>
            </div>

            <textarea
              rows={5}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Type or dictate your technical explanation, architectural approach, and key definitions..."
              className="w-full text-xs font-normal p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
            />

            <div className="flex items-center justify-between mt-3">
              <span className="text-[11px] text-slate-400">
                Word Count: {responseText.trim() ? responseText.trim().split(/\s+/).length : 0} words
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setResponseText('')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-500 hover:bg-slate-100 transition"
                >
                  Clear
                </button>
                <button
                  onClick={handleEvaluate}
                  disabled={evaluating || !responseText.trim()}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 disabled:opacity-50 transition"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${evaluating ? 'animate-spin' : ''}`} />
                  <span>{evaluating ? 'Evaluating Answer...' : 'Evaluate with AI'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI Feedback & Score Card */}
          {evaluation && (
            <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-200/60">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex flex-col items-center justify-center font-black">
                    <span className="text-base leading-none">{evaluation.score}</span>
                    <span className="text-[9px] uppercase font-semibold opacity-80">/ 100</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">
                      AI Response Evaluation
                    </h5>
                    <p className="text-xs text-indigo-700 font-medium">
                      {evaluation.feedback}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="px-2.5 py-1 bg-white rounded-lg border border-indigo-100">
                    <span className="text-slate-400 block text-[10px] uppercase">Technical</span>
                    <strong className="text-slate-900">{evaluation.technicalScore}%</strong>
                  </div>
                  <div className="px-2.5 py-1 bg-white rounded-lg border border-indigo-100">
                    <span className="text-slate-400 block text-[10px] uppercase">Clarity</span>
                    <strong className="text-slate-900">{evaluation.clarityScore}%</strong>
                  </div>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-indigo-100">
                  <span className="font-bold text-emerald-700 flex items-center gap-1.5 mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Key Strengths
                  </span>
                  <ul className="space-y-1 text-slate-600">
                    {(evaluation.keyStrengths || []).map((s, idx) => (
                      <li key={idx}>• {s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-white rounded-xl border border-indigo-100">
                  <span className="font-bold text-amber-700 flex items-center gap-1.5 mb-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> High-Impact Improvements
                  </span>
                  <ul className="space-y-1 text-slate-600">
                    {(evaluation.areasForImprovement || []).map((s, idx) => (
                      <li key={idx}>• {s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Ideal Answer Toggle */}
              <div className="pt-2">
                <button
                  onClick={() => setShowIdeal(!showIdeal)}
                  className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showIdeal ? 'Hide Model Answer' : 'View Recommended Industry Model Answer'}</span>
                </button>

                {showIdeal && (
                  <div className="mt-2.5 p-3.5 rounded-xl bg-white border border-indigo-200 text-xs text-slate-700 leading-relaxed font-mono">
                    {evaluation.idealAnswer}
                  </div>
                )}
              </div>

              {/* Next Question Navigation */}
              {currentIdx < questions.length - 1 && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      ) : (
        <div className="py-12 text-center text-slate-400 text-xs">
          Loading questions for selected track...
        </div>
      )}
    </div>
  );
}
