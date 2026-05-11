'use client';

import { useState, FormEvent } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [techList, setTechList] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedTechs, setSubmittedTechs] = useState<string[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL;
    if (!webhookUrl) {
      setStatus('error');
      setErrorMsg('Webhook URL is not configured. Set NEXT_PUBLIC_WEBHOOK_URL.');
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          tech_list: techList.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Signup failed with status ${response.status}`);
      }

      const techs = techList
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      setSubmittedTechs(techs);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      );
    }
  };

  if (status === 'success') {
    return (
      <main className="container">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>You are now monitoring.</h2>
          <p>
            Granulyst is watching for CVEs across{' '}
            <strong>{submittedTechs.length}</strong> technologies in your stack.
          </p>
          <p>We will alert you the moment something relevant drops.</p>
        </div>
        <footer>Check Slack for your first heartbeat soon.</footer>
      </main>
    );
  }

  return (
    <main className="container">
      <header>
        <div className="brand">
          <span className="brand-dot" aria-hidden="true" />
          <span>Granulyst</span>
        </div>
        <h1>Catch the threats you would miss.</h1>
        <p className="tagline">
          Tell us what you run. We watch every CVE the moment it drops, and only
          ping you when it matters.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <label>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label>
          <span>Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Your name"
            autoComplete="name"
          />
        </label>

        <label>
          <span>Your tech stack</span>
          <textarea
            value={techList}
            onChange={(e) => setTechList(e.target.value)}
            required
            placeholder="openssl, nginx, react, log4j, postgresql"
            rows={3}
          />
          <span className="hint">
            Comma-separated. Include libraries, frameworks, OSes, anything you
            depend on.
          </span>
        </label>

        <button type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Setting up monitoring...' : 'Start monitoring'}
        </button>

        {status === 'error' && <div className="error">{errorMsg}</div>}
      </form>

      <footer>Alerts delivered via Slack. Email coming soon.</footer>
    </main>
  );
}
