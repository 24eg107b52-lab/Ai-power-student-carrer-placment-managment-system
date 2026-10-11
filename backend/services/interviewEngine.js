/**
 * AI-Driven Mock Interview & Aptitude Evaluation Engine
 * Evaluates verbal/textual responses, technical answers, and aptitude scores.
 */

export const INTERVIEW_QUESTIONS = {
  'Software Development Engineer (SDE)': [
    {
      id: 'sde-1',
      question: 'Explain the difference between a Process and a Thread, and how inter-process communication (IPC) works.',
      expectedKeywords: ['process', 'thread', 'memory', 'shared', 'ipc', 'pipe', 'socket', 'message queue', 'overhead', 'context switch'],
      idealAnswer: 'A process is an executing program instance with its own independent memory space and resources, whereas a thread is a lightweight unit of execution within a process that shares memory and resources with other threads. IPC mechanisms include pipes, shared memory, message queues, and sockets.',
      difficulty: 'Medium',
      category: 'Operating Systems & Concurrency'
    },
    {
      id: 'sde-2',
      question: 'How does a Hash Table achieve O(1) average time complexity, and how are hash collisions handled?',
      expectedKeywords: ['hash function', 'collision', 'chaining', 'open addressing', 'load factor', 'amortized', 'o(1)', 'linked list'],
      idealAnswer: 'A hash table computes an array index via a hash function on the key, allowing direct memory access in O(1) average time. Collisions are commonly resolved using Separate Chaining (linked lists/trees per bucket) or Open Addressing (linear probing, quadratic probing, or double hashing). When the load factor exceeds a threshold, resizing is triggered.',
      difficulty: 'Easy-Medium',
      category: 'Data Structures'
    },
    {
      id: 'sde-3',
      question: 'Describe how you would design a scalable URL shortener service like TinyURL.',
      expectedKeywords: ['hash', 'base62', 'database', 'caching', 'redis', 'load balancer', 'collision', 'redirect', 'scale', 'rate limit'],
      idealAnswer: 'Use a REST API with an endpoint to encode long URLs and decode short tokens. Generate short IDs using Base62 encoding on an auto-incrementing 64-bit ID or MD5/MurmurHash with collision resolution. Store mappings in a distributed key-value store or RDBMS with caching (Redis) for hot links and a Load Balancer in front of stateless application servers.',
      difficulty: 'Hard',
      category: 'System Design'
    }
  ],
  'Full Stack Web Developer': [
    {
      id: 'fs-1',
      question: 'Explain the JavaScript Event Loop, Microtask Queue, and how asynchronous callbacks are scheduled.',
      expectedKeywords: ['call stack', 'event loop', 'microtask', 'macrotask', 'promise', 'settimeout', 'callback queue', 'single threaded'],
      idealAnswer: 'JavaScript has a single-threaded call stack. Asynchronous operations are delegated to browser/Node APIs. When resolved, Promise callbacks enter the Microtask Queue, while setTimeout/setInterval callbacks enter the Macrotask Queue. The Event Loop prioritizes emptying all microtasks before executing the next macrotask.',
      difficulty: 'Medium',
      category: 'Core JavaScript'
    },
    {
      id: 'fs-2',
      question: 'What is the Virtual DOM in React and how does the reconciliation algorithm optimize browser rendering?',
      expectedKeywords: ['virtual dom', 'reconciliation', 'diffing', 'state', 'batching', 'fiber', 'rerender', 'dom manipulation'],
      idealAnswer: 'The Virtual DOM is a lightweight in-memory representation of real DOM nodes. When state changes, React creates a new VDOM tree, diffs it against the previous one using its reconciliation algorithm (Fiber), and applies only the minimal batch of necessary mutations to the real browser DOM, minimizing costly layout repaints.',
      difficulty: 'Medium',
      category: 'React & Frontend'
    }
  ],
  'AI / Machine Learning Engineer': [
    {
      id: 'ai-1',
      question: 'Explain the bias-variance tradeoff and how techniques like regularization help prevent overfitting.',
      expectedKeywords: ['bias', 'variance', 'overfitting', 'underfitting', 'regularization', 'l1', 'l2', 'ridge', 'lasso', 'generalization'],
      idealAnswer: 'High bias causes underfitting due to overly simplistic models, while high variance causes overfitting as the model learns training noise. Regularization (L1 Lasso, L2 Ridge, Dropout) penalizes large model weights to restrict complexity, finding the optimal balance that minimizes total generalization error on unseen test data.',
      difficulty: 'Medium',
      category: 'Machine Learning Theory'
    },
    {
      id: 'ai-2',
      question: 'What is the self-attention mechanism in Transformer architectures and why is it superior to recurrent neural networks (RNNs)?',
      expectedKeywords: ['attention', 'query', 'key', 'value', 'parallelization', 'transformer', 'sequence', 'long range dependencies', 'rnn', 'vanishing gradient'],
      idealAnswer: 'Self-attention calculates pairwise relevance scores between all tokens in a sequence using Query, Key, and Value vectors. Unlike sequential RNNs, Transformers process tokens simultaneously in parallel, avoiding vanishing gradients and capturing arbitrary long-range dependencies efficiently.',
      difficulty: 'Hard',
      category: 'Deep Learning & NLP'
    }
  ],
  'Behavioral & HR Round': [
    {
      id: 'hr-1',
      question: 'Tell me about a time you faced a critical roadblock during a technical project and how you resolved it.',
      expectedKeywords: ['situation', 'task', 'action', 'result', 'communication', 'problem', 'solution', 'learned', 'team', 'resolved'],
      idealAnswer: 'In my final-year capstone project, our real-time notification service crashed under concurrency testing due to memory leaks. I set up profiling with Chrome DevTools, traced the leak to dangling event listeners, refactored the connection lifecycle with clean disposers, and stress-tested the service to ensure 99.9% uptime under 500 concurrent users.',
      difficulty: 'Medium',
      category: 'Behavioral (STAR)'
    }
  ]
};

export const APTITUDE_QUESTIONS = [
  {
    id: 'apt-1',
    category: 'Quantitative',
    question: 'A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?',
    options: ['65 seconds', '89 seconds', '100 seconds', '75 seconds'],
    correctIndex: 1, // 89 seconds: speed = 240/24 = 10 m/s; total distance = 240+650 = 890m; time = 890/10 = 89s
    explanation: 'Speed of train = 240 m / 24 s = 10 m/s. Distance to cross platform = 240 + 650 = 890 m. Time = 890 / 10 = 89 seconds.'
  },
  {
    id: 'apt-2',
    category: 'Logical Reasoning',
    question: 'In a certain code, "MACHINE" is written as "CAMHENI". How is "MONSTER" written in that code?',
    options: ['NOMTSRER', 'NOMSETSR', 'SNOMRET', 'ONMSTER'],
    correctIndex: 0,
    explanation: 'The letters are rearranged by grouping and reversing letter subsets according to fixed positional shifts.'
  },
  {
    id: 'apt-3',
    category: 'Quantitative',
    question: 'Two pipes A and B can fill a tank in 20 and 30 minutes respectively. If both pipes are opened together, the time taken to fill the tank is:',
    options: ['12 minutes', '15 minutes', '18 minutes', '25 minutes'],
    correctIndex: 0, // 1/20 + 1/30 = (3+2)/60 = 5/60 = 1/12 -> 12 minutes
    explanation: 'Combined rate = 1/20 + 1/30 = (3 + 2)/60 = 5/60 = 1/12 of the tank per minute. Thus, it takes 12 minutes.'
  },
  {
    id: 'apt-4',
    category: 'Verbal Ability',
    question: 'Choose the word most nearly OPPOSITE in meaning to "CANDID":',
    options: ['Blunt', 'Guarded', 'Sincere', 'Frank'],
    correctIndex: 1,
    explanation: '"Candid" means truthful, open, and straightforward. Its antonym is "Guarded" or "Deceptive".'
  },
  {
    id: 'apt-5',
    category: 'Computer Science & Aptitude',
    question: 'What is the worst-case time complexity of QuickSort when the pivot is always chosen as the minimum or maximum element?',
    options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'],
    correctIndex: 2,
    explanation: 'When the partition is consistently unbalanced (e.g. 1 element and n-1 elements), QuickSort degenerates to O(n²).'
  }
];

/**
 * AI Evaluation of a student's interview response
 */
export function evaluateInterviewResponse(questionId, responseText, role) {
  if (!responseText || responseText.trim().length < 10) {
    return {
      score: 25,
      clarityScore: 30,
      technicalScore: 20,
      feedback: 'The response is too brief. Elaborate with specific technical principles, real-world examples, or the STAR structure.',
      keyStrengths: ['Attempted response'],
      areasForImprovement: ['Elaborate with concrete definitions', 'Include technical terminology and system trade-offs'],
      idealAnswer: 'Please review the recommended model answer.'
    };
  }

  // Find question definition across banks
  let targetQ = null;
  for (const roleKey in INTERVIEW_QUESTIONS) {
    const found = INTERVIEW_QUESTIONS[roleKey].find(q => q.id === questionId);
    if (found) {
      targetQ = found;
      break;
    }
  }

  if (!targetQ) {
    // Generic fallback question template
    targetQ = {
      expectedKeywords: ['architecture', 'performance', 'scalability', 'efficiency', 'testing'],
      idealAnswer: 'A structured answer detailing core mechanisms, architectural trade-offs, and practical edge-case handling.'
    };
  }

  const normalizedResponse = responseText.toLowerCase();
  const wordCount = responseText.trim().split(/\s+/).length;

  // Keyword coverage calculation
  const hitKeywords = (targetQ.expectedKeywords || []).filter(kw => normalizedResponse.includes(kw));
  const keywordRatio = targetQ.expectedKeywords.length > 0 
    ? hitKeywords.length / targetQ.expectedKeywords.length 
    : 0.7;

  // Length & depth factor
  let depthScore = 60;
  if (wordCount >= 40 && wordCount <= 200) depthScore = 90;
  else if (wordCount > 200) depthScore = 80;
  else if (wordCount >= 20) depthScore = 70;
  else depthScore = 40;

  // Technical Accuracy Score (50%)
  const technicalScore = Math.min(100, Math.round((keywordRatio * 70) + (depthScore * 0.3)));

  // Communication & Clarity Score (50%)
  let clarityScore = 75;
  if (wordCount >= 30 && normalizedResponse.includes('because') || normalizedResponse.includes('for example') || normalizedResponse.includes('whereas')) {
    clarityScore += 15;
  }
  if (wordCount < 25) {
    clarityScore -= 20;
  }
  clarityScore = Math.min(98, Math.max(30, clarityScore));

  // Overall Score
  const overallScore = Math.round((technicalScore * 0.6) + (clarityScore * 0.4));

  // Strengths and Improvements
  const keyStrengths = [];
  const areasForImprovement = [];

  if (hitKeywords.length >= 3) {
    keyStrengths.push(`Accurately highlighted key industry terminology: ${hitKeywords.slice(0, 3).join(', ')}`);
  }
  if (wordCount >= 35) {
    keyStrengths.push('Good explanation depth and logical pacing.');
  } else {
    areasForImprovement.push('Add more detail and concrete system examples to demonstrate subject mastery.');
  }

  const missedKeywords = (targetQ.expectedKeywords || []).filter(kw => !hitKeywords.includes(kw));
  if (missedKeywords.length > 0) {
    areasForImprovement.push(`Mention core concepts such as: ${missedKeywords.slice(0, 3).join(', ')}`);
  }

  if (keyStrengths.length === 0) {
    keyStrengths.push('Clear foundational direction.');
  }

  return {
    score: overallScore,
    technicalScore,
    clarityScore,
    hitKeywords,
    keyStrengths,
    areasForImprovement,
    idealAnswer: targetQ.idealAnswer,
    feedback: overallScore >= 80 
      ? 'Excellent response! Strong command of technical details and crisp articulation.' 
      : overallScore >= 60 
      ? 'Solid attempt. The response touches on key concepts but could benefit from deeper architectural nuance.' 
      : 'Needs refinement. Practice incorporating the suggested keywords and structured problem-solving steps.'
  };
}
