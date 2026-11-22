/* =========================================================
   CONTENT FILE — edit everything here.
   Anything marked  [EDIT]  is placeholder text or a placeholder metric.
   Images: drop files in /assets/images and set `image: "assets/images/x.png"`.
   ========================================================= */

window.SITE = {
  name: "Prerana Munipalli",
  tagline: "Strategy · Analytics · AI",

  home: {
    headline: "Curious about business, fascinated by data, and excited about what AI can build.",
    support:
      "I enjoy connecting the dots between business problems, data, and technology to turn ideas into meaningful outcomes.",
    annotation: "Every problem has pieces. I like figuring out how they fit.",
    instruction: "Piece by piece, explore my world.",
  },

  /* The six puzzle pieces on the board (order = position on the board) */
  pieces: [
    { id: "story",       num: "01", title: "My Story",            hint: "who I am & how I think",    color: "sage",       icon: "bulb" },
    { id: "experience",  num: "02", title: "My Experience",       hint: "DesignCafe → HCLTech",      color: "terracotta", icon: "chart" },
    { id: "projects",    num: "03", title: "Personal Projects",       hint: "things I've built",         color: "mustard",    icon: "flask" },
    { id: "thoughts",    num: "04", title: "Thoughts & Perspectives", hint: "articles I've written",     color: "blue",       icon: "pencil" },
    { id: "toolkit",     num: "05", title: "My Toolkit",              hint: "frameworks & tools",        color: "pink",       icon: "puzzle" },
    { id: "connect",     num: "06", title: "Let's Connect",       hint: "say hello",                 color: "sageDeep",   icon: "coffee" },
  ],

  /* ---------- 01 · MY STORY ---------- */
  story: {
    title: "How I see the world.",
    intro:
      "I've always been the person who'd rather work out how something fits together than be handed the answer. That habit started with jigsaw puzzles and turned into a career. [EDIT]",
    pillars: [
      { title: "Curiosity", text: "I enjoy understanding why things happen, asking questions, and identifying patterns.", icon: "magnifier", note: "always asking 'why?'" },
      { title: "Problem-solving", text: "I like breaking ambiguous challenges into smaller components, identifying root causes, and developing structured solutions.", icon: "puzzle", note: "edges first, then the middle" },
      { title: "Building things", text: "I enjoy turning ideas into tangible outcomes, whether dashboards, automation workflows, business strategies, or AI-powered products.", icon: "pencil", note: "ideas → real things" },
    ],
    education: [
      { school: "Duke University — Fuqua School of Business", degree: "Master's in Quantitative Management", years: "20XX – 20XX [EDIT]", note: "where analytics met strategy" },
      { school: "Christ University, Bangalore", degree: "Bachelor's in Commerce (Honors)", years: "20XX – 20XX [EDIT]", note: "where business clicked" },
    ],
    personal: [
      { label: "Hobby", value: "Jigsaw & logic puzzles (the 1000-piece kind) [EDIT]", color: "mustard" },
      { label: "Currently reading", value: "Book title here [EDIT]", color: "pink" },
      { label: "Interests", value: "AI products, design, travel, coffee [EDIT]", color: "sage" },
      { label: "Fun fact", value: "Something people don't expect about me [EDIT]", color: "blue" },
    ],
  },

  /* ---------- 02 · EXPERIENCE ---------- */
  experience: {
    title: "My professional journey.",
    intro: "Two chapters, one thread: turning messy information into decisions people can act on.",
    chapters: [
      {
        company: "DesignCafe",
        role: "Business Analyst / Strategy",
        period: "20XX – 20XX [EDIT]",
        context: "High-growth interior design startup",
        color: "terracotta",
        summary:
          "Solved business problems through analytics, financial reporting, budgeting, forecasting, process automation, and business intelligence.",
        metrics: [
          { value: "XX%", label: "reduction in reporting time [EDIT]" },
          { value: "₹XX Cr", label: "budget planned & tracked [EDIT]" },
          { value: "XX+", label: "dashboards built [EDIT]" },
        ],
        projects: [
          { title: "Financial budgeting & forecasting", text: "Built budgets and forecasts across sales and P&L. [EDIT: scope, approach, outcome]" },
          { title: "Automated financial reporting", text: "Automated recurring financial reporting workflows. [EDIT: tools used, hours saved]" },
          { title: "Budget-vs-actual dashboards", text: "Gave leadership a live view of spend against plan. [EDIT]" },
          { title: "Revenue performance dashboards", text: "Combined Salesforce and ERP data into one revenue view. [EDIT]" },
          { title: "Customer feedback analysis", text: "Analysed customer feedback and identified root causes of recurring issues. [EDIT]" },
          { title: "Cross-functional collaboration", text: "Worked with Finance, Technology, and leadership teams. [EDIT]" },
        ],
      },
      {
        company: "HCLTech",
        role: "Financial Services — GenAI Strategy & Business Development",
        period: "20XX – Present [EDIT]",
        context: "Large global banking client",
        color: "blue",
        summary:
          "Strategic client engagement, GenAI opportunity identification, stakeholder mapping, and turning technology capabilities into business value propositions.",
        metrics: [
          { value: "XX", label: "GenAI use cases identified [EDIT]" },
          { value: "XX+", label: "stakeholders mapped [EDIT]" },
          { value: "$XXM", label: "pipeline supported [EDIT]" },
        ],
        projects: [
          { title: "Strategic client engagement", text: "Supported engagement with a large global banking client. [EDIT]" },
          { title: "GenAI opportunity identification", text: "Found where GenAI could create measurable business value. [EDIT]" },
          { title: "Stakeholder mapping", text: "Mapped decision-makers, influencers, and priorities across the client organisation. [EDIT]" },
          { title: "Business development", text: "Shaped proposals and pursuit strategy. [EDIT]" },
          { title: "Value propositions", text: "Translated technology capabilities into business value propositions. [EDIT]" },
        ],
      },
    ],
  },

  /* ---------- 03 · PERSONAL PROJECTS ----------
     Practical projects. Each card opens a detail view.
     status: Building | Prototype | Shipped | Exploring      links: [{ label, href }]  (GitHub, live demo…)
     image: "assets/images/your-screenshot.png" (optional) */
  projects: {
    title: "Things I've built.",
    intro: "Practical projects where I picked a real problem, pulled the data together, and built something that works.",
    items: [
      {
        title: "Moxie", kind: "AI product", status: "Building", color: "terracotta", image: "",
        summary: "A voice journal and habits app: speak about your day and get structure back. [EDIT]",
        problem: "Journaling and habit tracking take effort, so most people stop after a week. [EDIT]",
        approach: "A mobile-friendly web app where you talk instead of type, and AI turns it into entries and habit check-ins. [EDIT]",
        outcome: "What you learned or what it does today. [EDIT]",
        tools: ["Supabase", "Vercel", "Generative AI", "[EDIT]"],
        links: [], // e.g. { label: "Try it", href: "https://…" }
      },
      {
        title: "AI Readiness Calculator", kind: "Strategy tool", status: "Prototype", color: "mustard", image: "",
        summary: "Helps an organisation gauge how ready it is to adopt AI. [EDIT]",
        problem: "Companies want to 'do AI' without knowing where they stand. [EDIT]",
        approach: "A short assessment across data, people, process and tech, scored into a readiness level. [EDIT]",
        outcome: "[EDIT]",
        tools: ["[EDIT]"], links: [],
      },
      {
        title: "Spending Ledger", kind: "Personal finance", status: "Exploring", color: "sage", image: "",
        summary: "Expense tracking with ML-based categorisation. [EDIT]",
        problem: "Categorising expenses by hand is tedious and inconsistent. [EDIT]",
        approach: "Train a model on past transactions to suggest categories automatically. [EDIT]",
        outcome: "[EDIT]",
        tools: ["Python", "scikit-learn", "[EDIT]"], links: [],
      },
      {
        title: "OCR document reader", kind: "Computer vision", status: "Shipped", color: "blue", image: "",
        summary: "Pulls structured data from images and scanned documents. [EDIT]",
        problem: "Useful information is often trapped in scans and photos. [EDIT]",
        approach: "Detect and read text regions, then turn them into structured fields. [EDIT]",
        outcome: "[EDIT]",
        tools: ["Python", "OCR", "YOLO", "[EDIT]"], links: [],
      },
      {
        title: "Streaming habits analysis", kind: "Data analysis", status: "Shipped", color: "pink", image: "",
        summary: "What Netflix and Spotify data says about viewing and listening habits. [EDIT]",
        problem: "[EDIT]",
        approach: "Cleaned and explored personal streaming exports to find patterns. [EDIT]",
        outcome: "[EDIT]",
        tools: ["Python", "pandas", "[EDIT]"], links: [],
      },
    ],
  },

  /* ---------- 04 · THOUGHTS & PERSPECTIVES ----------
     Articles you've written. Each card links out to where it's published.
     The three below are PLACEHOLDERS — replace with your real articles. [EDIT] */
  thoughts: {
    title: "Thoughts & perspectives.",
    intro: "Writing is how I think things through. A few pieces on strategy, data and AI.",
    items: [
      { title: "Article title [EDIT]", date: "Month 20XX", platform: "LinkedIn", read: "4 min read", tag: "Generative AI", summary: "One or two sentences on what the piece argues. [EDIT]", href: "https://www.linkedin.com/" },
      { title: "Article title [EDIT]", date: "Month 20XX", platform: "Medium", read: "6 min read", tag: "Strategy", summary: "One or two sentences on what the piece argues. [EDIT]", href: "https://medium.com/" },
      { title: "Article title [EDIT]", date: "Month 20XX", platform: "LinkedIn", read: "3 min read", tag: "Analytics", summary: "One or two sentences on what the piece argues. [EDIT]", href: "https://www.linkedin.com/" },
    ],
  },

  /* ---------- 05 · TOOLKIT ---------- */
  toolkit: {
    title: "The pieces I reach for.",
    intro: "Hover or tap a piece to see when I use it. [EDIT: confirm every tool listed here]",
    groups: [
      {
        name: "Strategy frameworks", color: "sage",
        items: [
          { name: "Issue trees / MECE", use: "Breaking an ambiguous question into solvable parts" },
          { name: "Hypothesis-driven analysis", use: "Starting with a likely answer, then testing it" },
          { name: "Value vs. feasibility", use: "Prioritising initiatives and use cases" },
          { name: "Stakeholder mapping", use: "Understanding who decides, who influences" },
          { name: "Porter's Five Forces", use: "Sizing up a market's dynamics" },
          { name: "Root-cause analysis", use: "Getting past symptoms to the real problem" },
        ],
      },
      {
        name: "Analytics & BI", color: "blue",
        items: [
          { name: "SQL", use: "Pulling and shaping data [EDIT]" },
          { name: "Python", use: "Analysis, automation, ML [EDIT]" },
          { name: "Excel / Sheets", use: "Models, forecasts, quick analysis" },
          { name: "Power BI / Tableau", use: "Dashboards for leadership [EDIT]" },
          { name: "Salesforce reporting", use: "Pipeline & revenue data" },
        ],
      },
      {
        name: "Finance & performance", color: "terracotta",
        items: [
          { name: "Budgeting & forecasting", use: "Sales and P&L planning" },
          { name: "Budget vs. actuals", use: "Tracking performance against plan" },
          { name: "P&L analysis", use: "Understanding what drives margin" },
          { name: "Reporting automation", use: "Removing manual work from monthly cycles" },
        ],
      },
      {
        name: "AI & emerging tech", color: "pink",
        items: [
          { name: "Generative AI strategy", use: "Finding where GenAI creates value" },
          { name: "Prompt & workflow design", use: "Building with LLMs" },
          { name: "Predictive analytics", use: "Forecasting outcomes from data" },
          { name: "Machine learning basics", use: "Classification, regression, CV [EDIT]" },
        ],
      },
      {
        name: "Ways of working", color: "mustard",
        items: [
          { name: "Cross-functional collaboration", use: "Finance, tech & leadership in one room" },
          { name: "Executive storytelling", use: "Turning analysis into a decision" },
          { name: "Implementation planning", use: "From recommendation to roadmap" },
        ],
      },
    ],
  },

  /* ---------- TABLE OBJECTS ----------
     Each object on the table has a sticky-note clue (teaser). Clicking it opens a small card.
     These are DEMO hobbies — replace with your own. [EDIT] */
  hobbies: [
    { id: "sorter", teaser: "Edges first. Always.", title: "The puzzle habit", body: ["I sort edge pieces before anything else. It turns out that's how I approach messy problems at work, too.", "Current puzzle: [EDIT]"] },
    // The sudoku on the table is the "hobbies" spot — edit the list below [EDIT]
    { id: "sudoku", teaser: "My hobbies ✎", title: "Things I do for fun", body: ["A few things that keep my brain happy:"], list: [
      "Jigsaw puzzles: edges first, always",
      "Sudoku & crosswords (pen, not pencil)",
      "Reading. Currently: [EDIT]",
      "Café hopping, still hunting for the perfect cortado [EDIT]",
      "[EDIT: add your own]",
    ] },
  ],
  // Sticky note on the mug + resume sheet, and hover labels for the lamp, laptop and box
  objectTeasers: {
    coffee: "Let's talk over coffee ☕",
    resume: "Download my resume ↓",
    laptop: "Just the highlights",
    lamp: "Desk lamp · night mode",
    box: "The picture on the box",
  },

  /* The mug on the table opens this card */
  coffee: {
    kicker: "let's grab a coffee",
    title: "Discuss more over coffee?",
    text: "Whether it's a role, a problem you're working through, or just AI and puzzles, I'm always happy to chat. Virtual coffee counts.",
    calendar: "", // [EDIT] optional: a Calendly / Google booking link
  },

  /* "Just the highlights" — the one-page version for busy recruiters */
  highlights: {
    summary: "Strategy and analytics professional who turns ambiguous business problems into data-backed decisions: FP&A and BI at a high-growth startup, GenAI strategy for a global bank, and a Master's in Quantitative Management from Duke Fuqua. [EDIT]",
    lookingFor: ["Strategy & Planning", "Strategy & Operations", "Business Strategy", "Business Operations", "Consulting"],
    interests: ["Business strategy", "Financial planning & performance", "Product strategy", "Generative AI", "Analytics"],
  },

  /* Puzzle picture: leave "" for the illustrated placeholder, or set an image path
     like "assets/images/puzzle.jpg" (landscape, roughly 3:2). */
  puzzleImage: "",

  /* ---------- 06 · CONNECT ---------- */
  connect: {
    title: "Let's connect the dots.",
    text: "Hiring for strategy, operations, or planning? Or just want to talk AI, data, or a good puzzle? I'd love to hear from you.",
    links: [
      { label: "Email", value: "you@example.com [EDIT]", href: "mailto:you@example.com", icon: "mail" },
      { label: "LinkedIn", value: "linkedin.com/in/your-handle [EDIT]", href: "https://www.linkedin.com/", icon: "link" },
      { label: "GitHub", value: "github.com/preranamunipalli1", href: "https://github.com/preranamunipalli1", icon: "code" },
      { label: "Resume", value: "Download PDF [EDIT: add assets/resume.pdf]", href: "assets/resume.pdf", icon: "doc" },
    ],
  },
};
