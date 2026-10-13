// AI-Powered Student Career & Placement Management System
// Master Client Logic & Real-Time AI Engines

// ==========================================
// DEPLOYMENT CONFIG — update after Render deploy
// ==========================================
const API_BASE = 'https://YOUR-RENDER-APP.onrender.com';

let currentRole = 'STUDENT';
let currentStudentId = 1;
let currentSelectedJobId = 1;
let currentQuestions = [];
let radarChartInstance = null;
let deptBarChartInstance = null;
let monthlyTrendChartInstance = null;
let topRecruitersChartInstance = null;
let recognition = null;
let isRecording = false;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();
  loadStudentProfile(currentStudentId);
  loadJobRecommendations();
  loadInterviewQuestions();
  loadAptitudeQuestions();
  loadAnalyticsDashboard();
  loadRecruiterJobs();
  loadUpskillingResources();
  initSpeechRecognition();
});

// Role Switcher
function switchRole(role) {
  currentRole = role;
  document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  if (role === 'STUDENT') {
    openTab('tab-student');
  } else if (role === 'TPO') {
    openTab('tab-analytics');
  } else if (role === 'RECRUITER') {
    openTab('tab-recruiter');
  } else if (role === 'FACULTY') {
    openTab('tab-analytics');
  }
}

// Tab Switching
function openTab(tabId) {
  document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));

  const targetPane = document.getElementById(tabId);
  if (targetPane) targetPane.classList.add('active');

  const matchingBtn = Array.from(document.querySelectorAll('.nav-tab')).find(b => b.getAttribute('onclick')?.includes(tabId));
  if (matchingBtn) matchingBtn.classList.add('active');

  if (tabId === 'tab-analytics') {
    loadAnalyticsDashboard();
  } else if (tabId === 'tab-recruiter') {
    loadRecruiterCandidates(currentSelectedJobId);
  } else if (tabId === 'tab-matching') {
    loadJobRecommendations();
  }
}

// ==========================================
// 1. NEURAL NETWORK CANVAS ANIMATION (Fig 1)
// ==========================================
function initNeuralCanvas() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 320;
  }
  resize();
  window.addEventListener('resize', resize);

  // Layers matching Fig 1
  // Input: Student Attributes (Academics, Skills, Aptitude)
  // Hidden 1 & 2: Feature extractors / Weights
  // Output: Job Fit, Employability Score, Recruiter Ranking
  const layerCounts = [3, 5, 6, 5, 3];
  const layers = [];

  function setupNodes() {
    layers.length = 0;
    const marginX = canvas.width * 0.1;
    const stepX = (canvas.width - marginX * 2) / (layerCounts.length - 1);

    for (let l = 0; l < layerCounts.length; l++) {
      const count = layerCounts[l];
      const stepY = canvas.height / (count + 1);
      const layerNodes = [];
      for (let n = 0; n < count; n++) {
        layerNodes.push({
          x: marginX + l * stepX,
          y: stepY * (n + 1),
          r: (l === 0 || l === layerCounts.length - 1) ? 9 : 8,
          color: (l === 0 || l === layerCounts.length - 1) ? '#f59e0b' : (l === 2 ? '#38bdf8' : '#1e3a8a')
        });
      }
      layers.push(layerNodes);
    }
  }

  setupNodes();

  let t = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += 0.03;

    // Draw Synapses
    for (let l = 0; l < layers.length - 1; l++) {
      const current = layers[l];
      const next = layers[l + 1];

      for (let i = 0; i < current.length; i++) {
        for (let j = 0; j < next.length; j++) {
          const alpha = 0.15 + 0.12 * Math.sin(t + i + j + l);
          ctx.beginPath();
          ctx.moveTo(current[i].x, current[i].y);
          ctx.lineTo(next[j].x, next[j].y);
          ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Draw Active Pulses
    const activeLayer = Math.floor((t * 1.5) % (layers.length - 1));
    const currNodes = layers[activeLayer];
    const nxtNodes = layers[activeLayer + 1];
    const progress = (t * 1.5) % 1;

    for (let i = 0; i < Math.min(currNodes.length, 3); i++) {
      const start = currNodes[i];
      const target = nxtNodes[(i + 1) % nxtNodes.length];
      const px = start.x + (target.x - start.x) * progress;
      const py = start.y + (target.y - start.y) * progress;

      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#38bdf8';
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Draw Nodes
    for (let l = 0; l < layers.length; l++) {
      const layerNodes = layers[l];
      for (let n = 0; n < layerNodes.length; n++) {
        const node = layerNodes[n];
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

// ==========================================
// 2. STUDENT CAREER PORTAL & EMPLOYABILITY
// ==========================================
async function loadStudentProfile(studentId) {
  try {
    const res = await fetch(API_BASE + `/api/students/${studentId}`);
    if (!res.ok) return;
    const s = await res.json();

    document.getElementById('student-name-header').innerText = s.name;
    document.getElementById('student-roll-header').innerText = s.rollNumber;
    document.getElementById('student-dept-header').innerText = s.department;
    document.getElementById('student-target-header').innerText = s.targetRole || 'Full Stack Developer';
    document.getElementById('student-status-badge').innerText = s.placementStatus;

    if (s.placementStatus === 'PLACED') {
      document.getElementById('student-status-badge').className = 'badge badge-green';
      document.getElementById('student-status-badge').innerText = `PLACED @ ${s.placedCompany || 'Google'} (${s.offeredCtcLpa || 32} LPA)`;
    }

    // Employability Dial
    const empScore = s.employabilityScore || 85.2;
    document.getElementById('employability-num').innerText = empScore.toFixed(1);

    // Update SVG stroke offset (circumference 440)
    const circle = document.getElementById('employability-circle');
    const offset = 440 - (440 * (empScore / 100));
    circle.style.strokeDashoffset = offset;

    // Pillar Scores
    updateBar('bar-academic', 'bar-academic-val', s.academicScore || 88.5);
    updateBar('bar-tech', 'bar-tech-val', s.technicalScore || 84.0);
    updateBar('bar-apt', 'bar-apt-val', s.aptitudeScore || 85.0);
    updateBar('bar-interview', 'bar-interview-val', s.interviewScore || 82.0);
    updateBar('bar-proj', 'bar-proj-val', 90.0);

    // Render Competency Radar Chart
    renderCompetencyRadar(s);

    // Render Skill Gap Analysis
    loadScoreBreakdown(studentId);

  } catch (err) {
    console.error('Error loading student profile:', err);
  }
}

function updateBar(barId, valId, val) {
  const rounded = Math.round(val * 10) / 10;
  document.getElementById(barId).style.width = `${rounded}%`;
  document.getElementById(valId).innerText = `${rounded}%`;
}

function renderCompetencyRadar(student) {
  const ctx = document.getElementById('competencyRadarChart');
  if (!ctx) return;

  if (radarChartInstance) {
    radarChartInstance.destroy();
  }

  radarChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Academics', 'Core Tech', 'Aptitude', 'Mock Interview', 'Projects & Certs', 'System Design'],
      datasets: [
        {
          label: 'Candidate Competency',
          data: [
            student.academicScore || 88.5,
            student.technicalScore || 84.0,
            student.aptitudeScore || 85.0,
            student.interviewScore || 82.0,
            90.0,
            78.0
          ],
          backgroundColor: 'rgba(37, 99, 235, 0.2)',
          borderColor: '#2563eb',
          borderWidth: 2,
          pointBackgroundColor: '#2563eb'
        },
        {
          label: 'Industry Benchmark',
          data: [75, 80, 75, 75, 70, 75],
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: '#10b981',
          borderWidth: 1.5,
          borderDash: [4, 4],
          pointBackgroundColor: '#10b981'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          suggestedMin: 30,
          suggestedMax: 100,
          ticks: { display: false }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 10 } }
        }
      }
    }
  });
}

async function loadScoreBreakdown(studentId) {
  try {
    const res = await fetch(API_BASE + `/api/students/${studentId}/score-breakdown`);
    if (!res.ok) return;
    const breakdown = await res.json();

    document.getElementById('readiness-tier-badge').innerText = breakdown.careerReadinessTier || 'Placement Ready';

    const gapContainer = document.getElementById('skill-gap-container');
    gapContainer.innerHTML = '';

    if (breakdown.identifiedSkillGaps && breakdown.identifiedSkillGaps.length > 0) {
      breakdown.identifiedSkillGaps.forEach(gap => {
        const item = document.createElement('div');
        item.style.cssText = 'display:flex; justify-content:space-between; align-items:center; background:#fef3c7; padding:0.6rem 0.85rem; border-radius:6px; border:1px solid #fde68a;';
        item.innerHTML = `
          <div>
            <strong style="color:#92400e; font-size:0.85rem;">⚠️ Missing Core Skill: ${gap.toUpperCase()}</strong>
            <div style="font-size:0.75rem; color:#78350f;">Industry frequency in target job drives: High (85%+)</div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="openTab('tab-upskilling')">Start Learning</button>
        `;
        gapContainer.appendChild(item);
      });
    } else {
      gapContainer.innerHTML = `
        <div style="background:#ecfdf5; padding:0.75rem; border-radius:6px; color:#065f46; font-size:0.85rem;">
          🎉 Outstanding! You cover all core skills for your target role. Continue honing system design and mock interviews.
        </div>
      `;
    }
  } catch (err) {
    console.error('Error loading score breakdown:', err);
  }
}

async function recalculateScore() {
  try {
    const res = await fetch(API_BASE + `/api/students/${currentStudentId}/recalculate-score`, { method: 'POST' });
    if (res.ok) {
      alert('⚡ Employability Score refreshed with latest multi-factor model.');
      loadStudentProfile(currentStudentId);
    }
  } catch (err) {
    alert('Error recalculating score');
  }
}

// Resume Parser
function loadSampleResume() {
  document.getElementById('resumeInput').value = 
`Vivek Sharma | 2021BCSE042 | vivek.sharma@college.edu | +91 9876543210
Education:
B.Tech in Computer Science & Engineering, Final Year. Current CGPA: 8.85
High School: 92.4%

Technical Skills:
Java, Spring Boot, Microservices, REST APIs, Hibernate, PostgreSQL, SQL, Docker, Kubernetes, AWS, Git, Data Structures, Algorithms, System Design, Python, React.js

Projects:
• AI-Powered Placement Management Portal: Built full-stack platform in Spring Boot with NLP Cosine matching & speech analysis.
• Microservices Banking Engine: Scalable distributed services with Docker containerization and Redis caching.

Certifications:
• Oracle Certified Java SE 11 Developer
• AWS Certified Cloud Practitioner`;
}

async function parseResume() {
  const text = document.getElementById('resumeInput').value;
  if (!text || text.trim().length < 20) {
    alert('Please enter or load resume content to parse.');
    return;
  }

  try {
    const res = await fetch(API_BASE + `/api/students/${currentStudentId}/resume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText: text })
    });

    if (res.ok) {
      const data = await res.json();
      const output = document.getElementById('resume-parsed-output');
      output.style.display = 'block';
      output.innerHTML = `
        <div style="font-weight:700; color:#1e40af; margin-bottom:0.4rem;">✅ AI Resume Extraction Succeeded:</div>
        <div><strong>Extracted Candidate:</strong> ${data.candidateName || 'Vivek Sharma'} (${data.email || 'N/A'})</div>
        <div><strong>Detected CGPA:</strong> ${data.detectedCgpa || 8.85}</div>
        <div style="margin-top:0.3rem;"><strong>Skills Extracted (${data.extractedSkills.length}):</strong></div>
        <div class="skill-tags" style="margin-bottom:0.5rem;">
          ${data.extractedSkills.map(s => `<span class="skill-tag" style="background:#dbeafe; color:#1e40af;">${s}</span>`).join('')}
        </div>
        <div><strong>Projects Detected:</strong> ${data.extractedProjects.length} projects</div>
        <div><strong>Certifications Detected:</strong> ${data.extractedCertifications.join(', ') || 'N/A'}</div>
      `;

      loadStudentProfile(currentStudentId);
      loadJobRecommendations();
    }
  } catch (err) {
    alert('Failed to parse resume: ' + err);
  }
}

// ==========================================
// 3. AI JOB MATCHING & RECOMMENDATIONS (NLP)
// ==========================================
async function loadJobRecommendations() {
  const container = document.getElementById('job-recommendations-list');
  if (!container) return;
  container.innerHTML = '<div style="padding:1.5rem; text-align:center; color:#64748b;">Running NLP TF-IDF Cosine Matcher on active drives...</div>';

  try {
    const res = await fetch(API_BASE + `/api/matching/recommendations/${currentStudentId}`);
    if (!res.ok) return;
    const recommendations = await res.json();

    container.innerHTML = '';

    recommendations.forEach(rec => {
      const matchPct = rec.matchScore || 0;
      const isEligible = rec.eligible;
      const matchColor = matchPct >= 85 ? '#10b981' : (matchPct >= 70 ? '#2563eb' : '#f59e0b');

      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem; margin-bottom:1rem;">
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
              <h3 style="font-size:1.15rem; font-weight:800; color:#0f172a;">${rec.jobTitle}</h3>
              <span class="badge ${isEligible ? 'badge-green' : 'badge-red'}">${rec.eligibilityStatus}</span>
            </div>
            <div style="color:var(--text-muted); font-size:0.9rem; font-weight:600;">
              🏢 ${rec.company} • 📍 ${rec.location || 'Bangalore'} • 🎓 Eligibility: ${rec.departmentEligibility}
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:1.4rem; font-weight:800; color:#0f172a;">₹ ${rec.ctcLpa} LPA</div>
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">CTC Package</div>
          </div>
        </div>

        <!-- NLP Match Gauge Bar -->
        <div style="background:#f8fafc; padding:0.85rem 1.25rem; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:1rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
            <span style="font-size:0.85rem; font-weight:700; color:#334155;">
              NLP Fit Score: <span style="color:${matchColor}; font-size:1.05rem;">${matchPct.toFixed(1)}% Match</span> (${rec.recommendationTier})
            </span>
            <span style="font-size:0.75rem; color:var(--text-muted);">
              TF-IDF Similarity: ${(rec.tfidfSimilarity || 0.85).toFixed(3)}
            </span>
          </div>
          <div style="height:10px; background:#e2e8f0; border-radius:5px; overflow:hidden;">
            <div style="width:${matchPct}%; height:100%; background:${matchColor}; transition:width 0.5s;"></div>
          </div>
        </div>

        <!-- Skills Matching -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1rem; margin-bottom:1.25rem; font-size:0.85rem;">
          <div>
            <strong style="color:#059669;">✔ Matching Skills (${rec.matchingSkills.length}):</strong>
            <div class="skill-tags">
              ${rec.matchingSkills.map(s => `<span class="skill-tag" style="background:#d1fae5; color:#065f46;">${s}</span>`).join('')}
            </div>
          </div>
          <div>
            <strong style="color:#d97706;">⚠️ Missing / Recommended Skills (${rec.missingSkills.length}):</strong>
            <div class="skill-tags">
              ${rec.missingSkills.length > 0
                ? rec.missingSkills.map(s => `<span class="skill-tag" style="background:#fef3c7; color:#92400e;">${s}</span>`).join('')
                : '<span style="color:#64748b; font-size:0.8rem;">None! Perfect skill alignment.</span>'
              }
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
          ${rec.alreadyApplied
            ? `<button class="btn btn-secondary btn-sm" disabled>✔ Already Applied (${rec.applicationStatus})</button>`
            : `<button class="btn btn-primary btn-sm" onclick="applyJob(${rec.jobId})">⚡ 1-Click Apply via AI Profile</button>`
          }
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = '<div style="color:red; padding:1rem;">Failed to load job recommendations.</div>';
  }
}

async function applyJob(jobId) {
  try {
    const res = await fetch(API_BASE + '/api/matching/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: currentStudentId, jobId: jobId })
    });
    if (res.ok) {
      alert('✅ Application submitted successfully! Recruiter ranking updated.');
      loadJobRecommendations();
    }
  } catch (err) {
    alert('Failed to submit application: ' + err);
  }
}

// ==========================================
// 4. AI MOCK INTERVIEW & APTITUDE MODULE
// ==========================================
function toggleInterviewSubtab(type) {
  if (type === 'mock') {
    document.getElementById('subtab-mock-content').style.display = 'block';
    document.getElementById('subtab-aptitude-content').style.display = 'none';
    document.getElementById('subtab-interview-btn').className = 'btn btn-primary btn-sm';
    document.getElementById('subtab-aptitude-btn').className = 'btn btn-secondary btn-sm';
  } else {
    document.getElementById('subtab-mock-content').style.display = 'none';
    document.getElementById('subtab-aptitude-content').style.display = 'block';
    document.getElementById('subtab-interview-btn').className = 'btn btn-secondary btn-sm';
    document.getElementById('subtab-aptitude-btn').className = 'btn btn-primary btn-sm';
  }
}

async function loadInterviewQuestions() {
  try {
    const res = await fetch(API_BASE + '/api/interview/questions');
    if (!res.ok) return;
    currentQuestions = await res.json();

    const select = document.getElementById('interview-question-select');
    select.innerHTML = '';
    currentQuestions.forEach((q, idx) => {
      const opt = document.createElement('option');
      opt.value = q.id;
      opt.innerText = `[${q.category}] ${q.topic} - ${q.difficulty}`;
      select.appendChild(opt);
    });

    if (currentQuestions.length > 0) {
      displayQuestion(currentQuestions[0]);
    }
  } catch (err) {
    console.error('Error loading interview questions:', err);
  }
}

function onInterviewQuestionChange() {
  const qId = parseInt(document.getElementById('interview-question-select').value);
  const q = currentQuestions.find(item => item.id === qId);
  if (q) displayQuestion(q);
}

function displayQuestion(q) {
  document.getElementById('interview-q-difficulty').innerText = q.difficulty;
  document.getElementById('interview-q-topic').innerText = `TOPIC: ${q.topic.toUpperCase()} (${q.category})`;
  document.getElementById('interview-q-text').innerText = q.questionText;
  document.getElementById('studentAnswerText').value = '';
  document.getElementById('eval-result-content').style.display = 'none';
  document.getElementById('eval-empty-placeholder').style.display = 'block';
}

function speakQuestion() {
  const text = document.getElementById('interview-q-text').innerText;
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  } else {
    alert('Text-to-speech is not supported in this browser.');
  }
}

function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }
      if (finalTranscript) {
        document.getElementById('studentAnswerText').value += finalTranscript;
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      stopRecording();
    };

    recognition.onend = () => {
      stopRecording();
    };
  }
}

function toggleVoiceRecording() {
  if (!recognition) {
    alert('Web Speech API is not supported in this browser. You can type your answer directly into the textarea.');
    return;
  }

  if (isRecording) {
    recognition.stop();
    stopRecording();
  } else {
    try {
      recognition.start();
      isRecording = true;
      document.getElementById('micBtn').classList.add('active');
      document.getElementById('micBox').classList.add('recording');
      document.getElementById('micStatusText').innerText = '🔴 Recording... Speak now. Click again to stop.';
    } catch (e) {
      console.error(e);
    }
  }
}

function stopRecording() {
  isRecording = false;
  const micBtn = document.getElementById('micBtn');
  const micBox = document.getElementById('micBox');
  if (micBtn) micBtn.classList.remove('active');
  if (micBox) micBox.classList.remove('recording');
  const status = document.getElementById('micStatusText');
  if (status) status.innerText = 'Microphone stopped. Review your transcribed answer below.';
}

function loadSampleAnswer() {
  const qId = parseInt(document.getElementById('interview-question-select').value);
  const q = currentQuestions.find(item => item.id === qId);
  if (q && q.sampleIdealAnswer) {
    document.getElementById('studentAnswerText').value = q.sampleIdealAnswer;
  }
}

async function submitInterviewAnswer() {
  const answer = document.getElementById('studentAnswerText').value;
  const qId = parseInt(document.getElementById('interview-question-select').value);

  if (!answer || answer.trim().length < 10) {
    alert('Please record or enter a comprehensive response.');
    return;
  }

  try {
    const res = await fetch(API_BASE + '/api/interview/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: currentStudentId,
        questionId: qId,
        answer: answer
      })
    });

    if (res.ok) {
      const evalData = await res.json();
      displayEvaluationResult(evalData);
      loadStudentProfile(currentStudentId);
    }
  } catch (err) {
    alert('Error submitting interview answer: ' + err);
  }
}

function displayEvaluationResult(data) {
  document.getElementById('eval-empty-placeholder').style.display = 'none';
  document.getElementById('eval-result-content').style.display = 'block';

  document.getElementById('eval-rating-badge').innerText = data.performanceRating || 'Proficient';
  document.getElementById('eval-overall-score').innerText = `${data.overallScore.toFixed(0)}/100`;
  document.getElementById('eval-tech-score').innerText = `${data.technicalAccuracyScore.toFixed(0)}%`;
  document.getElementById('eval-clarity-score').innerText = `${data.clarityScore.toFixed(0)}%`;

  // Keywords covered
  const covered = document.getElementById('eval-keywords-covered');
  covered.innerHTML = data.coveredKeywords.length > 0
    ? data.coveredKeywords.map(k => `<span class="skill-tag" style="background:#d1fae5; color:#065f46;">✔ ${k}</span>`).join('')
    : '<span style="color:#64748b; font-size:0.8rem;">None detected</span>';

  // Keywords missing
  const missing = document.getElementById('eval-keywords-missing');
  missing.innerHTML = data.missingKeywords.length > 0
    ? data.missingKeywords.map(k => `<span class="skill-tag" style="background:#fee2e2; color:#991b1b;">✖ ${k}</span>`).join('')
    : '<span style="color:#059669; font-size:0.8rem;">Zero missing concepts! Comprehensive coverage.</span>';

  document.getElementById('eval-feedback-text').innerText = data.aiFeedback;

  const tipsList = document.getElementById('eval-tips-list');
  tipsList.innerHTML = data.improvementTips.map(tip => `<li>${tip}</li>`).join('');

  const qId = parseInt(document.getElementById('interview-question-select').value);
  const q = currentQuestions.find(item => item.id === qId);
  document.getElementById('eval-ideal-answer').innerText = q ? q.sampleIdealAnswer : 'N/A';
}

// Aptitude Quiz Logic
let currentAptitudeQuestions = [];
async function loadAptitudeQuestions() {
  try {
    const res = await fetch(API_BASE + '/api/interview/aptitude/questions');
    if (!res.ok) return;
    currentAptitudeQuestions = await res.json();

    const container = document.getElementById('aptitudeQuestionsContainer');
    container.innerHTML = '';

    currentAptitudeQuestions.forEach((q, idx) => {
      const qDiv = document.createElement('div');
      qDiv.style.cssText = 'background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:1.25rem;';
      qDiv.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
          <strong style="color:#0f172a; font-size:0.95rem;">Question ${idx + 1} (${q.category})</strong>
        </div>
        <p style="font-size:0.95rem; font-weight:600; color:#1e293b; margin-bottom:1rem;">${q.questionText}</p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; font-size:0.85rem;">
          <label style="display:flex; align-items:center; gap:0.5rem; background:white; padding:0.6rem 0.85rem; border-radius:6px; border:1px solid #cbd5e1; cursor:pointer;">
            <input type="radio" name="apt_q_${q.id}" value="A" required> (A) ${q.optionA}
          </label>
          <label style="display:flex; align-items:center; gap:0.5rem; background:white; padding:0.6rem 0.85rem; border-radius:6px; border:1px solid #cbd5e1; cursor:pointer;">
            <input type="radio" name="apt_q_${q.id}" value="B"> (B) ${q.optionB}
          </label>
          <label style="display:flex; align-items:center; gap:0.5rem; background:white; padding:0.6rem 0.85rem; border-radius:6px; border:1px solid #cbd5e1; cursor:pointer;">
            <input type="radio" name="apt_q_${q.id}" value="C"> (C) ${q.optionC}
          </label>
          <label style="display:flex; align-items:center; gap:0.5rem; background:white; padding:0.6rem 0.85rem; border-radius:6px; border:1px solid #cbd5e1; cursor:pointer;">
            <input type="radio" name="apt_q_${q.id}" value="D"> (D) ${q.optionD}
          </label>
        </div>
      `;
      container.appendChild(qDiv);
    });
  } catch (err) {
    console.error('Error loading aptitude questions:', err);
  }
}

async function submitAptitudeTest(event) {
  event.preventDefault();
  const answers = {};

  currentAptitudeQuestions.forEach(q => {
    const selected = document.querySelector(`input[name="apt_q_${q.id}"]:checked`);
    if (selected) {
      answers[q.id] = selected.value;
    }
  });

  try {
    const res = await fetch(API_BASE + '/api/interview/aptitude/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: currentStudentId,
        answers: answers
      })
    });

    if (res.ok) {
      const result = await res.json();
      const box = document.getElementById('aptitudeResultBox');
      box.style.display = 'block';
      box.innerHTML = `
        <h3 style="color:#065f46; font-size:1.1rem; margin-bottom:0.4rem;">🎯 Aptitude Test Result: ${result.scorePercentage}%</h3>
        <p style="color:#047857; font-size:0.85rem; margin-bottom:1rem;">
          Answered ${result.correctAnswers} out of ${result.totalQuestions} questions correctly. Your student profile Aptitude Score has been synchronized!
        </p>
        <div style="display:flex; flex-direction:column; gap:0.5rem; font-size:0.85rem;">
          ${result.review.map((r, i) => `
            <div style="background:white; padding:0.6rem 0.85rem; border-radius:6px; border-left:4px solid ${r.isCorrect ? '#10b981' : '#ef4444'};">
              <strong>Q${i + 1}: ${r.isCorrect ? '✔ Correct' : '✖ Incorrect'}</strong> (Selected: ${r.selectedOption}, Correct: ${r.correctOption})
              <div style="color:#64748b; font-size:0.75rem; margin-top:0.2rem;">${r.explanation}</div>
            </div>
          `).join('')}
        </div>
      `;
      loadStudentProfile(currentStudentId);
    }
  } catch (err) {
    alert('Error submitting test: ' + err);
  }
}

// ==========================================
// 5. PLACEMENT ANALYTICS DASHBOARD (Fig 3)
// ==========================================
async function loadAnalyticsDashboard() {
  try {
    const res = await fetch(API_BASE + '/api/analytics/dashboard');
    if (!res.ok) return;
    const d = await res.json();

    document.getElementById('kpi-total-students').innerText = d.totalStudents;
    document.getElementById('kpi-placed-students').innerText = d.placedStudents;
    document.getElementById('kpi-placed-pct').innerText = `${d.overallPlacementRate.toFixed(1)}% Conversion Rate`;
    document.getElementById('kpi-avg-ctc').innerText = `${d.averageCtcLpa.toFixed(1)} LPA`;
    document.getElementById('kpi-high-ctc').innerText = `${d.highestCtcLpa.toFixed(1)} LPA`;

    // Fig 3 exact label and gauge
    document.getElementById('fig3-placed-pct-label').innerText = `${Math.round(d.overallPlacementRate)}%`;
    document.getElementById('fig3-placed-rate-text').innerText = `${d.overallPlacementRate.toFixed(1)}%`;

    const circle = document.getElementById('placed-radial-circle');
    if (circle) {
      const offset = 471 - (471 * (d.overallPlacementRate / 100));
      circle.style.strokeDashoffset = offset;
    }

    // Render Department Bar Chart (Fig 3 Left)
    renderDeptBarChart(d.departmentNames, d.departmentPlacementRates);

    // Monthly Trend Chart
    renderMonthlyTrendChart(d.monthlyOffers);

    // Top Recruiters Chart
    renderTopRecruitersChart(d.topRecruiters);

    // At-Risk Table
    renderAtRiskTable(d.atRiskStudents);

  } catch (err) {
    console.error('Error loading analytics:', err);
  }
}

function renderDeptBarChart(labels, data) {
  const ctx = document.getElementById('deptPlacementBarChart');
  if (!ctx) return;

  if (deptBarChartInstance) {
    deptBarChartInstance.destroy();
  }

  deptBarChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels, // CSE, IT, ECE, MECH, CIVIL
      datasets: [{
        label: 'Placement Rate (%)',
        data: data,
        backgroundColor: [
          '#0284c7', // CSE (matches blue bar in Fig 3)
          '#38bdf8', // IT
          '#f59e0b', // ECE (matches orange high bar in Fig 3)
          '#0ea5e9', // MECH
          '#64748b'  // CIVIL
        ],
        borderRadius: 6,
        barThickness: 38
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { callback: v => v + '%' }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function renderMonthlyTrendChart(trends) {
  const ctx = document.getElementById('monthlyTrendChart');
  if (!ctx) return;

  if (monthlyTrendChartInstance) {
    monthlyTrendChartInstance.destroy();
  }

  const labels = Object.keys(trends);
  const values = Object.values(trends);

  monthlyTrendChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Cumulative Offers',
        data: values,
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        fill: true,
        tension: 0.35,
        pointRadius: 5,
        pointBackgroundColor: '#7c3aed'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function renderTopRecruitersChart(recruiterMap) {
  const ctx = document.getElementById('topRecruitersChart');
  if (!ctx) return;

  if (topRecruitersChartInstance) {
    topRecruitersChartInstance.destroy();
  }

  const labels = Object.keys(recruiterMap);
  const data = Object.values(recruiterMap);

  topRecruitersChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } }
      }
    }
  });
}

function renderAtRiskTable(students) {
  const tbody = document.getElementById('atRiskStudentsTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (!students || students.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#059669;">No students currently classified as At-Risk!</td></tr>';
    return;
  }

  students.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${s.rollNumber}</strong></td>
      <td>${s.studentName}</td>
      <td><span class="badge badge-blue">${s.department}</span></td>
      <td>
        <span style="color:#dc2626; font-weight:700;">${s.placementProbability.toFixed(1)}%</span>
      </td>
      <td><span class="badge badge-red">Critical Focus</span></td>
      <td style="font-size:0.8rem; color:#475569;">
        ${s.recommendedInterventions.join(' • ')}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ==========================================
// 6. RECRUITER SCREENING & SHORTLISTING
// ==========================================
async function loadRecruiterJobs() {
  try {
    const res = await fetch(API_BASE + '/api/jobs');
    if (!res.ok) return;
    const jobs = await res.json();

    const select = document.getElementById('recruiter-job-select');
    select.innerHTML = '';

    jobs.forEach(job => {
      const opt = document.createElement('option');
      opt.value = job.id;
      opt.innerText = `${job.company} - ${job.title} (${job.ctcLpa} LPA)`;
      select.appendChild(opt);
    });

    if (jobs.length > 0) {
      currentSelectedJobId = jobs[0].id;
      loadRecruiterCandidates(currentSelectedJobId);
    }
  } catch (err) {
    console.error('Error loading recruiter jobs:', err);
  }
}

function onRecruiterJobChange() {
  currentSelectedJobId = parseInt(document.getElementById('recruiter-job-select').value);
  loadRecruiterCandidates(currentSelectedJobId);
}

async function loadRecruiterCandidates(jobId) {
  const tbody = document.getElementById('recruiterCandidateTableBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;">Ranking candidates with NLP engine...</td></tr>';

  try {
    const res = await fetch(API_BASE + `/api/matching/candidates/${jobId}`);
    if (!res.ok) return;
    const candidates = await res.json();

    document.getElementById('candidate-count-badge').innerText = `${candidates.length} Candidates Evaluated`;
    tbody.innerHTML = '';

    candidates.forEach((c, idx) => {
      const matchScore = c.matchScore || 0;
      const matchColor = matchScore >= 80 ? '#059669' : (matchScore >= 65 ? '#2563eb' : '#d97706');

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>#${idx + 1}</strong></td>
        <td>
          <div style="font-weight:700;">${c.name}</div>
          <div style="font-size:0.75rem; color:#64748b;">${c.rollNumber}</div>
        </td>
        <td><span class="badge badge-gray">${c.department}</span></td>
        <td><strong>${c.cgpa}</strong></td>
        <td><span class="badge badge-blue">${c.employabilityScore.toFixed(1)}/100</span></td>
        <td>
          <strong style="color:${matchColor}; font-size:1rem;">${matchScore.toFixed(1)}%</strong>
        </td>
        <td>
          <div class="skill-tags">
            ${c.matchingSkills.slice(0, 3).map(s => `<span class="skill-tag" style="background:#d1fae5; color:#065f46; font-size:0.7rem;">${s}</span>`).join('')}
            ${c.matchingSkills.length > 3 ? `<span style="font-size:0.7rem; color:#64748b;">+${c.matchingSkills.length - 3}</span>` : ''}
          </div>
        </td>
        <td>
          <span class="badge ${c.eligible ? 'badge-green' : 'badge-red'}">${c.eligible ? 'Eligible' : 'Shortfall'}</span>
        </td>
        <td>
          ${c.applicationStatus === 'SHORTLISTED'
            ? `<span class="badge badge-green">SHORTLISTED</span>`
            : (c.applicationStatus === 'OFFERED' || c.applicationStatus === 'PLACED'
                ? `<span class="badge badge-purple">${c.applicationStatus}</span>`
                : `<button class="btn btn-outline btn-sm" onclick="shortlistCandidate(${c.studentId}, ${jobId})">Shortlist</button>`
              )
          }
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="9" style="color:red; text-align:center;">Failed to load candidate rankings.</td></tr>';
  }
}

async function shortlistCandidate(studentId, jobId) {
  try {
    // Apply if not already, then set status
    const appRes = await fetch(API_BASE + '/api/matching/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: studentId, jobId: jobId })
    });
    const app = await appRes.json();

    const statusRes = await fetch(API_BASE + `/api/matching/application/${app.id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'SHORTLISTED', feedback: 'Candidate verified for round 1 technical interview.' })
    });

    if (statusRes.ok) {
      alert('Candidate successfully shortlisted!');
      loadRecruiterCandidates(jobId);
    }
  } catch (err) {
    alert('Error shortlisting: ' + err);
  }
}

async function runAutoShortlist() {
  try {
    const res = await fetch(API_BASE + '/api/matching/auto-shortlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: currentSelectedJobId, minScore: 75.0 })
    });

    if (res.ok) {
      const list = await res.json();
      alert(`⚡ Automated AI Shortlisting Complete! Shortlisted ${list.length} applicants with Match Score ≥ 75%.`);
      loadRecruiterCandidates(currentSelectedJobId);
      loadAnalyticsDashboard();
    }
  } catch (err) {
    alert('Error running auto-shortlist: ' + err);
  }
}

// ==========================================
// 7. UPSKILLING RESOURCES
// ==========================================
async function loadUpskillingResources() {
  try {
    const res = await fetch(API_BASE + `/api/upskilling/recommendations/${currentStudentId}`);
    if (!res.ok) return;
    const resources = await res.json();

    const grid = document.getElementById('upskilling-resources-grid');
    grid.innerHTML = '';

    resources.forEach(r => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="card-header">
          <div class="card-title" style="font-size:1.05rem;">
            <span>📘</span> ${r.skillName} Mastery
          </div>
          <span class="badge badge-purple">${r.resourceType}</span>
        </div>
        <h4 style="font-size:1.05rem; font-weight:700; color:#0f172a; margin-bottom:0.4rem;">${r.title}</h4>
        <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.5; margin-bottom:1rem;">${r.description}</p>
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; color:#475569; margin-bottom:1rem;">
          <span>🏛️ Provider: <strong>${r.provider}</strong></span>
          <span>⏱️ Duration: <strong>${r.estimatedHours}</strong></span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="badge badge-amber">${r.difficultyLevel}</span>
          <a href="${r.url}" target="_blank" class="btn btn-outline btn-sm">Start Course ↗</a>
        </div>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading upskilling resources:', err);
  }
}
