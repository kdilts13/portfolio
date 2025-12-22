'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import HighlightCard from '@/app/components/highlightCard';
import SectionHeader from '@/app/components/sectionHeader';
import Markdown from '@/app/components/markdown/Markdown';
import {
  DEMO_JOBS_FIT_ANALYSIS_PROMPT,
  DEMO_RESUME_TEXT,
  DEMO_JOBS_FIT_ANALYSIS_RESPONSE,
} from './demoData';

type Tool = 'resume_tailor' | 'job_fit';

type ExtractResponse = { text: string };
type ErrorResponse = { error?: string; message?: string };

const inputClasses =
  'w-full rounded-md border border-accent/60 bg-background px-3 py-2 text-sm text-foreground ' +
  'placeholder:text-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue';

const textareaClasses = inputClasses + ' min-h-[180px] resize-y leading-relaxed';

export default function AiToolsClient() {
  const { user } = useAuth();

  const [tool, setTool] = useState<Tool>('job_fit');
  const [resumeMode, setResumeMode] = useState<'upload' | 'paste'>('upload');

  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [output, setOutput] = useState('');
  const [outputView, setOutputView] = useState<'markdown' | 'raw'>('markdown');

  const [status, setStatus] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  const canRun = useMemo(() => {
    if (isRunning || isExtracting) return false;
    if (!resumeText.trim()) return false;
    if (!jobDescription.trim()) return false;
    return true;
  }, [isRunning, isExtracting, resumeText, jobDescription]);

  // Load saved resume text for signed-in users
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!user) return;

      try {
        const ref = doc(db, 'userResumes', user.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) return;

        const data = snap.data() as { resumeText?: string };
        if (!cancelled && data.resumeText) {
          setResumeText(data.resumeText);
          setResumeMode('paste');
          setStatus('Loaded your saved resume text.');
        }
      } catch {
        // Non-fatal
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function handleExtractPdf(file: File) {
    if (!user) {
      setStatus('Please sign in to upload and extract a resume PDF.');
      return;
    }

    setIsExtracting(true);
    setStatus('Extracting text from PDF…');

    try {
      const fd = new FormData();
      fd.append('file', file);

      const res = await apiFetch('/app-api/resume/extract', user, {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as ErrorResponse;
        throw new Error(err.message || `Extraction failed (${res.status}).`);
      }

      const data = (await res.json()) as ExtractResponse;
      setResumeText(data.text || '');
      setResumeMode('paste');
      setStatus('Extraction complete. Review the text before running the tool.');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error extracting PDF.';
      setStatus(msg);
    } finally {
      setIsExtracting(false);
    }
  }

  async function handleSaveResume() {
    if (!user) {
      setStatus('Please sign in to save your resume text.');
      return;
    }

    const text = resumeText.trim();
    if (!text) {
      setStatus('Nothing to save yet.');
      return;
    }

    setIsSaving(true);
    setStatus('Saving…');

    try {
      const ref = doc(db, 'userResumes', user.uid);
      await setDoc(
        ref,
        {
          resumeText: text,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      setStatus('Saved.');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error saving.';
      setStatus(`Save failed: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRun() {
    if (!user) {
      setStatus('Please sign in to run the tool (demo mode below is available without login).');
      return;
    }

    if (!canRun) return;

    // Cancel any prior run
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setIsRunning(true);
    setStatus('Running…');
    setOutput('');
    setOutputView('raw');

    try {
      const res = await apiFetch('/app-api/ai/evaluate', user, {
        method: 'POST',
        signal: ac.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/plain',
        },
        body: JSON.stringify({
          tool,
          resumeText,
          jobDescription,
        }),
      });

      if (!res.ok) {
        // Backend returns JSON error bodies for non-200.
        const err = (await res.json().catch(() => ({}))) as ErrorResponse;
        const message = err.message || `Request failed (${res.status}).`;
        setStatus(message);
        return;
      }

      if (!res.body) {
        setStatus('No response body received.');
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          setOutput((prev) => prev + decoder.decode(value, { stream: true }));
        }
      }

      setOutputView('markdown');
      setStatus('Done.');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error running tool.';
      setStatus(`Run failed: ${msg}`);
    } finally {
      setIsRunning(false);
    }
  }

  function handleStop() {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsRunning(false);
    setOutputView('markdown');
    setStatus('Stopped.');
  }

  function loadDemo() {
    setTool('job_fit');
    setResumeMode('paste');
    setResumeText(DEMO_RESUME_TEXT);
    setJobDescription(DEMO_JOBS_FIT_ANALYSIS_PROMPT);
    setOutput(DEMO_JOBS_FIT_ANALYSIS_RESPONSE);
    setStatus('Loaded demo inputs and output (no API calls made).');
  }

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <SectionHeader
          eyebrow="AI TOOLS"
          title="Resume Tailor & Job Fit Analyzer"
          subtitle="Upload a PDF resume (extract to text), paste your resume, and analyze a job description. Results stream back as markdown."
        />

        <div className="grid gap-4 md:grid-cols-3">
          <HighlightCard
            label="Privacy"
            title="Your data stays yours"
            body="Resume text is sent only to your session for analysis. Your saved resume text is stored in your own Firestore user document."
          />
          <HighlightCard
            label="Limits"
            title="Rate limited by design"
            body="The backend enforces daily run limits and can be tuned without code changes via environment variables."
          />
          <HighlightCard
            label="Demo"
            title="Try it instantly"
            body="A cached demo run is available so visitors can see the experience without spending tokens."
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">Inputs</h3>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className={tool === 'job_fit' ? 'btn-primary' : 'btn-outline'}
                onClick={() => setTool('job_fit')}
                disabled={isRunning}
              >
                Job fit
              </button>
              <button
                type="button"
                className={tool === 'resume_tailor' ? 'btn-primary' : 'btn-outline'}
                onClick={() => setTool('resume_tailor')}
                disabled={isRunning}
              >
                Resume tailor
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium">Resume</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={resumeMode === 'upload' ? 'btn-primary' : 'btn-outline'}
                  onClick={() => setResumeMode('upload')}
                  disabled={isRunning || isExtracting}
                >
                  Upload PDF
                </button>
                <button
                  type="button"
                  className={resumeMode === 'paste' ? 'btn-primary' : 'btn-outline'}
                  onClick={() => setResumeMode('paste')}
                  disabled={isRunning || isExtracting}
                >
                  Paste text
                </button>
              </div>
            </div>

            {resumeMode === 'upload' ? (
              <div className="space-y-2">
                <input
                  className={inputClasses}
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleExtractPdf(f);
                    e.currentTarget.value = '';
                  }}
                  disabled={isExtracting || isRunning}
                />
                <p className="text-xs text-muted">
                  PDF is extracted server-side via PDFBox, then you can edit the text before
                  running.
                </p>
              </div>
            ) : null}

            <textarea
              className={textareaClasses}
              placeholder="Paste your resume text here…"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              disabled={isExtracting || isRunning}
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted">{resumeText.length.toLocaleString()} characters</p>

              <button
                type="button"
                className="btn-outline"
                onClick={handleSaveResume}
                disabled={!user || isSaving || isRunning || isExtracting || !resumeText.trim()}
              >
                {isSaving ? 'Saving…' : 'Save resume'}
              </button>
            </div>

            {!user ? (
              <p className="text-xs text-muted">
                Sign in to upload and save resume text. Demo mode below works without login.
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Job description</p>
            <textarea
              className={textareaClasses}
              placeholder="Paste the job description here…"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={isRunning || isExtracting}
            />
            <p className="text-xs text-muted">
              {jobDescription.length.toLocaleString()} characters
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="btn-primary"
              onClick={handleRun}
              disabled={!user || !canRun}
            >
              {isRunning ? 'Running…' : 'Run'}
            </button>

            {isRunning ? (
              <button type="button" className="btn-outline" onClick={handleStop}>
                Stop
              </button>
            ) : null}

            <button
              type="button"
              className="btn-outline"
              onClick={loadDemo}
              disabled={isRunning || isExtracting}
            >
              Load demo
            </button>
          </div>

          {status ? <p className="text-sm text-muted">{status}</p> : null}
        </div>

        <div className="card space-y-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">Output</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={outputView === 'markdown' ? 'btn-primary' : 'btn-outline'}
                onClick={() => setOutputView('markdown')}
                disabled={!output}
              >
                Markdown
              </button>
              <button
                type="button"
                className={outputView === 'raw' ? 'btn-primary' : 'btn-outline'}
                onClick={() => setOutputView('raw')}
                disabled={!output}
              >
                Raw
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setOutput('')}
                disabled={!output || isRunning}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="rounded-md border border-accent/30 bg-background p-4 min-h-[240px] max-h-[646px] overflow-y-auto">
            {!output ? (
              <p className="text-sm text-muted">
                Run a tool (or load the demo) to see output here.
              </p>
            ) : outputView === 'raw' ? (
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {output}
              </pre>
            ) : (
              <Markdown markdown={output} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
