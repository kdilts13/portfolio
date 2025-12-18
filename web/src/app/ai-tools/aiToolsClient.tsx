'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import HighlightCard from '@/app/components/highlightCard';
import SectionHeader from '@/app/components/sectionHeader';

type Tool = 'resume_tailor' | 'job_fit';

type ExtractResponse = { text: string };
type ErrorResponse = { error?: string; message?: string };

const inputClasses =
  'w-full rounded-md border border-accent/60 bg-background px-3 py-2 text-sm text-foreground ' +
  'placeholder:text-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue';

const textareaClasses = inputClasses + ' min-h-[180px] resize-y leading-relaxed';

const DEMO_RESUME_TEXT = `SENIOR SOFTWARE ENGINEER

Software engineer with 8+ years of experience building production web applications.
Strong background in backend and frontend development, API design, search systems,
authentication flows, UI performance optimization, SEO improvements, and
cross-functional feature delivery.

Motivated by clean design, maintainable code, and building systems that scale.
Hands-on experience with cloud infrastructure, containerization, and CI/CD pipelines.
Google Cloud certified.


PROFESSIONAL EXPERIENCE

Senior Software Engineer
Long-term consulting engagements | Jan 2017 - Apr 2025

Worked across multiple multi-year client projects delivering production features
for large-scale consumer-facing applications. Collaborated closely with product
managers, designers, and engineers to plan, build, and ship user-facing features.

• Built and maintained web applications using modern JavaScript frameworks and
  functional backend technologies.
• Improved application performance in a project-tracking system by optimizing
  frontend logic, reducing page load time by ~30 seconds.
• Mentored junior developers, helping them ramp up quickly and contribute
  effectively to production work.
• Participated extensively in code reviews and architecture discussions to
  maintain high code quality across teams.


SELECTED PROJECT HIGHLIGHTS

High-Traffic Consumer Web Platform (Contract)

• Improved SEO and page performance for high-traffic, server-rendered pages by
  optimizing rendering strategies, tuning metadata, and implementing XML sitemaps.
• Designed and implemented a configurable search results component supporting
  100+ variants, enabling faster rollout of new experiments and configurations.
• Led development of a new search-driven landing page, improving usability and
  discoverability for millions of monthly users.
• Enhanced data ingestion workflows for large media datasets, enforcing business
  rules and integrating new vendor formats.


Healthcare Automation Platform (Contract)

• Exceeded throughput targets by over 20% during contract engagement.
• Developed an automation system for processing structured medical forms using
  rule-based logic designed by domain experts.
• Fixed critical issues related to data integrity, application performance, and
  UI behavior to support successful production deployment.
• Built and maintained REST APIs for data processing, feedback tracking, and
  automated suggestions within a modular backend architecture.


TECHNICAL SKILLS

Languages
Elixir, TypeScript, JavaScript, HTML, CSS, Java

Frameworks & Libraries
Phoenix, React, Next.js, Angular, Redux, Node.js, Firebase Authentication

Databases & Search
MySQL, PostgreSQL, MongoDB, Elasticsearch

Cloud & DevOps
Google Cloud Platform, Docker, Kubernetes, Terraform, Flyway
AWS (basic experience)

CI/CD & Monitoring
CircleCI, Jenkins, Datadog

Testing & Quality
Jest, React Testing Library, Mocha, Chai, ESLint, Dialyzer

Developer Tools
Linux (Ubuntu/Debian), Bash, Git, VS Code, Postman


EDUCATION & CERTIFICATIONS

Bachelor of Science in Computer Science

Google Cloud Certified - Associate Cloud Engineer
Google Cloud Certified - Cloud Digital Leader
`;

const DEMO_JOB_DESCRIPTION_BORDERLINE = `Senior Software Engineer - Platform & Web Applications

Company Overview
We are a mid-sized technology company building data-driven web platforms used
by millions of users. Our teams work closely with product and design to deliver
high-impact features while maintaining a strong engineering culture focused on
quality, scalability, and long-term maintainability.

This role sits at the intersection of backend systems and modern web
applications. You will contribute to both product-facing features and shared
platform capabilities.


Role Summary
We are looking for a Senior Software Engineer to help design, build, and maintain
scalable web applications and supporting backend services. You will work on
performance-sensitive user flows, internal APIs, and search-driven experiences.

The ideal candidate has strong full-stack experience, is comfortable owning
features end to end, and can collaborate effectively across disciplines.


Key Responsibilities
• Design and build user-facing web applications with a focus on performance,
  accessibility, and maintainability.
• Develop and maintain backend services and REST APIs that support core product
  functionality.
• Collaborate with product managers and designers to translate requirements into
  technical solutions.
• Improve application performance, reliability, and monitoring for
  high-traffic systems.
• Participate in code reviews, architecture discussions, and technical planning.
• Mentor less-experienced engineers and contribute to team best practices.


Required Qualifications
• 6+ years of professional software engineering experience.
• Strong experience with modern JavaScript frameworks (React or similar).
• Experience building and consuming REST APIs.
• Solid understanding of web performance, SEO considerations, and browser
  behavior.
• Experience working with relational databases.
• Familiarity with cloud-based deployments and containerized applications.
• Strong communication skills and ability to work in cross-functional teams.


Preferred / Nice-to-Have Qualifications
• Experience with functional or actor-based backend systems.
• Experience with search platforms or search-driven user experiences.
• Experience with infrastructure-as-code tools (Terraform or similar).
• Exposure to Kubernetes in production environments.
• Experience in healthcare, finance, or other regulated domains.
• Prior experience working in a consulting or agency-style environment.


Seniority & Scope Expectations
This is a senior-level individual contributor role. You are expected to:
• Own medium-to-large features from design through production.
• Provide technical guidance to peers.
• Make sound architectural decisions within an existing system.
• Collaborate with staff and principal engineers on broader platform initiatives.

This role does not currently include people management responsibilities.


Location & Work Model
• Remote-friendly within the United States.
• Core collaboration hours aligned to U.S. time zones.
• Occasional travel (1-2 times per year) for team offsites.


Compensation & Benefits
• Competitive salary based on experience and location.
• Equity participation.
• Health, dental, and vision benefits.
• Flexible PTO and paid holidays.
• Annual learning and professional development budget.


Application Notes
We encourage candidates to apply even if they do not meet every listed
qualification. We value practical experience, problem-solving ability, and a
willingness to learn over checking every box.`;

const DEMO_JOB_DESCRIPTION_GOOD_FIT = `Senior Software Engineer - Web Platforms

Company Overview
We are a product-focused technology company building high-traffic web
applications used by millions of users. Our engineering teams emphasize
pragmatic design, clean code, and incremental delivery of customer-facing
features.

We value engineers who can move comfortably between frontend and backend
concerns and who enjoy collaborating closely with product, design, and data
partners.


Role Summary
We are seeking a Senior Software Engineer to work on our core web platform.
This role focuses on building and optimizing user-facing features, internal
APIs, and search-driven experiences that operate at significant scale.

You will take ownership of features from concept through production and help
raise the quality bar across the team.


Key Responsibilities
• Build and maintain modern web applications with a strong focus on performance
  and usability.
• Design and implement backend services and REST APIs that support product
  features.
• Optimize page load times, rendering behavior, and SEO for high-traffic pages.
• Collaborate with product managers and designers to plan and deliver features.
• Participate in code reviews and architectural discussions.
• Mentor junior and mid-level engineers.


Required Qualifications
• 6+ years of professional software engineering experience.
• Strong experience with React and modern JavaScript/TypeScript.
• Experience building backend services using modern frameworks.
• Solid understanding of web performance, SEO, and accessibility best practices.
• Experience working with relational databases.
• Experience deploying applications to cloud environments.
• Familiarity with CI/CD pipelines and automated testing.


Preferred Qualifications
• Experience with functional backend languages or frameworks.
• Experience with search platforms or search-heavy user experiences.
• Exposure to containerization and infrastructure-as-code tools.
• Experience working on large, consumer-facing web products.


Location & Work Model
• Fully remote within the United States.
• Optional in-person team gatherings once or twice per year.


Compensation & Benefits
• Competitive salary and equity.
• Comprehensive health benefits.
• Flexible PTO.
• Annual learning budget.
`;

const DEMO_JOB_DESCRIPTION_BAD_FIT = `Principal Embedded Systems Engineer - Autonomous Hardware

Company Overview
We are an advanced robotics company building autonomous hardware systems for
industrial and defense applications. Our products operate in real-time,
safety-critical environments with strict performance and reliability
requirements.

This role is deeply focused on low-level systems programming and hardware
integration.


Role Summary
We are looking for a Principal Embedded Systems Engineer to lead the design and
development of firmware and low-level software for next-generation autonomous
devices.

This role requires deep expertise in embedded systems, real-time operating
systems, and hardware-software integration, along with significant technical
leadership responsibilities.


Key Responsibilities
• Design and implement embedded firmware in C and C++ for real-time systems.
• Work closely with electrical and mechanical engineers to integrate software
  with custom hardware.
• Develop and optimize software running on RTOS platforms.
• Lead architecture decisions for safety-critical systems.
• Establish coding standards and review low-level systems code.
• Mentor senior engineers and provide technical leadership across teams.


Required Qualifications
• 12+ years of professional software engineering experience.
• 8+ years of embedded systems development experience.
• Expert-level proficiency in C and C++.
• Extensive experience with real-time operating systems (RTOS).
• Experience working directly with hardware, sensors, and microcontrollers.
• Experience in regulated or safety-critical environments.
• Proven experience leading large technical initiatives.


Preferred Qualifications
• Experience with autonomous systems, robotics, or aerospace.
• Familiarity with FPGA development.
• Experience with formal verification or safety certification processes.
• Prior experience in defense or industrial automation sectors.


Location & Work Model
• On-site role, five days per week.
• Must be located near company headquarters.
• Travel up to 25% required.


Compensation & Benefits
• Highly competitive compensation for principal-level candidates.
• Performance-based bonuses.
• Comprehensive benefits package.
`;

const DEMO_JOBS_FIT_ANALYSIS_PROMPT = `[Job 1]

${DEMO_JOB_DESCRIPTION_BORDERLINE}

[Job 2]

${DEMO_JOB_DESCRIPTION_GOOD_FIT}

[Job 3]

${DEMO_JOB_DESCRIPTION_BAD_FIT}
`;

const DEMO_JOBS_FIT_ANALYSIS_RESPONSE = `### Summary

| Job ID | Title (guessed)                               | Company (if known)             | Fit Score | Priority | Quick Note                                               |
|--------|-----------------------------------------------|-------------------------------|-----------|----------|---------------------------------------------------------|
| JOB 1  | Senior Software Engineer - Platform & Web Apps | Mid-sized tech company (unnamed) | 90/100    | High     | Strong full-stack, backend and frontend, search, cloud, mentoring experience. |
| JOB 2  | Senior Software Engineer - Web Platforms       | Product-focused tech company (unnamed) | 88/100    | High     | Very similar to JOB 1, strong React, backend, SEO, performance, cloud.          |
| JOB 3  | Principal Embedded Systems Engineer             | Advanced robotics company       | 15/100    | Low      | Mismatch on domain (embedded), low-level languages, hardware, RTOS.              |

---

### Detailed Analysis

#### JOB 1 — Senior Software Engineer - Platform & Web Applications at Mid-sized tech company

**Verdict & Fit Score:** Strong — **90/100**
The candidate’s 8+ years in production web applications with strong full-stack skills and cloud experience align well with the senior-level software engineer role focusing on web platforms and backend systems.

**Why You're a Good Fit**
- 8+ years software engineering experience matches required 6+ years.
- Strong experience with modern JavaScript frameworks including React, Next.js, Angular; the job wants React or similar.
- Built and maintained REST APIs, matching backend API requirements.
- Experience with relational databases: MySQL, PostgreSQL.
- Cloud and container expertise: Google Cloud, Kubernetes, Docker, Terraform, CI/CD pipelines.
- Web performance, SEO, accessibility optimization shown in multiple projects.
- Mentoring junior developers and participating in architecture discussions fits senior role expectations.
- Experience with search-driven user experiences (search component with 100+ variants) matches preferred qualification.

**Gaps / Risks / Missing Requirements**
- No explicit mention of actor-based or functional backend systems except partial Elixir (functional), but that aligns enough to count as a soft plus.
- No explicit experience in healthcare, finance, or regulated domains except Healthcare Automation Platform which is relevant but unclear if regulated domain experience is fully met.
- No mention of infrastructure-as-code tools beyond Terraform (present) or Kubernetes in production; Google Cloud and Kubernetes usage support cloud deployment familiarity strongly though.
- No consulting/agency experience explicitly stated but long-term consulting engagements suggest some overlap.

**Seniority & Role Alignment**
- 8+ years experience fits the 6+ years senior requirement.
- Led technical projects, mentored others, involved in architecture reviews.
- Owned medium-to-large features end to end.
- Demonstrated ability to collaborate cross-functionally with product and design.
- Proven ability to improve system performance and scalability.

**Location / Remote / Constraints**
- The role is remote-friendly within U.S.; no geographic constraints stated in resume.
- Candidate remote status unknown but long-term consulting implies comfort with distributed work.

**Recommendation: Apply Priority**
- **Priority: High**
- Strong fit technically and culturally; excellent opportunity to leverage full stack, cloud, search skills with senior scope.

**Tailored Focus Notes**
- Emphasize experience with full-stack development and React/Next.js explicitly.
- Highlight cloud and container orchestration experience (Google Cloud, Kubernetes, Terraform).
- Call out mentoring and leadership in technical discussions.
- Stress SEO and performance optimization successes for large-scale consumer platforms.
- Showcase search-driven feature development and modular backend API design.
- If possible, clarify consulting engagement nature as agency-style or client-facing to match nice-to-have.

---

#### JOB 2 — Senior Software Engineer - Web Platforms at Product-focused tech company

**Verdict & Fit Score:** Strong — **88/100**
Closely matches the candidate’s profile with emphasis on React, backend services, SEO, and cloud deployment. Very similar role to JOB 1 with slightly different emphasis on CI/CD and TypeScript.

**Why You're a Good Fit**
- 8+ years experience meets senior requirement.
- Strong React and modern JavaScript framework skills, experience with TypeScript as well.
- Backend API development experience using REST aligns well.
- SEO, accessibility, and web performance improvements demonstrated extensively.
- Experience with relational databases (MySQL, PostgreSQL).
- Hands-on cloud deployment experience (Google Cloud, AWS basic) and CI/CD pipelines (CircleCI, Jenkins).
- Mentoring junior developers aligns with team leadership expectations.

**Gaps / Risks / Missing Requirements**
- No explicit mention of building backend services with specific modern backend frameworks besides Phoenix and Node.js; details on frameworks used backend are somewhat sparse.
- Experience with functional backend languages/frameworks (Elixir, Phoenix) maps well but ambiguous if used extensively for services.
- Containerization and infra-as-code exposure is confirmed but not deeply detailed (e.g., extent of Terraform use or container orchestration).
- No mention of automated testing frameworks besides Jest, React Testing Library, Mocha which is positive.
- No mention of large consumer-facing web product work, but high-traffic consumer web platform suggests similar scale indirectly.

**Seniority & Role Alignment**
- Matched by years and technical depth.
- Has taken ownership of features end to end.
- Experience driving quality improvements and mentoring engineers.
- Participated in architecture and code reviews regularly.

**Location / Remote / Constraints**
- Fully remote within U.S., fits typical consulting engagements in resume timeline.

**Recommendation: Apply Priority**
- **Priority: High**
- Excellent fit on almost all counts; similar to JOB 1 so could prioritize either or both.

**Tailored Focus Notes**
- Highlight TypeScript and React expertise.
- Stress backend REST API design and performance improvements.
- Emphasize CI/CD experience and automated testing involvement.
- Call out SEO and accessibility focus in frontend development.
- Illustrate capability to operate in fully remote cross-team settings.

---

#### JOB 3 — Principal Embedded Systems Engineer - Autonomous Hardware at Advanced Robotics Company

**Verdict & Fit Score:** Weak — **15/100**
This embedded systems role is fundamentally mismatched with the candidate’s web development and cloud consulting background.

**Why You're a Good Fit**
- No direct fit. Candidate's expertise is in high-level full-stack web apps and cloud, not embedded firmware or RTOS.

**Gaps / Risks / Missing Requirements**
- Missing embedded systems, C/C++, RTOS, hardware integration experience completely.
- No evident leadership or architecture experience at principal Embedded Engineer level.
- No experience with sensors, microcontrollers, FPGA, or formal safety-critical software processes.
- Seniority mismatch: Principal vs candidate’s senior software engineer level with different domain focus.
- On-site, high travel requirement unlikely to fit candidate profile.

**Seniority & Role Alignment**
- Candidate seniority aligns with senior software engineer, not principal embedded systems engineer with 12+ years embedded experience.
- No embedded domain knowledge or relevant low-level programming skills.

**Location / Remote / Constraints**
- On-site role with travel, likely incompatible with candidate’s current consulting status and skillset.

**Recommendation: Apply Priority**
- **Priority: Low**
- Major domain and skill mismatch, not a practical or strategic job to pursue.

**Tailored Focus Notes**
- Not recommended to tailor resume for this role.

---

# Final Recommendation

Focus your efforts on JOB 1 and JOB 2 as both offer a strong match to your experience and career trajectory. Both roles highly match your senior full-stack development, cloud, and search performance optimization experience. The embedded systems principal role is not aligned with your skills or career path. Between JOB 1 and JOB 2, both are excellent options; perhaps start with the company or role that excites you most or where you can best leverage your long-term consulting and mentoring experience.`;

export default function AiToolsClient() {
  const { user } = useAuth();

  const [tool, setTool] = useState<Tool>('job_fit');
  const [resumeMode, setResumeMode] = useState<'upload' | 'paste'>('upload');

  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [output, setOutput] = useState('');

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
            <button
              type="button"
              className="btn-outline"
              onClick={() => setOutput('')}
              disabled={!output || isRunning}
            >
              Clear
            </button>
          </div>

          <div className="rounded-md border border-accent/30 bg-background p-4">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {output || 'Run a tool (or load the demo) to see output here.'}
            </pre>
          </div>

          <p className="text-xs text-muted">
            Output is markdown text streamed from the backend. In v2, we can store runs and show
            history.
          </p>
        </div>
      </section>
    </div>
  );
}
