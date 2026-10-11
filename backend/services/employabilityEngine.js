/**
 * Employability Scoring & Skill-Gap Analysis Engine
 * Calculates dynamic employability score based on:
 * 1. Academic Performance (CGPA, backlogs) [30%]
 * 2. Technical Skills & Certifications [30%]
 * 3. Assessment & Coding Performance [25%]
 * 4. Interview Preparedness & Soft Skills [15%]
 */

// Target role benchmarks for skill-gap analysis
export const ROLE_BENCHMARKS = {
  'Software Development Engineer (SDE)': {
    primarySkills: ['data structures', 'algorithms', 'java', 'c++', 'python', 'system design', 'sql'],
    minCgpa: 7.5,
    certificationsWeight: ['leetcode', 'hackerrank', 'aws']
  },
  'Full Stack Web Developer': {
    primarySkills: ['javascript', 'typescript', 'react', 'node.js', 'express', 'mongodb', 'git', 'rest api'],
    minCgpa: 7.0,
    certificationsWeight: ['full stack', 'react', 'node.js']
  },
  'AI / Machine Learning Engineer': {
    primarySkills: ['python', 'machine learning', 'deep learning', 'pandas', 'numpy', 'pytorch', 'tensorflow', 'nlp'],
    minCgpa: 8.0,
    certificationsWeight: ['deeplearning.ai', 'coursera', 'tensorflow']
  },
  'Cloud & DevOps Engineer': {
    primarySkills: ['linux', 'docker', 'kubernetes', 'aws', 'ci/cd', 'git', 'python', 'bash'],
    minCgpa: 7.0,
    certificationsWeight: ['aws certified', 'azure', 'docker']
  },
  'Data Analyst / BI Specialist': {
    primarySkills: ['sql', 'python', 'excel', 'power bi', 'tableau', 'pandas', 'data visualization'],
    minCgpa: 6.8,
    certificationsWeight: ['google data analytics', 'power bi']
  }
};

// Learning resources catalog for personalized upskilling
export const UPSKILLING_CATALOG = {
  'data structures': {
    title: 'Mastering Data Structures & Algorithms',
    provider: 'NeetCode & Striver A2Z Sheet',
    type: 'Interactive Coding',
    duration: '6 Weeks',
    link: 'https://neetcode.io/roadmap'
  },
  'system design': {
    title: 'Grokking the System Design Fundamentals',
    provider: 'System Design Primer',
    type: 'Architecture & Diagrams',
    duration: '3 Weeks',
    link: 'https://github.com/donnemartin/system-design-primer'
  },
  'docker': {
    title: 'Docker & Containerization for Modern DevOps',
    provider: 'Docker Official Learning',
    type: 'Hands-on Labs',
    duration: '2 Weeks',
    link: 'https://docs.docker.com/get-started/'
  },
  'kubernetes': {
    title: 'Kubernetes Essentials for Cloud Deployment',
    provider: 'Kubernetes Foundation',
    type: 'Cloud Lab',
    duration: '3 Weeks',
    link: 'https://kubernetes.io/docs/tutorials/'
  },
  'aws': {
    title: 'AWS Certified Cloud Practitioner & Solutions',
    provider: 'AWS Skill Builder',
    type: 'Cloud Certification',
    duration: '4 Weeks',
    link: 'https://aws.amazon.com/training/'
  },
  'machine learning': {
    title: 'Machine Learning Specialization by Andrew Ng',
    provider: 'DeepLearning.AI / Coursera',
    type: 'Video & Math Labs',
    duration: '8 Weeks',
    link: 'https://www.deeplearning.ai/'
  },
  'react': {
    title: 'Modern React 19 & Component Architecture',
    provider: 'Official React Docs & Scrimba',
    type: 'Project Building',
    duration: '3 Weeks',
    link: 'https://react.dev/'
  },
  'node.js': {
    title: 'Backend Scalability with Node.js & Microservices',
    provider: 'Node.js Learning Center',
    type: 'API Development',
    duration: '3 Weeks',
    link: 'https://nodejs.org/en/learn'
  },
  'sql': {
    title: 'Advanced SQL Querying & Database Optimization',
    provider: 'SQLBolt & Mode Analytics',
    type: 'Practice Sandbox',
    duration: '2 Weeks',
    link: 'https://sqlbolt.com/'
  },
  'natural language processing': {
    title: 'NLP & Large Language Models (LLM) Engineering',
    provider: 'Hugging Face NLP Course',
    type: 'Transformers & Embeddings',
    duration: '4 Weeks',
    link: 'https://huggingface.co/learn/nlp-course'
  }
};

/**
 * Calculate dynamic employability scorecard for a student
 */
export function calculateEmployabilityScore(student) {
  // 1. Academic Performance Score (Weight: 30%)
  // Base CGPA mapping (e.g. 10.0 = 100%, 7.5 = 75%)
  const cgpa = student.cgpa || 7.0;
  let academicScore = Math.min(100, (cgpa / 10.0) * 100);
  
  // Deduct for active or past backlogs
  const backlogs = student.backlogs || 0;
  academicScore = Math.max(20, academicScore - (backlogs * 12));

  // 2. Technical Skills & Certifications Score (Weight: 30%)
  const skillsCount = (student.skills || []).length;
  // Normalize skills: 10+ diverse skills is considered top tier
  const skillBreadthScore = Math.min(100, (skillsCount / 8) * 75);
  const certCount = (student.certifications || []).length;
  const certScore = Math.min(25, certCount * 8.5);
  const technicalScore = Math.min(100, Math.round(skillBreadthScore + certScore));

  // 3. Coding & Assessment Performance Score (Weight: 25%)
  const assessmentHistory = student.assessmentScores || [];
  let assessmentScore = 75; // default benchmark
  if (assessmentHistory.length > 0) {
    const total = assessmentHistory.reduce((acc, curr) => acc + curr, 0);
    assessmentScore = Math.round(total / assessmentHistory.length);
  }

  // 4. Interview & Soft Skills Score (Weight: 15%)
  const interviewHistory = student.mockInterviewScores || [];
  let interviewScore = 70;
  if (interviewHistory.length > 0) {
    const total = interviewHistory.reduce((acc, curr) => acc + curr, 0);
    interviewScore = Math.round(total / interviewHistory.length);
  }

  // Composite Employability Score
  const totalEmployabilityScore = Math.round(
    (academicScore * 0.30) +
    (technicalScore * 0.30) +
    (assessmentScore * 0.25) +
    (interviewScore * 0.15)
  );

  // Determine Employability Tier
  let tier = 'Tier 4 - Foundational Focus';
  let badgeColor = 'red';
  let readinessStatement = 'Requires comprehensive upskilling across core programming and aptitude foundations.';

  if (totalEmployabilityScore >= 85) {
    tier = 'Tier 1 - Elite Campus Ready';
    badgeColor = 'emerald';
    readinessStatement = 'High readiness for Tier-1 Product Companies and Fortune 500 tech roles.';
  } else if (totalEmployabilityScore >= 70) {
    tier = 'Tier 2 - Placement Ready';
    badgeColor = 'blue';
    readinessStatement = 'Well positioned for mainstream tech hiring drives with targeted fine-tuning.';
  } else if (totalEmployabilityScore >= 55) {
    tier = 'Tier 3 - Developing Potential';
    badgeColor = 'amber';
    readinessStatement = 'Needs focused practice in mock interviews and project portfolio demonstration.';
  }

  // Identify Skill Gaps for Recommended Target Role
  const targetRole = student.targetRole || 'Software Development Engineer (SDE)';
  const benchmark = ROLE_BENCHMARKS[targetRole] || ROLE_BENCHMARKS['Software Development Engineer (SDE)'];
  
  const studentSkillSet = new Set((student.skills || []).map(s => s.toLowerCase()));
  const missingCoreSkills = benchmark.primarySkills.filter(s => !studentSkillSet.has(s));

  // Generate Personalized Upskilling Recommendations
  const recommendedResources = [];
  for (const skill of missingCoreSkills) {
    if (UPSKILLING_CATALOG[skill]) {
      recommendedResources.push({
        skill,
        ...UPSKILLING_CATALOG[skill]
      });
    }
  }

  // Fallback to top high-impact skills if no specific catalog match
  if (recommendedResources.length === 0) {
    recommendedResources.push(
      { skill: 'system design', ...UPSKILLING_CATALOG['system design'] },
      { skill: 'aws', ...UPSKILLING_CATALOG['aws'] }
    );
  }

  return {
    score: totalEmployabilityScore,
    tier,
    badgeColor,
    readinessStatement,
    targetRole,
    breakdown: {
      academicScore: Math.round(academicScore),
      technicalScore,
      assessmentScore,
      interviewScore
    },
    missingCoreSkills,
    recommendedResources: recommendedResources.slice(0, 4),
    lastEvaluatedAt: new Date().toISOString()
  };
}
