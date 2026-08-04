import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const stats = [
    { value: "10K+", label: "Candidates matched" },
    { value: "94%", label: "Faster screening" },
    { value: "4.9/5", label: "Recruiter satisfaction" },
  ];

  const features = [
    {
      icon: "AI",
      title: "AI-assisted hiring",
      text: "Surface the best-fit candidates instantly with intelligent ranking and recruiter insights.",
    },
    {
      icon: "⚡",
      title: "Lightning workflows",
      text: "Automate interview scheduling, follow-ups, and candidate nurturing from one workspace.",
    },
    {
      icon: "🔒",
      title: "Enterprise-grade trust",
      text: "Secure data handling, role-based access, and audit-ready recruiting workflows.",
    },
  ];

  const testimonials = [
    {
      name: "Aisha Patel",
      role: "Head of Talent, Northstar",
      quote: "The platform feels like a product team built it for us. We cut screening time almost in half.",
    },
    {
      name: "Marcus Lee",
      role: "Founder, Beam Labs",
      quote: "Our pipeline is cleaner, faster, and more human. Candidates love the experience too.",
    },
    {
      name: "Diana Gomez",
      role: "Recruiting Lead, Flux AI",
      quote: "From sourcing to offer, the automation is delightful and genuinely useful.",
    },
  ];

  const faqs = [
    {
      question: "Who is this for?",
      answer: "AI ATS is designed for modern recruiting teams, hiring managers, founders, and ambitious candidates.",
    },
    {
      question: "Can we use it with our current workflow?",
      answer: "Yes. It fits naturally into existing hiring pipelines and preserves your recruiting process while adding speed.",
    },
    {
      question: "Is it suitable for early-stage startups?",
      answer: "Absolutely. It scales from lean teams to growing companies with polished collaboration features.",
    },
  ];

const timeline = [
    { step: "01", title: "Create a role", text: "Post openings and sync them into a focused hiring pipeline." },
    { step: "02", title: "Engage talent", text: "Let AI rank applications and surface the strongest matches instantly." },
    { step: "03", title: "Coordinate interviews", text: "Schedule interviews and keep stakeholders aligned in one place." },
    { step: "04", title: "Hire faster", text: "Move from first conversation to offer with clear momentum and insight." },
  ];

  const workflow = [
    { icon: "📮", title: "Company Posts Job", text: "Recruiters publish roles into a focused hiring pipeline." },
    { icon: "🙋", title: "Candidate Applies", text: "Candidates submit tailored applications in a few clicks." },
    { icon: "📄", title: "Resume + AI Analysis", text: "AI parses resumes and extracts skills, experience and education." },
    { icon: "🎯", title: "ATS Score & Ranking", text: "Candidates are scored and ranked against every job requirement." },
    { icon: "✅", title: "Recruiter Selects Best", text: "Recruiters shortlist the strongest matches with confidence." },
    { icon: "🤝", title: "Schedule Interviews", text: "Move selected candidates into interviews effortlessly." },
    { icon: "🏆", title: "Hire & Onboard", text: "Close great hires faster with a smooth, transparent flow." },
    { icon: "🚀", title: "Build Your Team", text: "Scale your workforce with AI-accelerated recruiting." },
  ];

  return (
    <div className="home-page">
      <div className="home-shell">
        <nav className="home-nav">
          <div className="home-brand">
            <div className="home-brand-mark">AI</div>
            <span>AI ATS</span>
          </div>

          <div className="home-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#faq">FAQ</a>
          </div>

          <div className="home-nav-actions">
            <Link to="/login" className="home-btn-secondary">Log in</Link>
            <Link to="/register" className="home-btn-primary">Start free</Link>
          </div>
        </nav>

        <section className="home-hero">
          <div className="home-hero-card">
<div className="home-eyebrow">⚡ AI-powered recruitment OS</div>
            <h1>
              Hire faster with a{" "}
              <span className="home-gradient-text">premium applicant tracking</span>{" "}
              experience.
            </h1>
            <p>
              Unify sourcing, screening, interviews, and candidate communication in one beautiful workspace designed for modern teams.
            </p>

            <div className="home-hero-actions">
              <Link to="/register" className="home-btn-primary">Create your team</Link>
              <a href="#features" className="home-btn-ghost">Explore platform</a>
            </div>

            <div className="home-stats-row">
              {stats.map((item) => (
                <div className="home-stat" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="home-hero-visual">
            <div className="home-visual-card">
              <div className="home-visual-top">
                <strong>Recruiting Command Center</strong>
                <span className="home-pill">Live</span>
              </div>

              <div className="home-visual-grid">
                <div className="home-visual-box">
                  <strong>+42</strong>
                  <span>Qualified leads</span>
                </div>
                <div className="home-visual-box">
                  <strong>8</strong>
                  <span>Scheduled interviews</span>
                </div>
              </div>

              <div className="home-visual-list">
                <div className="home-list-item">
                  <span>Frontend Engineer</span>
                  <span className="home-pill">Priority</span>
                </div>
                <div className="home-list-item">
                  <span>Product Designer</span>
                  <span className="home-pill">Hot</span>
                </div>
                <div className="home-list-item">
                  <span>Growth PM</span>
                  <span className="home-pill">Ready</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="features">
          <div className="section-header">
            <div>
              <h2>Everything hiring teams need</h2>
              <p>Built for speed, clarity, and genuine candidate experience.</p>
            </div>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <div className="feature-card" key={feature.title}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="split-grid">
            <div className="split-card">
              <div className="home-eyebrow">For Candidates</div>
              <h3>Discover relevant roles and move forward with confidence.</h3>
              <p>Apply in minutes, track progress, and stay in the loop with smart updates and curated job matches.</p>
            </div>
            <div className="split-card">
              <div className="home-eyebrow">For Recruiters</div>
              <h3>Run a modern recruiting engine without the busywork.</h3>
              <p>Manage applicants, interviews, and communication from a streamlined and beautifully organized workspace.</p>
            </div>
          </div>
        </section>

        <section className="section" id="how-it-works">
          <div className="section-header">
            <div>
              <h2>How it works</h2>
              <p>From opening a role to making the offer, every step feels intentional.</p>
            </div>
          </div>

<div className="timeline">
            {timeline.map((item) => (
              <div className="timeline-card" key={item.step}>
                <div className="timeline-number">{item.step}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section workflow-section" id="workflow">
          <div className="section-header">
            <div>
              <h2>AI-Powered Recruitment Workflow</h2>
              <p>From job posting to hire — every step is powered by intelligent automation.</p>
            </div>
          </div>

          <div className="workflow-grid">
            {workflow.map((step) => (
              <div className="workflow-step" key={step.title}>
                <div className="workflow-icon">{step.icon}</div>
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="testimonials">
          <div className="section-header">
            <div>
              <h2>Loved by ambitious teams</h2>
              <p>Trusted by fast-moving companies that care about hiring quality.</p>
            </div>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((item) => (
              <div className="testimonial-card" key={item.name}>
                <h3>{item.name}</h3>
                <p>{item.role}</p>
                <p>“{item.quote}”</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="faq">
          <div className="section-header">
            <div>
              <h2>Frequently asked questions</h2>
              <p>Everything you need to know before you get started.</p>
            </div>
          </div>

          <div className="faq-list">
            {faqs.map((item) => (
              <div className="faq-card" key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="cta-card">
            <div>
              <h2>Ready to modernize recruiting?</h2>
              <p>Launch your first hiring workspace in minutes and bring clarity to every applicant.</p>
            </div>
            <div className="home-hero-actions">
              <Link to="/register" className="home-btn-primary">Get started</Link>
              <Link to="/login" className="home-btn-secondary">View demo</Link>
            </div>
          </div>
        </section>

        <footer className="home-footer">
          <div className="home-footer-top">
            <div className="home-brand">
              <div className="home-brand-mark">AI</div>
              <span>AI ATS</span>
            </div>
            <div className="home-footer-links">
              <a href="#features">Features</a>
              <a href="#how-it-works">How it works</a>
              <a href="#faq">FAQ</a>
            </div>
          </div>
          <p>© 2026 AI ATS. Built for modern hiring teams.</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
