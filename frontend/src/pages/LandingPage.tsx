import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge slide-up">
            <span className="badge-icon">⚡</span>
            <span className="badge-text">Real-Time AI Claims Triage</span>
          </div>

          <h1 className="hero-headline slide-up">
            Transform Claims Chaos Into<br />
            <span className="gradient-text">Instant Intelligence</span>
          </h1>

          <p className="hero-subtext slide-up">
            Stop wasting 40% of adjuster time on manual routing. ClaimWise uses
            AI to classify, detect fraud, and route insurance claims in
            real-time—cutting triage delays from days to seconds.
          </p>

          <div className="hero-cta-buttons slide-up">
            <button
              className="btn-primary"
              onClick={() => navigate('/upload')}
              aria-label="Claim Your Insurance"
            >
              Claim Your Insurance →
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate('/team')}
              aria-label="Team Panel"
            >
              Team Panel
            </button>
          </div>

          <div className="hero-trust-indicators">
            <div className="trust-item">✓ Real-time claim processing</div>
            <div className="trust-item">✓ AI-powered fraud detection</div>
            <div className="trust-item">✓ Zero manual routing delays</div>
          </div>
        </div>

        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Built for Speed, Powered by Intelligence</h2>
          <p className="section-subtitle">
            ClaimWise processes every claim through a live AI pipeline—extracting
            entities, scoring fraud risk, and routing to the perfect queue before
            an adjuster even clicks.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card glass-effect">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-heading">Real-Time Processing</h3>
            <p className="feature-description">
              Live data streaming with Pathway—no batch delays. Every claim
              processed instantly as it arrives.
            </p>
          </div>

          <div className="feature-card glass-effect">
            <div className="feature-icon">🛡️</div>
            <h3 className="feature-heading">AI Fraud Detection</h3>
            <p className="feature-description">
              NER + GPT extracts red flags like duplicate claims, suspicious
              patterns, and policy mismatches with explainable evidence.
            </p>
          </div>

          <div className="feature-card glass-effect">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-heading">Smart Routing</h3>
            <p className="feature-description">
              Adaptive rules engine routes claims to specialized queues based on
              severity, complexity, and fraud score—automatically.
            </p>
          </div>
        </div>
      </section>

      <section className="problem-section">
        <div className="section-header">
          <h2 className="section-title">
            $40B Lost Annually to Slow Claims Processing
          </h2>
        </div>

        <div className="stats-grid">
          <div className="stat-card glass-effect">
            <div className="stat-number gradient-text">1-3</div>
            <div className="stat-label">Days</div>
            <div className="stat-description">Average triage time per claim</div>
          </div>

          <div className="stat-card glass-effect">
            <div className="stat-number gradient-text">40%</div>
            <div className="stat-label">Wasted</div>
            <div className="stat-description">Adjuster time on routing</div>
          </div>

          <div className="stat-card glass-effect">
            <div className="stat-number gradient-text">20-30%</div>
            <div className="stat-label">Delays</div>
            <div className="stat-description">Processing delays industry-wide</div>
          </div>

          <div className="stat-card glass-effect">
            <div className="stat-number gradient-text">$40B</div>
            <div className="stat-label">Losses</div>
            <div className="stat-description">Annual losses to fraud & misrouting</div>
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="section-header">
          <h2 className="section-title">From Submission to Resolution in Seconds</h2>
        </div>

        <div className="steps-flow">
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-title">Claim Arrives</div>
            <div className="step-description">New claim hits inbox or API</div>
          </div>

          <div className="step-connector">→</div>

          <div className="step-card">
            <div className="step-number">02</div>
            <div className="step-title">AI Extracts</div>
            <div className="step-description">NER pulls entities, dates, amounts</div>
          </div>

          <div className="step-connector">→</div>

          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-title">Fraud Scored</div>
            <div className="step-description">GPT analyzes patterns & red flags</div>
          </div>

          <div className="step-connector">→</div>

          <div className="step-card">
            <div className="step-number">04</div>
            <div className="step-title">Auto-Routed</div>
            <div className="step-description">Claim lands in perfect queue</div>
          </div>
        </div>
      </section>

      <section className="social-proof-section">
        <div className="section-header">
          <h2 className="section-title">Trusted by Forward-Thinking Insurance Teams</h2>
        </div>

        <div className="testimonial-card glass-effect">
          <div className="testimonial-quote">
            "ClaimWise cut our triage time from 2 days to under 10 seconds. Our
            adjusters now focus on high-value cases instead of paperwork."
          </div>
          <div className="testimonial-author">
            — Claims Operations Lead, Major TPA
          </div>
        </div>
      </section>

      <section className="final-cta-section">
        <div className="cta-content">
          <h2 className="cta-headline">
            Ready to Transform Your Claims Operations?
          </h2>
          <p className="cta-subtext">
            Join insurance carriers processing 10K+ claims monthly with ClaimWise
          </p>
          <button
            className="btn-primary btn-large"
            onClick={() => navigate('/upload')}
            aria-label="Claim Your Insurance"
          >
            Claim Your Insurance →
          </button>
        </div>
      </section>
    </div>
  );
}
