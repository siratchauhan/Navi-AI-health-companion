import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* ========== NAVBAR ========== */}
      <nav className="navbar">
        <Link href="/" className="navbar-logo">
          <div className="navbar-logo-icon">🌸</div>
          <span className="navbar-logo-text">Navi</span>
          <span className="navbar-logo-badge">Safe &amp; Anonymous</span>
        </Link>
        <ul className="navbar-links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/chat">Ask Navi</Link></li>
          <li><Link href="/chat" className="nav-cta">Start Private Chat →</Link></li>
        </ul>
        <button className="navbar-mobile-btn" aria-label="Menu">☰</button>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">100% Anonymous &amp; Ephemeral • Pediatric Verified</div>
            <h1 className="hero-title">
              Your Safe Space for <span>Growing Up.</span>
            </h1>
            <p className="hero-subtitle">
              Zero embarrassment, zero judgment. Navi helps you understand your changing body, shifting
              feelings, and puberty questions safely, gently, and in complete privacy.
            </p>
            <div className="hero-buttons">
              <Link href="/chat" className="btn-primary">
                Start a Private Chat →
              </Link>
              <a href="#topics" className="btn-secondary">
                Explore Common Curiosities
              </a>
            </div>
            <div className="hero-trust">
              <span className="hero-trust-item">No account needed</span>
              <span className="hero-trust-item">Doctor-approved answers</span>
              <span className="hero-trust-item">Erases cookies when you leave</span>
            </div>
          </div>

          <div className="hero-right">
            <img src="/navi-mascot.jpg" alt="Navi AI Mascot" className="hero-mascot-img" />
            <span className="hero-mascot-label">Navi is live &amp; listening safely</span>
            <div className="hero-chat-preview">
              <div className="preview-bubble ai">
                💬 Hey there! Ask me anything awkward — no judgment here. ✨
                <br /><small style={{ opacity: 0.7 }}>Pediatric Knowledge AI</small>
              </div>
              <div className="preview-bubble user">
                Is it normal if my growth feels uneven?
              </div>
              <div className="preview-bubble ai">
                Why am I feeling angry for no reason today?
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TOPICS SECTION ========== */}
      <section className="topics-section" id="topics">
        <div className="section-header">
          <div>
            <p className="section-label">Adolescent Health Atlas</p>
            <h2 className="section-title">Common Curiosities &amp; Quick Topics</h2>
          </div>
          <p className="section-desc">
            Explore safe, straightforward, and medical-reviewed explanations of bodily changes that every teenager wonders about.
          </p>
        </div>

        <div className="topics-grid">
          <Link href="/chat?topic=body" className="topic-card">
            <div className="topic-icon">🌱</div>
            <span className="topic-category">Growth &amp; Form</span>
            <h3 className="topic-title">Body &amp; Puberty Changes</h3>
            <p className="topic-desc">
              Growth spurts, voice shifts, changing shape, and development — and understanding what is completely normal.
            </p>
            <span className="topic-link">14 verified guides →</span>
          </Link>

          <Link href="/chat?topic=skin" className="topic-card">
            <div className="topic-icon">💖</div>
            <span className="topic-category">Dermatology Care</span>
            <h3 className="topic-title">Skin, Hair &amp; Acne</h3>
            <p className="topic-desc">
              Gentle face routines, why breakouts flare up, oily scalp origins, oil balance, and compassionate skin science.
            </p>
            <span className="topic-link">9 youth routines →</span>
          </Link>

          <Link href="/chat?topic=moods" className="topic-card">
            <div className="topic-icon">🧠</div>
            <span className="topic-category">Mind &amp; Hormones</span>
            <h3 className="topic-title">Big Feelings &amp; Moods</h3>
            <p className="topic-desc">
              Navigating intense emotions, self-compassion, hormone spikes, peer anxiety, and somatic grounding tools.
            </p>
            <span className="topic-link">18 soothing reads →</span>
          </Link>

          <Link href="/chat?topic=sleep" className="topic-card">
            <div className="topic-icon">🌙</div>
            <span className="topic-category">Rest &amp; Vigor</span>
            <h3 className="topic-title">Sleep, Energy &amp; Fatigue</h3>
            <p className="topic-desc">
              Why developing bodies need more rest, shifting circadian rhythms, feel-fuel, and recovery rituals.
            </p>
            <span className="topic-link">11 circadian facts →</span>
          </Link>
        </div>
      </section>

      {/* ========== QUOTE SECTION ========== */}
      <section className="quote-section">
        <div className="quote-container">
          <div>
            <p className="quote-label">A Message from Adolescent Doctors</p>
            <p className="quote-text">
              &ldquo;Every body grows on its own timeline. There is no single normal.&rdquo;
            </p>
            <p className="quote-desc">
              Your peers might grow faster or slower. Navi provides unbiased, medically certified
              insight without comparison or pressure.
            </p>
          </div>
          <div className="quote-cta">
            <Link href="/chat" className="btn-primary">
              Ask Navi a Private Question →
            </Link>
          </div>
        </div>
      </section>

      {/* ========== PRIVACY SECTION ========== */}
      <section className="privacy-section">
        <span className="privacy-badge">🛡️ Ironclad Confidence</span>
        <h2 className="privacy-title">The Navi Privacy Promise</h2>
        <p className="privacy-desc">
          We designed Navi from ground up to protect adolescent dignity and guard personal health
          discoveries with zero digital footprints.
        </p>

        <div className="privacy-grid">
          <div className="privacy-card">
            <div className="privacy-card-icon">🔒</div>
            <h3 className="privacy-card-title">100% Anonymous</h3>
            <p className="privacy-card-desc">
              No sign-up, no cookies, and no phone numbers required. We never request your name or
              collect identifiers. You are completely free to ask anything.
            </p>
            <span className="privacy-card-feature">Zero third-party trackers</span>
          </div>

          <div className="privacy-card">
            <div className="privacy-card-icon">🩺</div>
            <h3 className="privacy-card-title">Pediatric Validated</h3>
            <p className="privacy-card-desc">
              Developed in consultation with youth physicians, child psychologists, and adolescent
              endocrinologists to give reassuring, non-stigmatizing medical clarity.
            </p>
            <span className="privacy-card-feature">Clinically vetted prompts</span>
          </div>

          <div className="privacy-card">
            <div className="privacy-card-icon">👻</div>
            <h3 className="privacy-card-title">Instant Erasure</h3>
            <p className="privacy-card-desc">
              One click Ghost Mode immediately clears your entire conversation, erases active dialogues, and
              redirects your screen to a neutral safe landscape page.
            </p>
            <span className="privacy-card-feature">Quick Discreet Exit (Esc)</span>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo-wrap">
                <span className="footer-icon">🌸</span>
                <span className="footer-logo">Navi Wellness AI</span>
              </div>
              <p className="footer-desc">
                Safe, confidential, and empathetic adolescent health guidance.
                Navi is an AI assistant, not a replacement for medical diagnoses.
              </p>
            </div>
            <ul className="footer-links">
              <li><a href="#">Privacy Architecture</a></li>
              <li><a href="#">Crisis Helplines</a></li>
              <li><a href="#">Consent &amp; Safety</a></li>
            </ul>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Navi Wellness AI. Built with 💗 for teens everywhere.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
