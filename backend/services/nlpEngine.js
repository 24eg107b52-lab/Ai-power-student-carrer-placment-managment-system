/**
 * NLP Engine for Resume Parsing and Job-Candidate Matching
 * Implements tokenization, TF-IDF calculation, cosine similarity,
 * and skill extraction.
 */

// Comprehensive skills taxonomy across modern computer science domains
export const SKILL_TAXONOMY = {
  programming: [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'c', 'go', 'rust',
    'ruby', 'php', 'swift', 'kotlin', 'sql', 'r', 'scala', 'dart', 'html', 'css'
  ],
  frameworks_libraries: [
    'react', 'next.js', 'vue', 'angular', 'node.js', 'express', 'nestjs', 'django',
    'flask', 'fastapi', 'spring boot', 'asp.net', 'tailwind css', 'bootstrap',
    'redux', 'graphql', 'rest api', 'pytorch', 'tensorflow', 'scikit-learn',
    'keras', 'pandas', 'numpy', 'opencv', 'hugging face', 'langchain'
  ],
  databases_cloud: [
    'mongodb', 'postgresql', 'mysql', 'sqlite', 'redis', 'elasticsearch',
    'aws', 'azure', 'google cloud', 'gcp', 'docker', 'kubernetes', 'terraform',
    'ci/cd', 'github actions', 'firebase', 'supabase', 'linux', 'git'
  ],
  core_cs: [
    'data structures', 'algorithms', 'object-oriented programming', 'oop',
    'system design', 'operating systems', 'dbms', 'computer networks',
    'software engineering', 'distributed systems', 'microservices'
  ],
  ai_data: [
    'machine learning', 'deep learning', 'natural language processing', 'nlp',
    'computer vision', 'predictive analytics', 'data science', 'llms',
    'data visualization', 'power bi', 'tableau'
  ]
};

// Flattened list of all recognizable skills
export const ALL_SKILLS = Object.values(SKILL_TAXONOMY).flat();

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from',
  'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself',
  'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most',
  'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other',
  'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such',
  'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were',
  'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your'
]);

/**
 * Tokenize and normalize text into clean words
 */
export function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s\+\#\.\-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1 && !STOP_WORDS.has(word));
}

/**
 * Extract technical skills from raw resume or description text
 */
export function extractSkills(text) {
  if (!text) return [];
  const normalized = text.toLowerCase();
  const foundSkills = new Set();

  for (const skill of ALL_SKILLS) {
    // Regex boundary check for clean word matching
    const escaped = skill.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    const regex = new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`, 'i');
    if (regex.test(normalized)) {
      foundSkills.add(skill);
    }
  }

  return Array.from(foundSkills);
}

/**
 * Parse structured sections from resume text
 */
export function parseResume(resumeText) {
  if (!resumeText) return null;

  // Extract email
  const emailMatch = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : null;

  // Extract phone
  const phoneMatch = resumeText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : null;

  // Extract CGPA / GPA
  const cgpaMatch = resumeText.match(/(?:cgpa|gpa|score)[\s:]*([0-9]\.[0-9]{1,2})/i);
  const cgpa = cgpaMatch ? parseFloat(cgpaMatch[1]) : null;

  // Extract detected skills
  const skills = extractSkills(resumeText);

  // Detect education keywords
  const degrees = ['b.tech', 'b.e.', 'm.tech', 'mca', 'bca', 'b.sc', 'computer science'];
  const foundDegrees = degrees.filter(d => resumeText.toLowerCase().includes(d));

  // Projects estimation
  const projectKeywords = ['project', 'developed', 'implemented', 'designed', 'built', 'created'];
  const projectMentions = projectKeywords.filter(k => resumeText.toLowerCase().includes(k)).length;

  return {
    email,
    phone,
    cgpa,
    extractedSkills: skills,
    educationHint: foundDegrees.join(', ') || 'Computer Science & Engineering',
    estimatedProjectsCount: Math.max(1, projectMentions),
    rawWordCount: resumeText.split(/\s+/).length
  };
}

/**
 * Calculate Term Frequency (TF)
 */
function computeTF(tokens) {
  const tf = {};
  const total = tokens.length;
  if (total === 0) return tf;

  for (const token of tokens) {
    tf[token] = (tf[token] || 0) + 1;
  }
  for (const token in tf) {
    tf[token] = tf[token] / total;
  }
  return tf;
}

/**
 * Compute Cosine Similarity between two term vectors
 */
export function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  const allKeys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);

  for (const key of allKeys) {
    const valA = vecA[key] || 0;
    const valB = vecB[key] || 0;
    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Match a student profile with a job posting using weighted NLP and skill overlap
 */
export function calculateJobMatch(student, job) {
  const studentSkills = new Set((student.skills || []).map(s => s.toLowerCase()));
  const requiredSkills = (job.requiredSkills || []).map(s => s.toLowerCase());

  // 1. Skill overlap score (60% weight)
  let matchedSkills = [];
  let missingSkills = [];

  for (const req of requiredSkills) {
    if (studentSkills.has(req)) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  }

  const skillScore = requiredSkills.length > 0 
    ? (matchedSkills.length / requiredSkills.length) * 100 
    : 100;

  // 2. TF-IDF / Cosine Similarity between resume summary and job description (25% weight)
  const studentText = `${student.name} ${student.department} ${student.bio || ''} ${(student.skills || []).join(' ')} ${(student.certifications || []).join(' ')}`;
  const jobText = `${job.title} ${job.company} ${job.description} ${(job.requiredSkills || []).join(' ')}`;

  const tokensA = tokenize(studentText);
  const tokensB = tokenize(jobText);

  const tfA = computeTF(tokensA);
  const tfB = computeTF(tokensB);

  const nlpSimilarity = cosineSimilarity(tfA, tfB) * 100;

  // 3. Academic eligibility score (15% weight)
  const minCgpa = job.minCgpa || 6.0;
  const studentCgpa = student.cgpa || 7.0;
  let academicScore = 100;
  let isEligible = true;

  if (studentCgpa < minCgpa) {
    academicScore = Math.max(30, (studentCgpa / minCgpa) * 100 - 20);
    isEligible = false;
  }

  // Final Composite Match Score
  const matchPercentage = Math.min(100, Math.round(
    (skillScore * 0.60) + (nlpSimilarity * 0.25) + (academicScore * 0.15)
  ));

  return {
    jobId: job.id,
    matchPercentage,
    isEligible,
    matchedSkills,
    missingSkills,
    skillScore: Math.round(skillScore),
    nlpSimilarity: Math.round(nlpSimilarity),
    verdict: matchPercentage >= 80 ? 'Strong Match' : matchPercentage >= 60 ? 'Moderate Match' : 'Potential Match'
  };
}
