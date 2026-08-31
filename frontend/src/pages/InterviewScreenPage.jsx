import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2, Mic, Square, ArrowLeft, ArrowRight,
  CheckCircle, AlertCircle, Award,
  Activity, Clock, MessageSquare, Repeat2, Zap
} from 'lucide-react';

function MetricTile({ label, value, sub, color = 'var(--gold)' }) {
  return (
    <div className="metric-card" style={{ minWidth: 0 }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'DM Mono, monospace', marginBottom: 8 }}>{label}</div>
      <div className="font-display" style={{ fontSize: 22, fontWeight: 700, color, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={sub}>{sub}</div>
    </div>
  );
}

function SpeechAnalysisPanel({ features, transcript, hesitation, feedback, isLoading, error }) {
  if (isLoading) {
    return (
      <div style={{ marginTop: 24 }}>
        <div style={{ height: 1, background: 'var(--border)', marginBottom: 24 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Activity size={14} color="var(--gold)" />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'DM Mono, monospace' }}>
            Analyzing Speech...
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="metric-card" style={{ height: 78, background: 'var(--surface-3)', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        marginTop: 20, background: 'rgba(212,106,106,0.08)',
        border: '1px solid rgba(212,106,106,0.25)', borderRadius: 12, padding: 16,
        display: 'flex', gap: 12,
      }}>
        <AlertCircle size={16} color="var(--accent-rose)" style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-rose)', margin: '0 0 4px' }}>Analysis Failed</p>
          <p style={{ fontSize: 12, color: 'rgba(212,106,106,0.7)', margin: 0 }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!features) return null;

  const silencePct = features.silence_ratio != null ? `${(features.silence_ratio * 100).toFixed(1)}%` : '—';

  const metrics = [
    { label: 'Speaking Rate', value: features.wpm != null ? `${features.wpm}` : '—', sub: 'words / min', color: 'var(--gold)' },
    { label: 'Pause Count', value: features.pause_count ?? '—', sub: 'detected pauses', color: '#7ab8e8' },
    { label: 'Avg Pause', value: features.average_pause != null ? `${features.average_pause}s` : '—', sub: 'per silence', color: 'var(--accent-teal)' },
    { label: 'Silence Ratio', value: silencePct, sub: 'of recording', color: '#e89050' },
    { label: 'Filler Words', value: features.filler_count ?? '—', sub: features.fillers?.length ? features.fillers.join(', ') : 'none', color: 'var(--accent-rose)' },
    { label: 'Repetitions', value: features.repetition_count ?? '—', sub: features.repeated_items?.length ? `"${features.repeated_items[0]}"…` : 'none', color: '#b07ae8' },
  ];

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ height: 1, background: 'var(--border)', marginBottom: 24 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <Activity size={14} color="var(--gold)" />
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'DM Mono, monospace' }}>
          Speech Analysis
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
        {metrics.map(m => <MetricTile key={m.label} {...m} />)}
      </div>

      {/* ML Hesitation */}
      {hesitation && !hesitation.error && (
        <div style={{
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          borderRadius: 12, padding: 18, marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'DM Mono, monospace' }}>
              ML Hesitation Model
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>RF v2</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Predicted Level:</span>
            <span style={{
              fontSize: 13, fontWeight: 700,
              padding: '4px 12px', borderRadius: 6,
              background: 'var(--gold-dim)', border: '1px solid rgba(201,168,76,0.2)',
              color: 'var(--gold-light)',
              fontFamily: 'DM Mono, monospace',
            }}>
              {hesitation.prediction || 'N/A'}
            </span>
          </div>

          {hesitation.probabilities && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 14 }}>
              {['Low', 'Medium', 'High'].map(lbl => {
                const v = hesitation.probabilities[lbl];
                const pct = v != null ? `${(v * 100).toFixed(0)}%` : '0%';
                return (
                  <div key={lbl} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{lbl}</div>
                    <div className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{pct}</div>
                    <div style={{ height: 3, background: 'var(--surface-3)', borderRadius: 99, overflow: 'hidden', marginTop: 6 }}>
                      <div style={{ height: '100%', width: pct, background: 'linear-gradient(90deg, var(--gold), var(--gold-light))', borderRadius: 99 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Feedback */}
      {feedback && feedback.summary && (
        <div style={{
          background: 'rgba(61,184,160,0.06)', border: '1px solid rgba(61,184,160,0.2)',
          borderRadius: 12, padding: 18, marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <MessageSquare size={13} color="var(--accent-teal)" />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'DM Mono, monospace' }}>
              Feedback
            </span>
          </div>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 12, lineHeight: 1.6 }}>{feedback.summary}</p>
          {feedback.suggestions?.length > 0 && (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {feedback.suggestions.map((s, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent-teal)', fontWeight: 700, marginTop: 1, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{s}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Transcript */}
      {transcript && (
        <div style={{
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          borderRadius: 12, padding: 16,
        }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'DM Mono, monospace', marginBottom: 10 }}>
            Transcript
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.65, margin: 0 }}>
            "{transcript}"
          </p>
        </div>
      )}
    </div>
  );
}

export default function InterviewScreenPage({
  setCurrentPage, interviewSetup, recordedAnswers, setRecordedAnswers,
  setSelectedAnswerIdx, selectedAnswerIdx,
}) {
  // ── Question bank: role → difficulty → type ──────────────────────────────────
  const QUESTION_BANK = {
    "Software Engineer": {
      Beginner: {
        Technical: [
          "What is the difference between a stack and a queue? Give a real-world example of each.",
          "Explain what an API is and how you would use one in a web application.",
          "What is the difference between compiled and interpreted languages?",
          "What does DRY (Don't Repeat Yourself) mean in software development?",
          "Explain what version control is and why Git is used.",
          "What is the difference between an array and a linked list?",
          "What is object-oriented programming? Name its four main principles.",
          "What is the difference between HTTP and HTTPS?",
          "What is a database and why do applications use one?",
          "Explain what a loop is and describe a scenario where you would use a for loop vs a while loop.",
          "What is a function and why do we use them in programming?",
          "What is the difference between == and === in JavaScript?",
        ],
        Behavioral: [
          "Tell me about yourself and why you want to become a software engineer.",
          "Describe a time you learned a new technology quickly. How did you approach it?",
          "Tell me about a project you built. What problem did it solve?",
          "How do you handle it when you are stuck on a problem for a long time?",
          "Describe a situation where you had to ask for help. How did you do it?",
          "Tell me about a time you made a mistake in your code. How did you fix it?",
          "How do you prioritize tasks when you have multiple things to work on?",
          "Describe a time you worked in a team on a technical project.",
          "What motivates you to write clean, readable code?",
          "Tell me about a goal you set for yourself as a developer and how you achieved it.",
        ],
      },
      Intermediate: {
        Technical: [
          "Explain the difference between SQL and NoSQL databases. When would you choose one over the other?",
          "What is Big O notation? What is the time complexity of binary search?",
          "Explain the concept of recursion and provide an example.",
          "What is the difference between synchronous and asynchronous programming?",
          "Describe the REST architectural style. What makes an API RESTful?",
          "What is a design pattern? Describe the Singleton and Observer patterns.",
          "Explain how garbage collection works in managed languages like Java or Python.",
          "What is a race condition? How would you prevent one?",
          "Describe the differences between a process and a thread.",
          "What is caching and how would you implement it to improve API response time?",
          "Explain the SOLID principles of software design.",
          "What is a deadlock and how can it be avoided?",
        ],
        Behavioral: [
          "Describe a time you had to deliver a feature under a tight deadline. What trade-offs did you make?",
          "Tell me about a technical disagreement you had with a teammate. How was it resolved?",
          "Give an example of when you proactively identified and fixed a bug before it reached production.",
          "Describe a time you refactored code. What was the outcome?",
          "Tell me about the most challenging bug you've ever debugged. How did you approach it?",
          "How do you stay current with new technologies and industry trends?",
          "Describe a time you mentored a junior developer or helped a teammate learn something new.",
          "Tell me about a project where requirements changed mid-development. How did you adapt?",
          "Give an example of when you had to balance technical debt against delivering new features.",
          "Describe a time you improved a slow or inefficient system.",
        ],
      },
      Advanced: {
        Technical: [
          "Design a URL shortener service like bit.ly. Walk through the system architecture.",
          "Explain CAP theorem and how it applies to distributed database design.",
          "How would you design a system to handle 1 million concurrent websocket connections?",
          "What is consistent hashing and where would you use it?",
          "Explain the difference between optimistic and pessimistic locking. When would you use each?",
          "How would you approach database sharding for a high-traffic application?",
          "What are the trade-offs between microservices and a monolith architecture?",
          "Explain event sourcing and CQRS. What problems do they solve?",
          "How does a distributed cache like Redis handle cache invalidation at scale?",
          "Walk me through how you would diagnose and resolve a sudden 10× increase in API latency.",
          "What is the difference between eventual consistency and strong consistency?",
          "How would you design a rate-limiting system for a public API?",
        ],
        Behavioral: [
          "Tell me about a time you led a technical initiative from idea to production.",
          "Describe a situation where you had to push back on a product requirement for technical reasons.",
          "Tell me about a time you made a critical architecture decision. What was your process?",
          "Describe a production incident you owned. How did you diagnose, fix, and prevent recurrence?",
          "Give an example of how you have influenced engineering best practices at your team or company.",
          "Tell me about a time you had to balance competing priorities across multiple projects.",
          "Describe a situation where you had to communicate a complex technical concept to non-technical stakeholders.",
          "How have you built alignment on a technical direction when the team had conflicting opinions?",
          "Tell me about a time you identified a significant risk in a project and how you mitigated it.",
          "Describe a time you drove adoption of a new tool or process that improved team productivity.",
        ],
      },
    },

    "Frontend Developer": {
      Beginner: {
        Technical: [
          "What is the difference between HTML, CSS, and JavaScript? What role does each play?",
          "Explain the CSS box model. What are margin, border, padding, and content?",
          "What is the DOM and how does JavaScript interact with it?",
          "What is the difference between display: block, inline, and inline-block?",
          "Explain what a CSS flexbox is and when you would use it.",
          "What is the difference between absolute, relative, fixed, and sticky positioning in CSS?",
          "What is responsive design? How do media queries help achieve it?",
          "What is the difference between var, let, and const in JavaScript?",
          "Explain event bubbling and event capturing in the DOM.",
          "What is localStorage and how is it different from sessionStorage?",
          "What is a CSS selector? Give examples of class, ID, and attribute selectors.",
          "What is the difference between inline styles and external stylesheets?",
        ],
        Behavioral: [
          "Tell me about a website or UI you built that you are proud of.",
          "How do you decide between different approaches when styling a component?",
          "Describe a time you made a UI accessible for users with disabilities.",
          "Tell me how you approach learning a new CSS framework or component library.",
          "Describe a time feedback from a user changed how you designed something.",
          "How do you test that your UI looks correct across different browsers?",
          "Tell me about a time you worked closely with a designer to implement a UI.",
          "Describe how you handle browser compatibility issues in your CSS.",
          "What is your process when a layout breaks on mobile but looks fine on desktop?",
          "Tell me about a time you had to deliver a pixel-perfect implementation of a design.",
        ],
      },
      Intermediate: {
        Technical: [
          "Explain the virtual DOM and how React uses it to optimize rendering.",
          "What is the difference between controlled and uncontrolled components in React?",
          "How does CSS specificity work? How do you resolve specificity conflicts?",
          "What is code splitting and why is it important for frontend performance?",
          "Explain the React component lifecycle. How do hooks replace lifecycle methods?",
          "What is the difference between useState and useReducer? When would you use each?",
          "How does browser rendering work? What is the critical rendering path?",
          "What is a Web Worker and when would you use one in a frontend application?",
          "Explain the difference between SSR (Server-Side Rendering) and CSR (Client-Side Rendering).",
          "What are common causes of layout thrashing and how do you avoid them?",
          "How does Webpack bundle a JavaScript application? What is tree shaking?",
          "What is CORS and how do you handle it in a frontend application?",
        ],
        Behavioral: [
          "Describe a time you significantly improved the performance of a web page.",
          "Tell me about a complex UI component you built from scratch. What challenges did you face?",
          "Describe a situation where you had to refactor a large CSS codebase.",
          "Tell me about a time you had to make a UI decision without clear design specifications.",
          "How have you handled a situation where a feature looked great on desktop but was broken on mobile?",
          "Describe a time you introduced a UI component library or design system to a team.",
          "Tell me about a time you improved the accessibility of an existing UI.",
          "Describe a scenario where you had to optimize a React app for poor-network conditions.",
          "Tell me about a time you disagreed with a designer's choice and how you resolved it.",
          "Describe how you have mentored a junior frontend developer.",
        ],
      },
      Advanced: {
        Technical: [
          "How would you architect a large-scale React application for performance, scalability, and maintainability?",
          "Explain micro-frontend architecture. What are its benefits and trade-offs?",
          "How do you prevent XSS and CSRF attacks in a modern single-page application?",
          "What is the difference between React Server Components and Client Components?",
          "Explain how you would implement a custom React rendering engine or reconciler.",
          "How would you build a design token system that scales across multiple products?",
          "Describe strategies for optimizing Core Web Vitals (LCP, CLS, FID/INP) on a content-heavy site.",
          "How would you implement real-time collaboration (like Google Docs) on the frontend?",
          "What are the trade-offs between CSS-in-JS and utility-first CSS (like Tailwind)?",
          "How would you build a component library that works across React, Vue, and vanilla JS?",
          "Describe how you would implement a virtualized list for rendering 100,000 rows performantly.",
          "How do you manage and share state between micro-frontends without coupling them?",
        ],
        Behavioral: [
          "Tell me about a time you defined the frontend architecture for a new product from scratch.",
          "Describe a situation where you drove the adoption of a performance culture in a frontend team.",
          "Tell me about a time you had to make a significant trade-off between developer experience and performance.",
          "Describe how you have handled a major UI regression that reached production.",
          "Tell me about a time you influenced the product roadmap based on technical frontend constraints.",
          "Describe a situation where you built cross-functional alignment on a new frontend technology choice.",
          "Tell me about a time you mentored a team of frontend developers and improved their craft.",
          "Describe a time you advocated strongly for accessibility or performance when business pressure pushed otherwise.",
          "Tell me about a large-scale frontend migration you led or participated in.",
          "Describe how you handled a scenario where a third-party library introduced a breaking change.",
        ],
      },
    },

    "Backend Developer": {
      Beginner: {
        Technical: [
          "What is a REST API? How is it different from a GraphQL API?",
          "Explain the difference between GET, POST, PUT, and DELETE HTTP methods.",
          "What is a relational database? How does a JOIN work?",
          "What is middleware in a web framework like Express or Django?",
          "Explain the difference between authentication and authorization.",
          "What is JSON and why is it commonly used in APIs?",
          "What is a primary key and a foreign key in a database?",
          "What does it mean for a function to be idempotent?",
          "What is an environment variable and why should secrets not be hardcoded?",
          "What is the difference between a 4xx and a 5xx HTTP status code?",
          "What is connection pooling in databases and why is it useful?",
          "Explain what a migration is in the context of a database.",
        ],
        Behavioral: [
          "Tell me about a backend project you built. What problem did it solve?",
          "Describe a time you had to debug an issue in an API you built.",
          "How do you decide which database to use for a given project?",
          "Tell me about a time you had to write code that other developers would consume as an API.",
          "Describe a time you had to secure an endpoint. What steps did you take?",
          "How do you test your API endpoints before deploying to production?",
          "Tell me about a time you had to read and understand someone else's backend code quickly.",
          "Describe how you handle error responses in your APIs.",
          "Tell me about a time you had to work with an external API or third-party service.",
          "How do you stay organized when working on multiple backend services?",
        ],
      },
      Intermediate: {
        Technical: [
          "Explain the N+1 query problem and how you solve it with eager loading.",
          "What are database indexes? How do they speed up queries and what are their trade-offs?",
          "Describe how you would implement JWT-based authentication in a REST API.",
          "What is the difference between horizontal and vertical scaling?",
          "Explain the producer-consumer pattern and how a message queue like RabbitMQ implements it.",
          "How would you implement pagination in a REST API efficiently?",
          "What is a database transaction? Explain ACID properties.",
          "Describe how you would implement role-based access control (RBAC) in an API.",
          "What is connection pooling and how does it improve database performance?",
          "Explain the difference between eager and lazy loading in an ORM.",
          "How would you design a webhooks system that reliably delivers events?",
          "What is a circuit breaker pattern and when would you use it?",
        ],
        Behavioral: [
          "Describe a time you designed an API that was later consumed by a mobile team. What did you learn?",
          "Tell me about a performance bottleneck you identified and fixed in a backend system.",
          "Describe a time you had to handle a database migration on a live production system with zero downtime.",
          "Tell me about a time you implemented security improvements to a backend application.",
          "Describe a situation where you had to balance data consistency with system performance.",
          "Tell me about a time you debugged an intermittent production issue.",
          "Describe a time your API design changed significantly based on consumer feedback.",
          "Tell me about a time you introduced automated testing to a backend codebase.",
          "Describe a situation where you had to onboard a new developer to a complex backend system.",
          "Tell me about a time you designed a system that needed to handle a sudden spike in traffic.",
        ],
      },
      Advanced: {
        Technical: [
          "Design a notification system that sends emails, SMS, and push notifications at scale.",
          "How would you implement distributed tracing across a microservices architecture?",
          "Explain the saga pattern for managing distributed transactions. When would you use it?",
          "How do you implement optimistic locking to handle concurrent updates in a database?",
          "Describe how you would build a multi-tenant SaaS backend with strong data isolation.",
          "How would you design a secure file upload system that handles large files reliably?",
          "What is backpressure in a streaming system and how do you handle it?",
          "How would you implement full-text search at scale — and when would you use Elasticsearch vs Postgres?",
          "Describe how you would build a job scheduling system that is fault-tolerant.",
          "How do you approach API versioning for a public API that thousands of clients depend on?",
          "Explain how you would implement a write-ahead log for data durability.",
          "Design a system that processes 10,000 financial transactions per second with strong consistency.",
        ],
        Behavioral: [
          "Tell me about a time you led the backend architecture for a product that scaled to a large number of users.",
          "Describe a production outage you were responsible for diagnosing and fixing.",
          "Tell me about a time you drove a major database schema change with no downtime.",
          "Describe how you have built a culture of reliability and observability in a backend team.",
          "Tell me about a time you had to evaluate and replace a core backend dependency.",
          "Describe a situation where you had to make a trade-off between consistency and availability.",
          "Tell me about a time you established API design standards for your organization.",
          "Describe a time you had to balance long-term technical excellence against a short-term business deadline.",
          "Tell me about a time you mentored backend engineers and improved their system design skills.",
          "Describe how you have handled a situation where a third-party dependency had a critical vulnerability.",
        ],
      },
    },

    "AI/ML Engineer": {
      Beginner: {
        Technical: [
          "What is the difference between supervised, unsupervised, and reinforcement learning?",
          "Explain what a training set, validation set, and test set are and why we split data this way.",
          "What is overfitting? How can you detect it and what can you do to reduce it?",
          "What is a neural network? Explain neurons, layers, and activation functions in simple terms.",
          "What is the difference between classification and regression?",
          "What is gradient descent and what role does the learning rate play?",
          "What is a confusion matrix and what metrics can you derive from it?",
          "What is feature engineering and why does it matter for model performance?",
          "Explain the bias-variance trade-off.",
          "What is normalization and why do we scale features before training?",
          "What is the purpose of a loss function? Give two examples.",
          "What is cross-validation and why is it used instead of a single train/test split?",
        ],
        Behavioral: [
          "Tell me about a machine learning project you built or studied. What problem did it address?",
          "How do you approach understanding a new dataset for the first time?",
          "Describe a time you had to explain an ML concept to someone without a technical background.",
          "Tell me about a time a model performed poorly. How did you investigate the problem?",
          "How do you stay updated with new research and developments in AI/ML?",
          "Describe your process for choosing a model architecture for a new problem.",
          "Tell me about a time you collaborated with a data engineer or software engineer on an ML pipeline.",
          "How do you handle a situation where you have very limited labeled training data?",
          "Describe a time you used a pre-trained model and adapted it to your task.",
          "Tell me about a time you had to make a model explainable to stakeholders.",
        ],
      },
      Intermediate: {
        Technical: [
          "Explain backpropagation. How are gradients computed through a neural network?",
          "What is the vanishing gradient problem and how do techniques like batch normalization and residual connections address it?",
          "What is transfer learning and how would you fine-tune a pre-trained model for a new task?",
          "Explain the attention mechanism. How does it differ from traditional RNN approaches?",
          "What is the difference between bagging and boosting? Give examples of each.",
          "How do you handle class imbalance in a binary classification problem?",
          "What is regularization? Explain L1 vs L2 regularization and when to use each.",
          "Describe the architecture of a Convolutional Neural Network (CNN) and why it works well for image data.",
          "How would you evaluate a recommender system beyond accuracy?",
          "What is the difference between collaborative filtering and content-based filtering?",
          "Explain SHAP values. How do they help explain black-box model predictions?",
          "What are the key considerations when deploying an ML model to production?",
        ],
        Behavioral: [
          "Describe a time you improved a model's performance significantly. What changes did you make?",
          "Tell me about a time you discovered data leakage in an ML pipeline. How did you find and fix it?",
          "Describe a situation where your model worked well in offline evaluation but poorly in production.",
          "Tell me about a time you had to communicate model uncertainty or limitations to business stakeholders.",
          "Describe a time you built an end-to-end ML pipeline. What tools and frameworks did you use?",
          "Tell me about a time you had to choose between model accuracy and inference speed.",
          "Describe a situation where you identified and addressed bias in a machine learning model.",
          "Tell me about a time you designed an experiment to validate a hypothesis about your model.",
          "Describe a time you had to retrain a model because of data drift in production.",
          "Tell me about a collaboration between your ML team and a product or business team.",
        ],
      },
      Advanced: {
        Technical: [
          "How would you design a real-time ML inference system that serves predictions at low latency?",
          "Explain the transformer architecture in detail. How do multi-head attention and positional encoding work?",
          "How would you implement an A/B test framework to evaluate two competing ML models in production?",
          "What is RLHF (Reinforcement Learning from Human Feedback) and how is it used to align LLMs?",
          "How do you detect and handle concept drift in a production ML model?",
          "Describe the trade-offs between distillation, quantization, and pruning for model compression.",
          "How would you build a feature store for a large-scale ML platform?",
          "Explain the difference between online learning and batch learning. When would you use each?",
          "How would you design an MLOps pipeline with automated retraining, evaluation, and deployment?",
          "What are the key challenges of training large language models and how does distributed training address them?",
          "How do you ensure fairness and reduce bias in a model used for hiring or credit scoring?",
          "Describe how you would implement retrieval-augmented generation (RAG) for an enterprise knowledge base.",
        ],
        Behavioral: [
          "Tell me about a time you led an ML project from problem definition to production deployment.",
          "Describe a time you had to make a case for a significant investment in ML infrastructure.",
          "Tell me about a time you identified an opportunity to apply ML to a business problem that was not initially framed as an ML task.",
          "Describe how you have built an ML platform or tooling that improved your team's productivity.",
          "Tell me about a time you navigated ethical concerns or risks in an ML project.",
          "Describe a situation where you had to retrain and re-deploy a model that was causing harm or poor user experience in production.",
          "Tell me about a time you mentored ML engineers and helped them grow in system design or research skills.",
          "Describe how you have driven standardization in ML workflows across teams.",
          "Tell me about a time you pushed back on a request to deploy a model you believed was not ready.",
          "Describe a time you collaborated with domain experts to improve the quality of training data.",
        ],
      },
    },

    "Data Analyst": {
      Beginner: {
        Technical: [
          "What is the difference between a mean, median, and mode? When would you use each?",
          "Explain what a JOIN is in SQL. What is the difference between INNER JOIN and LEFT JOIN?",
          "What is a pivot table and how is it useful in data analysis?",
          "What is the difference between a bar chart and a histogram?",
          "Explain what an outlier is and how you would identify one in a dataset.",
          "What does GROUP BY do in SQL? Give an example.",
          "What is the difference between structured and unstructured data?",
          "What is a NULL value in a database and how should you handle it in queries?",
          "Explain what data cleaning is and why it is important before analysis.",
          "What is the difference between correlation and causation?",
          "What is a KPI and how does a data analyst use it?",
          "What is the difference between a dimension and a metric in analytics?",
        ],
        Behavioral: [
          "Tell me about a time you used data to answer a business question. What did you find?",
          "Describe a time you had to clean a messy dataset. How did you approach it?",
          "Tell me about a dashboard or report you built. Who used it and what decisions did it inform?",
          "How do you communicate your analysis findings to a non-technical audience?",
          "Describe a time you discovered an insight in data that surprised you or your team.",
          "Tell me about a time you had to work with incomplete or low-quality data.",
          "How do you prioritize which analyses to work on when you have multiple requests?",
          "Describe a time you found an error in a report or data pipeline. How did you handle it?",
          "Tell me about a tool or technology you learned to solve a data problem.",
          "Describe how you validate the results of your analysis before sharing them.",
        ],
      },
      Intermediate: {
        Technical: [
          "How would you design a funnel analysis to understand drop-off in a sign-up flow?",
          "Explain window functions in SQL. Give an example using ROW_NUMBER or LAG.",
          "What is cohort analysis and when would you use it?",
          "How do you perform A/B test analysis? How do you determine statistical significance?",
          "What is the difference between a star schema and a snowflake schema in a data warehouse?",
          "How would you detect seasonality in a time-series dataset?",
          "What is churn rate and how would you build a model to predict it?",
          "Explain the difference between a population and a sample. Why does sample size matter?",
          "How do you handle missing values in a dataset? Walk through three strategies.",
          "What is data normalization and when would you apply it?",
          "Explain what a z-score is and how you would use it to detect anomalies.",
          "How would you measure the impact of a product change on user retention?",
        ],
        Behavioral: [
          "Tell me about a time your data analysis directly influenced a product or business decision.",
          "Describe a time you built a self-serve analytics dashboard. How did you decide what to include?",
          "Tell me about a time you had to challenge incorrect conclusions that stakeholders drew from data.",
          "Describe a situation where two data sources gave conflicting results. How did you resolve it?",
          "Tell me about a time you collaborated with an engineer to fix a data pipeline issue.",
          "Describe a time you had to communicate a negative insight—data that showed a product was underperforming.",
          "Tell me about a time you improved the speed or reliability of a recurring report.",
          "Describe a time you helped a non-analyst team member become more data-driven.",
          "Tell me about a time you scoped an ambiguous analytical request and turned it into a concrete deliverable.",
          "Describe a time you set up tracking or instrumentation for a new product feature.",
        ],
      },
      Advanced: {
        Technical: [
          "How would you build a multi-touch attribution model to measure marketing channel effectiveness?",
          "Describe how you would design a real-time analytics pipeline for a high-volume event stream.",
          "How would you approach forecasting revenue for the next 12 months using historical data?",
          "Explain causal inference techniques like difference-in-differences and synthetic control. When would you use each?",
          "How would you design an experimentation platform that runs hundreds of A/B tests simultaneously?",
          "Describe how you would build a customer lifetime value (LTV) model.",
          "What is propensity score matching and when is it useful for observational studies?",
          "How would you detect and prevent metric gaming in an incentive program?",
          "Describe how you would implement anomaly detection on a business metrics dashboard.",
          "How would you design a data quality framework for a large data warehouse?",
          "Explain how you would approach a recommendation system evaluation beyond click-through rate.",
          "How would you build a segmentation model to identify distinct user personas?",
        ],
        Behavioral: [
          "Tell me about a time you built an analytics strategy or roadmap for a product area.",
          "Describe a time you convinced senior leadership to change a strategy based on your data analysis.",
          "Tell me about a time you identified a major data quality issue and led the effort to fix it.",
          "Describe how you have scaled analytics capabilities across an organization.",
          "Tell me about a time you designed a metrics framework for a new product launch.",
          "Describe a situation where you had to balance speed of analysis with analytical rigor.",
          "Tell me about a time you partnered with a data engineering team to build foundational data infrastructure.",
          "Describe a time you drove adoption of a new analytics tool or methodology across teams.",
          "Tell me about a time you built a business case using data that resulted in significant resource allocation.",
          "Describe how you have handled a situation where business stakeholders misunderstood statistical results.",
        ],
      },
    },
  };

  function getQuestions(setup) {
    const role = setup?.role || 'Software Engineer';
    const difficulty = setup?.difficulty || 'Intermediate';
    const type = setup?.type || 'Technical';

    const byRole = QUESTION_BANK[role] || QUESTION_BANK['Software Engineer'];
    const byDiff = byRole[difficulty] || byRole['Intermediate'];

    let pool;
    if (type === 'Mixed') {
      const tech = byDiff['Technical'] || [];
      const beh = byDiff['Behavioral'] || [];
      pool = [...tech, ...beh];
    } else {
      pool = byDiff[type] || byDiff['Technical'] || [];
    }

    // Fisher-Yates shuffle then slice to requested count
    const arr = [...pool];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, setup?.questionCount || 5);
  }

  const [questions] = useState(() => getQuestions(interviewSetup));
  const [currentIdx, setCurrentIdx] = useState(selectedAnswerIdx ?? 0);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const spokenIdxRef = useRef(-1);

  const currentAnswer = recordedAnswers[currentIdx];

  const handlePlayQuestion = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(questions[currentIdx]);
    u.rate = 0.95;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  useEffect(() => {
    if (spokenIdxRef.current !== currentIdx) {
      spokenIdxRef.current = currentIdx;
      if (!recordedAnswers[currentIdx]?.transcript) {
        const tid = setTimeout(handlePlayQuestion, 500);
        return () => { clearTimeout(tid); if (spokenIdxRef.current === currentIdx) spokenIdxRef.current = -1; };
      }
    }
  }, [currentIdx]);

  const startRecording = async () => {
    setErrorMsg('');
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => { if (e.data?.size > 0) audioChunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedAnswers(prev => ({
          ...prev,
          [currentIdx]: {
            blob, url: URL.createObjectURL(blob), duration: timer,
            timestamp: new Date().toLocaleTimeString(),
            isAnalyzing: false, analyzeError: null, transcript: null, features: null,
          }
        }));
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      setIsRecording(true);
      setTimer(0);
      timerIntervalRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } catch (err) {
      setErrorMsg("Microphone permission denied or device not found.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  useEffect(() => { if (isRecording) stopRecording(); setTimer(0); setErrorMsg(''); }, [currentIdx]);
  useEffect(() => () => {
    clearInterval(timerIntervalRef.current);
    if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current?.stop();
  }, []);

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const handleSubmitAnswer = async () => {
    if (!currentAnswer?.blob || currentAnswer.isAnalyzing) return;
    setRecordedAnswers(prev => ({ ...prev, [currentIdx]: { ...prev[currentIdx], isAnalyzing: true, analyzeError: null } }));
    try {
      const fd = new FormData();
      fd.append('audio', currentAnswer.blob, 'recording.webm');
      fd.append('question', questions[currentIdx]);
      const res = await fetch('http://127.0.0.1:8000/api/analyze', { method: 'POST', body: fd });
      if (!res.ok) { const e = await res.json().catch(()=>{}); throw new Error(e?.detail || `Error ${res.status}`); }
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Analysis failed');
      setRecordedAnswers(prev => ({
        ...prev,
        [currentIdx]: { ...prev[currentIdx], transcript: data.transcript, features: data.features, hesitation: data.hesitation, feedback: data.feedback, relevance: data.relevance, isAnalyzing: false, analyzeError: null }
      }));
    } catch (err) {
      setRecordedAnswers(prev => ({
        ...prev,
        [currentIdx]: { ...prev[currentIdx], isAnalyzing: false, analyzeError: err.message || "Could not reach backend at http://127.0.0.1:8000" }
      }));
    }
  };

  const hasResult = currentAnswer?.transcript != null || currentAnswer?.features != null;
  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', display: 'flex', gap: 24, flexWrap: 'wrap' }}>

      {/* ── Left Column ─────────────────────────────────────────── */}
      <div style={{ flex: '1 1 480px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Progress bar */}
        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
            <span className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
              {interviewSetup?.role || 'Interview'}
            </span>
            <span className="tag-surface" style={{ whiteSpace: 'nowrap' }}>{interviewSetup?.difficulty}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap' }}>
              {currentIdx + 1} / {questions.length}
            </span>
            <div className="progress-bar-track" style={{ width: 80 }}>
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Question card */}
        <div className="card" style={{ padding: '32px 28px' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div className="tag-gold">Question {currentIdx + 1}</div>
            <button
              onClick={handlePlayQuestion}
              className="btn-surface"
              style={{ padding: '7px 14px', fontSize: 12 }}
            >
              <Volume2 size={13} color={isSpeaking ? 'var(--gold)' : undefined} />
              {isSpeaking ? 'Playing…' : 'Play Aloud'}
            </button>
          </div>

          <h2 className="font-display" style={{
            fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700,
            color: 'var(--text-primary)', lineHeight: 1.35,
            marginBottom: 28,
            borderLeft: '3px solid var(--gold)',
            paddingLeft: 18,
            marginLeft: -18 + 28,
          }}>
            "{questions[currentIdx]}"
          </h2>

          {/* Recording zone */}
          <div style={{ height: 1, background: 'var(--border)', marginBottom: 24 }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Your Response</span>
            {currentAnswer && !isRecording && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--accent-teal)', fontFamily: 'DM Mono, monospace' }}>
                <CheckCircle size={11} /> {currentAnswer.duration}s captured
              </span>
            )}
          </div>

          {errorMsg && (
            <div style={{
              background: 'rgba(212,106,106,0.08)', border: '1px solid rgba(212,106,106,0.25)',
              borderRadius: 10, padding: '10px 14px',
              display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16,
            }}>
              <AlertCircle size={14} color="var(--accent-rose)" />
              <span style={{ fontSize: 12, color: 'var(--accent-rose)' }}>{errorMsg}</span>
            </div>
          )}

          {/* Mic area */}
          <div style={{
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '40px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
          }}>
            {isRecording ? (
              <>
                {/* REC timer badge */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 18px', borderRadius: 999,
                  background: 'rgba(212,106,106,0.1)', border: '1px solid rgba(212,106,106,0.25)',
                  fontSize: 12, color: 'var(--accent-rose)', fontFamily: 'DM Mono, monospace', fontWeight: 600,
                  letterSpacing: '0.08em',
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-rose)', animation: 'pulse-dot 1s ease-in-out infinite', display: 'inline-block' }} />
                  REC &nbsp; {fmt(timer)}
                </div>

                {/* Animated stop button — rose loaderCircle */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Outer glow ring */}
                  <div style={{
                    position: 'absolute',
                    width: 110, height: 110,
                    borderRadius: '50%',
                    animation: 'micCircleRec 3s linear infinite',
                    opacity: 0.9,
                  }} />
                  {/* Mid ring */}
                  <div style={{
                    position: 'absolute',
                    width: 90, height: 90,
                    borderRadius: '50%',
                    background: 'rgba(212,106,106,0.06)',
                    animation: 'micPulseRing 1.2s ease-in-out infinite',
                  }} />
                  <button
                    onClick={stopRecording}
                    style={{
                      width: 72, height: 72, borderRadius: '50%',
                      background: 'radial-gradient(circle at 35% 35%, rgba(212,106,106,0.35), rgba(180,60,60,0.2))',
                      border: '1.5px solid rgba(212,106,106,0.5)',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#ff9090',
                      position: 'relative', zIndex: 1,
                      transition: 'transform 0.15s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <Square size={22} fill="#ff9090" strokeWidth={0} />
                  </button>
                </div>

                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Click to stop recording</p>
              </>
            ) : (
              <>
                {/* Animated idle mic — blue loaderCircle */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Outer animated ring */}
                  <div style={{
                    position: 'absolute',
                    width: 110, height: 110,
                    borderRadius: '50%',
                    animation: 'micCircleIdle 5s linear infinite',
                    opacity: 0.85,
                  }} />
                  {/* Soft ambient glow */}
                  <div style={{
                    position: 'absolute',
                    width: 140, height: 140,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }} />
                  <button
                    onClick={startRecording}
                    style={{
                      width: 72, height: 72, borderRadius: '50%',
                      background: 'radial-gradient(circle at 35% 35%, rgba(56,189,248,0.22), rgba(0,93,255,0.1))',
                      border: '1.5px solid rgba(56,189,248,0.35)',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#60c8ff',
                      position: 'relative', zIndex: 1,
                      transition: 'transform 0.15s ease, border-color 0.2s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.07)'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.6)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.35)'; }}
                  >
                    <Mic size={26} />
                  </button>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                    {currentAnswer ? 'Re-record Response' : 'Record Response'}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
                    Click the microphone to begin
                  </p>
                </div>
              </>
            )}

            {currentAnswer && !isRecording && (
              <div style={{
                width: '100%', maxWidth: 400,
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '12px 14px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Audio Preview</span>
                  <span style={{ fontSize: 10, color: 'var(--gold)', fontFamily: 'DM Mono, monospace' }}>{currentAnswer.timestamp}</span>
                </div>
                <audio controls src={currentAnswer.url} style={{ width: '100%', height: 36 }} />
              </div>
            )}
          </div>

          {/* Analysis panel */}
          {currentAnswer && !isRecording && (
            <SpeechAnalysisPanel
              features={currentAnswer.features}
              transcript={currentAnswer.transcript}
              hesitation={currentAnswer.hesitation}
              feedback={currentAnswer.feedback}
              isLoading={currentAnswer.isAnalyzing}
              error={currentAnswer.analyzeError}
            />
          )}

          {/* Action buttons */}
          {currentAnswer && !isRecording && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              {!hasResult && !currentAnswer.isAnalyzing && (
                <button
                  onClick={handleSubmitAnswer}
                  className="btn-gold"
                  style={{ padding: '10px 22px', fontSize: 13 }}
                >
                  <Award size={14} />
                  Analyze Answer
                </button>
              )}
              {hasResult && !currentAnswer.isAnalyzing && (
                <button
                  onClick={() => { setSelectedAnswerIdx(currentIdx); setCurrentPage('feedback'); }}
                  className="btn-ghost"
                  style={{ padding: '10px 22px', fontSize: 13, color: 'var(--text-primary)' }}
                >
                  <Award size={14} />
                  Full Feedback
                </button>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
            disabled={currentIdx === 0}
            className="btn-surface"
            style={{ opacity: currentIdx === 0 ? 0.35 : 1 }}
          >
            <ArrowLeft size={14} /> Previous
          </button>

          <span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: 'var(--text-muted)' }}>
            {currentIdx + 1} of {questions.length}
          </span>

          {currentIdx < questions.length - 1 ? (
            <button onClick={() => setCurrentIdx(i => i + 1)} className="btn-surface">
              Next <ArrowRight size={14} />
            </button>
          ) : (
            <button onClick={() => setCurrentPage('report')} className="btn-gold" style={{ padding: '10px 20px', fontSize: 13 }}>
              Finish & View Report <Award size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── Right Column: History ─────────────────────────────────── */}
      <div style={{
        width: 280, flexShrink: 0,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '24px 20px',
        maxHeight: 'calc(100vh - 100px)', position: 'sticky', top: 88,
        overflowY: 'auto', display: 'flex', flexDirection: 'column',
        alignSelf: 'flex-start',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <MessageSquare size={14} color="var(--gold)" />
          <span className="font-display" style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
            Session Log
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {questions.slice(0, currentIdx + 1).map((q, idx) => {
            const a = recordedAnswers[idx];
            const isActive = idx === currentIdx;
            return (
              <div
                key={idx}
                style={{ cursor: 'pointer' }}
                onClick={() => setCurrentIdx(idx)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    background: isActive ? 'var(--gold-dim)' : 'var(--surface-3)',
                    border: `1px solid ${isActive ? 'rgba(201,168,76,0.3)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 700, color: isActive ? 'var(--gold)' : 'var(--text-muted)',
                    fontFamily: 'DM Mono, monospace',
                  }}>
                    {idx + 1}
                  </div>
                  <span style={{ fontSize: 10, color: isActive ? 'var(--gold)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>
                    Q{idx + 1}
                  </span>
                  {a?.transcript && (
                    <CheckCircle size={10} color="var(--accent-teal)" style={{ marginLeft: 'auto' }} />
                  )}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 6px', paddingLeft: 30 }}>
                  {q.length > 80 ? q.slice(0, 80) + '…' : q}
                </p>
                {a?.transcript && (
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', margin: 0, paddingLeft: 30, lineHeight: 1.4 }}>
                    "{a.transcript.slice(0, 80)}{a.transcript.length > 80 ? '…' : ''}"
                  </p>
                )}
                {idx < currentIdx && (
                  <div style={{ height: 1, background: 'var(--border)', margin: '16px 0 0' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.3} }

        @keyframes micCircleIdle {
          0% {
            transform: rotate(90deg);
            box-shadow:
              0 6px 12px 0 #38bdf8 inset,
              0 12px 18px 0 #005dff inset,
              0 36px 36px 0 #1e40af inset,
              0 0 4px 1.5px rgba(56,189,248,0.25),
              0 0 10px 2px rgba(0,93,255,0.15);
          }
          50% {
            transform: rotate(270deg);
            box-shadow:
              0 6px 12px 0 #60a5fa inset,
              0 12px 6px 0 #0284c7 inset,
              0 24px 36px 0 #005dff inset,
              0 0 4px 1.5px rgba(56,189,248,0.25),
              0 0 10px 2px rgba(0,93,255,0.15);
          }
          100% {
            transform: rotate(450deg);
            box-shadow:
              0 6px 12px 0 #4dc8fd inset,
              0 12px 18px 0 #005dff inset,
              0 36px 36px 0 #1e40af inset,
              0 0 4px 1.5px rgba(56,189,248,0.25),
              0 0 10px 2px rgba(0,93,255,0.15);
          }
        }

        @keyframes micCircleRec {
          0% {
            transform: rotate(90deg);
            box-shadow:
              0 6px 12px 0 #f87171 inset,
              0 12px 18px 0 #dc2626 inset,
              0 36px 36px 0 #991b1b inset,
              0 0 4px 1.5px rgba(248,113,113,0.3),
              0 0 10px 2px rgba(220,38,38,0.2);
          }
          50% {
            transform: rotate(270deg);
            box-shadow:
              0 6px 12px 0 #fca5a5 inset,
              0 12px 6px 0 #ef4444 inset,
              0 24px 36px 0 #dc2626 inset,
              0 0 4px 1.5px rgba(248,113,113,0.3),
              0 0 10px 2px rgba(220,38,38,0.2);
          }
          100% {
            transform: rotate(450deg);
            box-shadow:
              0 6px 12px 0 #f87171 inset,
              0 12px 18px 0 #dc2626 inset,
              0 36px 36px 0 #991b1b inset,
              0 0 4px 1.5px rgba(248,113,113,0.3),
              0 0 10px 2px rgba(220,38,38,0.2);
          }
        }

        @keyframes micPulseRing {
          0%,100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.15; }
        }

        @media (max-width: 900px) {
          .sticky-sidebar { position: static !important; max-height: none !important; width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
