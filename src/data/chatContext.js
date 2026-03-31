import { readFileSync } from 'node:fs';

// Text-only experience data for the backend chatbot
const experiences = [
  {
    title: "Business Intelligence Dashboard Competition (Co-head)",
    company: "TECHNOFUSION 2025",
    period: "May 2025",
    description: "Organized and managed the Data Visualization Competition using Power BI at Technofusion 2025.",
    achievements: [
      "Led end-to-end planning and execution of an event dashboard competition",
      "Engaged over 10+ participants and coordinated with other organizers",
      "Developed evaluation criteria and streamlined judging process for efficiency"
    ]
  },
  {
    title: "NASA INTERNATIONAL SPACE APPS CHALLENGE (HACKATHON)",
    company: "NASA",
    period: "October 2024",
    description: "Created a web app learning material with NASA'S provided data",
    achievements: [
      "Galactic Problem Solver",
      "Partnered with fellow developers to create instructional resources focused on Sustainable Development Goals (SDGs).",
      "Utilized Git, GitHub, React.js, and CSS for version control, collaboration, and front-end development."
    ]
  }
];

// Text-only certificate data for the backend chatbot (no SVG imports)
const certificates = [
  { title: 'Cloud Support Associate Professional Certificate', issuer: 'Amazon Web Services', date: 'June 2025' },
  { title: 'Developing Front-End Apps with React', issuer: 'IBM', date: 'June 2025' },
  { title: 'Developing Back-End Apps with Node.js and Express', issuer: 'IBM', date: 'June 2025' },
  { title: 'Graphic Design with AI Powered Canva for Beginners', issuer: 'Department of Information and Communications Technology', date: 'May 2025' },
  { title: 'Data Analyst Specialist Open House Mentoring Program', issuer: 'Datasense Analytics', date: 'May 2025' },
  { title: 'Mastering Programming and Data Analysis: Leveraging LMS Tools and Power BI', issuer: 'Batangas State University - Alangilan', date: 'October 2024' },
];

const DEFAULT_NAME = 'Chad Bojelador';
const DEFAULT_ROLE =
  'Software Developer; Bachelor of Science in Information Technology student (portfolio site).';
const MAX_RELEVANT_FACTS = 10;
const STOP_WORDS = new Set([
  'a',
  'about',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'can',
  'for',
  'from',
  'how',
  'i',
  'in',
  'is',
  'it',
  'me',
  'of',
  'on',
  'or',
  'tell',
  'that',
  'the',
  'this',
  'to',
  'what',
  'where',
  'who',
  'with',
  'you',
]);

const CV_DATA = loadCvData();

function loadCvData() {
  try {
    const raw = readFileSync(new URL('./cv.json', import.meta.url), 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function clean(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim();
}

function normalizeToken(token) {
  const base = clean(token).toLowerCase();
  if (base.length > 4 && base.endsWith('ies')) {
    return `${base.slice(0, -3)}y`;
  }
  if (base.length > 4 && base.endsWith('s')) {
    return base.slice(0, -1);
  }
  return base;
}

function listOrEmpty(value) {
  return Array.isArray(value) ? value : [];
}

function objectOrEmpty(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function toArrayText(value) {
  return listOrEmpty(value)
    .map((item) => clean(String(item)))
    .filter(Boolean);
}

function formatDescriptionList(value) {
  const items = toArrayText(value);
  return items.length ? items.join('; ') : '';
}

function tokenize(value) {
  return clean(String(value || ''))
    .toLowerCase()
    .split(/[^a-z0-9+#.-]+/i)
    .map((token) => normalizeToken(token))
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function createFactChunk(id, text, options = {}) {
  const normalized = clean(text);
  const keywordTokens = toArrayText(options.keywords).flatMap((item) => tokenize(item));
  return {
    id,
    text: normalized,
    normalized: normalized.toLowerCase(),
    tokens: new Set([...tokenize(normalized), ...keywordTokens]),
    mandatory: Boolean(options.mandatory),
    priority: options.priority || 0,
  };
}

function getCvName() {
  const personalInfo = objectOrEmpty(CV_DATA.personal_info);
  return clean(CV_DATA.name) || clean(personalInfo.name) || DEFAULT_NAME;
}

function getCvRole() {
  return clean(CV_DATA.role) || DEFAULT_ROLE;
}

function getCvLocation() {
  const personalInfo = objectOrEmpty(CV_DATA.personal_info);
  return clean(CV_DATA.location) || clean(personalInfo.address);
}

function buildFactChunks() {
  const chunks = [];
  const personalInfo = objectOrEmpty(CV_DATA.personal_info);
  const skills = objectOrEmpty(CV_DATA.skills);
  const projects = listOrEmpty(CV_DATA.projects);
  const competitions = listOrEmpty(CV_DATA.competitions);
  const education = listOrEmpty(CV_DATA.education);
  const affiliations = listOrEmpty(CV_DATA.affiliations);
  const leadership = listOrEmpty(CV_DATA.experience_leadership);
  const cvCertifications = listOrEmpty(CV_DATA.certifications);
  const summary = clean(CV_DATA.summary);

  const name = getCvName();
  const role = getCvRole();
  const location = getCvLocation();

  chunks.push(
    createFactChunk(
      'identity',
      [name ? `Name: ${name}` : '', role ? `Role: ${role}` : '', location ? `Location: ${location}` : '']
        .filter(Boolean)
        .join('\n'),
      { mandatory: true, priority: 100 }
    )
  );

  chunks.push(
    createFactChunk(
      'navigation',
      [
        'Site navigation:',
        '- Home (/)',
        '- Projects (/projects)',
        '- Certificates (/certificates)',
        '- About/Contact (/about)',
      ].join('\n'),
      { mandatory: true, priority: 90 }
    )
  );

  const publicLinks = [
    clean(personalInfo.github) ? `- GitHub: ${clean(personalInfo.github)}` : '',
    clean(personalInfo.linkedin) ? `- LinkedIn: ${clean(personalInfo.linkedin)}` : '',
    clean(CV_DATA?.contact?.portfolio) ? `- Portfolio: ${clean(CV_DATA.contact.portfolio)}` : '',
  ].filter(Boolean);
  if (publicLinks.length) {
    chunks.push(
      createFactChunk(
        'public-links',
        ['Public links:', ...publicLinks].join('\n'),
        { mandatory: true, priority: 80, keywords: ['contact', 'github', 'linkedin'] }
      )
    );
  }

  if (summary) {
    chunks.push(createFactChunk('summary', `Professional summary: ${summary}`, { priority: 70 }));
  }

  for (const [category, entries] of Object.entries(skills)) {
    const items = toArrayText(entries);
    if (!items.length) continue;
    const label = clean(category).replace(/_/g, ' ');
    chunks.push(
      createFactChunk(
        `skills-${category}`,
        `Skills (${label}): ${items.join(', ')}`,
        { priority: 65, keywords: ['skills', label] }
      )
    );
  }

  education.forEach((item, index) => {
    const entry = objectOrEmpty(item);
    const level = clean(entry.degree) || clean(entry.level);
    const institution = clean(entry.school) || clean(entry.institution);
    const year = clean(entry.period) || clean(entry.year);
    const notes = clean(entry.notes);
    const text = [
      'Education:',
      `- ${[level, institution].filter(Boolean).join(' at ')}${year ? ` (${year})` : ''}${notes ? `: ${notes}` : ''}`,
    ].join('\n');
    if (clean(text.replace('Education:\n- ', ''))) {
      chunks.push(
        createFactChunk(`education-${index}`, text, {
          priority: 60,
          keywords: ['education', 'school', 'degree', 'study'],
        })
      );
    }
  });

  leadership.forEach((item, index) => {
    const entry = objectOrEmpty(item);
    const position = clean(entry.position);
    const organization = clean(entry.organization);
    const year = clean(entry.year);
    const description = formatDescriptionList(entry.description);
    const text = `Leadership or experience: ${[position, organization].filter(Boolean).join(' at ')}${year ? ` (${year})` : ''}${description ? ` - ${description}` : ''}`;
    if (clean(text.replace('Leadership or experience: ', ''))) {
      chunks.push(
        createFactChunk(`leadership-${index}`, text, {
          priority: 68,
          keywords: ['experience', 'leadership', 'organization', 'role'],
        })
      );
    }
  });

  competitions.forEach((item, index) => {
    const entry = objectOrEmpty(item);
    const nameText = clean(entry.name);
    const roleText = clean(entry.role);
    const year = clean(entry.year);
    const description = formatDescriptionList(entry.description) || clean(entry.description);
    const text = `Competition or activity: ${nameText}${roleText ? ` - ${roleText}` : ''}${year ? ` (${year})` : ''}${description ? ` - ${description}` : ''}`;
    if (nameText) {
      chunks.push(
        createFactChunk(`competition-${index}`, text, {
          priority: 64,
          keywords: ['competition', 'hackathon', 'event', 'award'],
        })
      );
    }
  });

  projects.forEach((item, index) => {
    const entry = objectOrEmpty(item);
    const nameText = clean(entry.name);
    const year = clean(entry.year);
    const description = formatDescriptionList(entry.description) || clean(entry.description);
    const text = `Project: ${nameText}${year ? ` (${year})` : ''}${description ? ` - ${description}` : ''}`;
    if (nameText) {
      chunks.push(
        createFactChunk(`cv-project-${index}`, text, {
          priority: 72,
          keywords: ['project', 'projects', 'portfolio', 'build'],
        })
      );
    }
  });

  experiences.forEach((item, index) => {
    const description = clean(item.description);
    const achievements = toArrayText(item.achievements).join('; ');
    chunks.push(
      createFactChunk(
        `experience-${index}`,
        `Experience: ${item.title} at ${item.company} (${item.period}) - ${description}${achievements ? ` Highlights: ${achievements}` : ''}`,
        { priority: 74, keywords: ['experience', 'work', 'role', 'background'] }
      )
    );
  });

  cvCertifications.forEach((item, index) => {
    const entry = objectOrEmpty(item);
    const nameText = clean(entry.name);
    const issuer = clean(entry.issuer);
    const date = clean(entry.date);
    if (!nameText) return;
    chunks.push(
      createFactChunk(
        `cv-cert-${index}`,
        `Certification: ${nameText}${issuer ? ` (${issuer}` : ''}${date ? `${issuer ? ', ' : '('}${date}` : ''}${issuer || date ? ')' : ''}`,
        {
          priority: 62,
          keywords: ['certification', 'certificate', 'certifications', 'certificates', 'cert'],
        }
      )
    );
  });

  certificates.forEach((item, index) => {
    chunks.push(
      createFactChunk(
        `cert-${index}`,
        `Certification: ${item.title} (${item.issuer}, ${item.date})`,
        {
          priority: 66,
          keywords: ['certification', 'certificate', 'certifications', 'certificates', 'cert'],
        }
      )
    );
  });

  affiliations.forEach((item, index) => {
    const entry = objectOrEmpty(item);
    const nameText = clean(entry.name);
    const year = clean(entry.year);
    if (!nameText) return;
    chunks.push(
      createFactChunk(
        `affiliation-${index}`,
        `Affiliation: ${nameText}${year ? ` (${year})` : ''}`,
        { priority: 50, keywords: ['affiliation', 'organization', 'member'] }
      )
    );
  });

  chunks.push(
    createFactChunk(
      'project-medical-records',
      'Project: Medical Record Management System (C++, Qt, MySQL, BST) - Desktop app for patient records with login, data entry, and record views. GitHub: https://github.com/ChadBojelador/Medical-Record-Management-System',
      { priority: 75, keywords: ['project', 'projects', 'medical', 'record', 'c++', 'qt'] }
    )
  );

  chunks.push(
    createFactChunk(
      'project-smart-bin',
      'Project: Smart Waste Bin with Plastic Shredder (Arduino, Google Sheets) - Detects and shreds plastic; logs shredding data through Google Apps Script.',
      { priority: 71, keywords: ['project', 'projects', 'arduino', 'waste', 'plastic'] }
    )
  );

  const uniqueChunks = new Map();
  for (const chunk of chunks.filter((entry) => clean(entry.text))) {
    const key = chunk.normalized;
    const existing = uniqueChunks.get(key);
    if (!existing || chunk.priority > existing.priority) {
      uniqueChunks.set(key, chunk);
    }
  }

  return [...uniqueChunks.values()];
}

const FACT_CHUNKS = buildFactChunks();

function getConversationFocus(messages = []) {
  return listOrEmpty(messages)
    .filter((message) => message?.role === 'user' && typeof message.content === 'string')
    .slice(-3)
    .map((message) => clean(message.content))
    .filter(Boolean)
    .join(' ');
}

function scoreChunk(chunk, queryTokens, queryText) {
  let score = chunk.priority;
  if (!queryTokens.length) return score;

  for (const token of queryTokens) {
    if (chunk.tokens.has(token)) {
      score += 4;
    }
  }

  if (queryText && chunk.normalized.includes(queryText)) {
    score += 8;
  }

  return score;
}

function selectRelevantChunks(messages = []) {
  const queryText = clean(getConversationFocus(messages)).toLowerCase();
  const queryTokens = tokenize(queryText);
  const mandatoryChunks = FACT_CHUNKS.filter((chunk) => chunk.mandatory);
  const optionalChunks = FACT_CHUNKS.filter((chunk) => !chunk.mandatory);

  const ranked = optionalChunks
    .map((chunk) => ({
      chunk,
      score: scoreChunk(chunk, queryTokens, queryText),
    }))
    .sort((a, b) => b.score - a.score || b.chunk.priority - a.chunk.priority);

  const selected = [];
  const targetCount = queryTokens.length ? MAX_RELEVANT_FACTS : 6;

  for (const entry of ranked) {
    if (selected.length >= targetCount) break;
    if (queryTokens.length && entry.score <= entry.chunk.priority) continue;
    selected.push(entry.chunk);
  }

  if (!selected.length) {
    selected.push(...ranked.slice(0, targetCount).map((entry) => entry.chunk));
  }

  return [...mandatoryChunks, ...selected];
}

/**
 * Grounded knowledge for the portfolio assistant (public facts only).
 * Uses lightweight retrieval so only relevant facts are injected per question.
 */
export function buildPortfolioKnowledgeBase(messages = []) {
  return selectRelevantChunks(messages)
    .map((chunk) => chunk.text)
    .join('\n\n')
    .trim();
}

export function buildSystemInstructions({ messages = [] } = {}) {
  const facts = buildPortfolioKnowledgeBase(messages);
  return `Portfolio assistant for Chad Bojelador.

Rules:
- Use only FACTS for claims about Chad (no invented dates, employers, links, or projects).
- Answer only Chad/portfolio topics; decline off-topic briefly and redirect.
- If unknown, say so briefly and suggest a relevant Chad topic.
- Keep replies concise unless user asks for detail.
- Never output secrets or private data. Do not claim to be human.
- For scheduling/email requests, point to the About/Contact page.

FACTS:
${facts}`.trim();
}
