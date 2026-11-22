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
    { id: "cases",       num: "03", title: "Case Studies",        hint: "problems I've solved",      color: "mustard",    icon: "magnifier" },
    { id: "toolkit",     num: "04", title: "My Toolkit",          hint: "frameworks & tools",        color: "blue",       icon: "pencil" },
    { id: "experiments", num: "05", title: "Experiments & Ideas", hint: "AI, ML & side builds",      color: "pink",       icon: "flask" },
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

  /* ---------- 03 · CASE STUDIES ---------- */
  cases: {
    title: "Problems I've pieced together.",
    intro: "Each case follows the same path: scattered pieces → a pattern → a decision.",
    items: [
      {
        tag: "FP&A · DesignCafe",
        title: "From spreadsheets to a single source of truth",
        color: "terracotta",
        image: "",
        problem: "Leadership couldn't see budget vs. actuals without days of manual consolidation. [EDIT]",
        pieces: ["ERP exports", "Salesforce pipeline", "Department budgets"],
        pattern: "Most of the delay came from reconciling the same three sources by hand every month. [EDIT]",
        decision: "Automated the pipeline and built a self-serve BvA dashboard. [EDIT]",
        outcome: "Reporting time down XX%; monthly reviews moved from backward-looking to forward-looking. [EDIT]",
      },
      {
        tag: "Customer insight · DesignCafe",
        title: "What customers were really telling us",
        color: "mustard",
        image: "",
        problem: "Feedback scores dipped, but nobody knew why. [EDIT]",
        pieces: ["Survey responses", "Project timelines", "Support tickets"],
        pattern: "Dissatisfaction clustered around one stage of the delivery journey. [EDIT]",
        decision: "Recommended process changes to the operations team. [EDIT]",
        outcome: "Measurable change in [metric]. [EDIT]",
      },
      {
        tag: "GenAI strategy · HCLTech",
        title: "Finding where GenAI actually pays off",
        color: "blue",
        image: "",
        problem: "A global bank wanted to know where GenAI would actually be worth the investment. [EDIT]",
        pieces: ["Business unit pain points", "Tech capabilities", "Stakeholder priorities"],
        pattern: "The highest-value opportunities sat where manual knowledge work met strict regulation. [EDIT]",
        decision: "Prioritised use cases on a value-vs-feasibility matrix. [EDIT]",
        outcome: "Shortlist of XX opportunities taken forward. [EDIT]",
      },
      {
        tag: "Academic · Duke Fuqua",
        title: "Placeholder case study",
        color: "pink",
        image: "",
        problem: "Describe the business question. [EDIT]",
        pieces: ["Piece one", "Piece two", "Piece three"],
        pattern: "What insight emerged? [EDIT]",
        decision: "What did you recommend? [EDIT]",
        outcome: "What changed? [EDIT]",
      },
    ],
  },

  /* ---------- 04 · TOOLKIT ---------- */
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

  /* ---------- 05 · EXPERIMENTS ---------- */
  experiments: {
    title: "Things I'm tinkering with.",
    intro: "A lab notebook of side projects, half-finished ideas, and things I'm learning by building.",
    items: [
      { title: "Moxie", status: "Building", kind: "AI product", text: "A voice journal & habits app — speak your day, get structure back. [EDIT]", link: "" },
      { title: "AI Readiness Calculator", status: "Prototype", kind: "Strategy tool", text: "Helps an organisation gauge how ready it is to adopt AI. [EDIT]", link: "" },
      { title: "Spending Ledger", status: "Exploring", kind: "Personal finance", text: "Expense tracking with ML-based categorisation. [EDIT]", link: "" },
      { title: "OCR document reader", status: "Shipped", kind: "Computer vision", text: "Pulling structured data from images and scanned documents. [EDIT]", link: "" },
      { title: "Streaming habits analysis", status: "Shipped", kind: "Data analysis", text: "What Netflix & Spotify data says about viewing and listening habits. [EDIT]", link: "" },
      { title: "Next idea", status: "Idea", kind: "???", text: "Always a new puzzle on the table. [EDIT]", link: "" },
    ],
  },

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
