// ─────────────────────────────────────────────
//  SITE CONFIG  - update your core info here
// ─────────────────────────────────────────────
export const siteConfig = {
  name: "Val Chen",
  nameShort: "VC",
  role: "Product · Design · Strategy",
  headline: "Val Chen",
  subheadline:
    "UCSD Business Economics student and aspiring PM at the intersection of design, marketing, and creative strategy. I work best where curiosity meets execution.",
  email: "val.chen21@gmail.com",
  linkedin: "https://www.linkedin.com/in/val-chen/",
  github: "https://github.com",
  resumeUrl: "/resume.pdf",
};

// ─────────────────────────────────────────────
//  DISCIPLINE TAGS - shown in hero
// ─────────────────────────────────────────────
export const disciplines = [
  "Product Strategy",
  "UX & Prototyping",
  "Growth & GTM",
  "Brand & Identity",
  "Creative Direction",
  "0 → 1 Builds",
];

// ─────────────────────────────────────────────
//  PROJECTS
// ─────────────────────────────────────────────
export const projects = [
  {
    id: "product-space",
    index: "01",
    title: "Venmo Storefront Case Study",
    category: "Product · PM Fellowship",
    role: "Product Manager Fellow",
    summary:
      "A 7-month PM fellowship at UCSD - conducting user research, writing PRDs, and leading a 3-person cross-functional team to redesign and ship a product end-to-end.",
    problem:
      "The product had accumulated 10+ friction points in its core user flows that had gone unaddressed due to lack of structured PM process. Users were dropping off without a clear signal of why.",
    outcome:
      "Addressed 10+ key user pain points through research-backed iteration. Team stayed 7+ days ahead of schedule across all 10 weeks. Capstone project delivered end-to-end from ideation to launch.",
    skills: ["Product Strategy", "User Research", "PRD Writing", "Figma", "Jira", "Cross-functional Leadership"],
    gradient: "from-[#0d1018] via-[#101525] to-[#0d1018]",
    accentColor: "#5BAECC",
    accentLight: "#7ECDE6",
    number: "01",
    caseStudyUrl: "/case-studies/venmo",
    coverImage: "/Venmo/Venmo Storefronts Cover.png",
  },
  {
    id: "dsgn100",
    index: "02",
    title: "UCSD DSGN 100",
    category: "UX · Academic Capstone",
    role: "UX Designer & Researcher",
    summary:
      "End-to-end UX capstone for UCSD's design program - moving from discovery research through ideation, wireframing, and a polished high-fidelity prototype presented to faculty and peers.",
    problem:
      "The brief required identifying a real, underserved problem through primary research and designing a solution from scratch - no predefined scope, no existing product to iterate on.",
    outcome:
      "Delivered a high-fidelity prototype with documented research, user journey maps, and a final design presentation to a panel of UCSD design faculty.",
    skills: ["UX Research", "Figma", "Prototyping", "User Testing", "Design Systems", "Presentation"],
    gradient: "from-[#13100f] via-[#1f1610] to-[#13100f]",
    accentColor: "#C4A55A",
    accentLight: "#D9BF7A",
    number: "02",
    caseStudyUrl: "/case-studies/dsgn100",
  },
  {
    id: "akpsi",
    index: "03",
    title: "AKPsi Recruitment",
    category: "Operations · Growth",
    role: "President, Alpha Kappa Psi",
    summary:
      "Overhauled recruitment operations as President of UCSD's Alpha Kappa Psi - building a custom recruitment portal from scratch and running a campaign that broke every previous record.",
    problem:
      "Recruitment was entirely manual - no centralized portal, inconsistent outreach, and no visibility into funnel metrics. The process didn't scale and was burning out the team.",
    outcome:
      "102k Instagram impressions in 27 days. Follower count up 29.1%. Interest form signups up 62.7% with 450+ forms submitted - the most in chapter history. Built the portal with a 14-person team of designers and developers.",
    skills: ["Operations Strategy", "Growth Marketing", "Vercel", "Figma", "Team Leadership", "Campaign Planning"],
    gradient: "from-[#0f1a14] via-[#0f2018] to-[#0f1a14]",
    accentColor: "#4AB8A0",
    accentLight: "#6ED4BC",
    number: "03",
  },
  {
    id: "bereal",
    index: "04",
    title: "BeReal",
    category: "Product · Case Study",
    role: "Product Manager",
    summary:
      "A product management deep-dive into BeReal's retention and engagement mechanics - identifying core drop-off points, proposing feature solutions, and stress-testing them through user interviews.",
    problem:
      "BeReal had a novelty problem: high initial installs followed by steep drop-off. The dual-camera constraint that made it compelling also made it easy to abandon when the habit didn't stick.",
    outcome:
      "Developed 3 validated feature proposals targeting D7, D30, and long-term retention. Mapped full user journey and competitive landscape. Presented recommendations in a stakeholder-style pitch deck.",
    skills: ["Product Analysis", "Retention Strategy", "User Interviews", "Competitive Research", "PRD Writing", "Figma"],
    gradient: "from-[#180d14] via-[#220f1c] to-[#180d14]",
    accentColor: "#B44A8B",
    accentLight: "#D472A8",
    number: "04",
  },
];

// ─────────────────────────────────────────────
//  EXPERIENCE  (Resume)
// ─────────────────────────────────────────────
export const experience = [
  {
    company: "Swipe Up Studios",
    role: "Project Manager",
    period: "Mar 2025 – Mar 2026",
    location: "San Diego, CA",
    description:
      "Short-form media production company. Managed influencer social media campaigns for creators with 10M+ followers - including AMP Group, Michelle Khare, and Law By Mike.",
    highlights: [
      "Orchestrated campaigns for AMP Group, Michelle Khare, and Law By Mike (10M+ followers each)",
      "Overhauled Discord and Notion teamspaces for 20+ members, simplifying the production pipeline",
      "Instituted the first SOPs to standardize operations and reduce onboarding time by over 100%",
      "Built a Kanban-based backup system archiving 40+ client-approved ideas",
    ],
  },
  {
    company: "Beats by Dre",
    role: "Consumer Behavior & Market Analysis Extern",
    period: "Jan 2025 – Feb 2025",
    location: "San Diego, CA",
    description:
      "Premium audio and lifestyle brand. Designed and executed a consumer insights research initiative - from survey design through quantitative analysis and executive presentation.",
    highlights: [
      "Distributed consumer insights survey to 100+ respondents; analyzed purchasing behavior and brand trends",
      "Conducted analysis on 200+ data points using AI-driven tools and Google Sheets to extract KPIs",
      "Developed 8+ data visualizations illustrating trends in consumer preferences",
      "Presented findings to 300+ other externs and 5 program managers",
    ],
  },
  {
    company: "Jack in the Box",
    role: "Marketing Associate",
    period: "May 2024 – Jan 2025",
    location: "San Diego, CA",
    description:
      "Nationwide fast-food chain. Executed paid and organic social campaigns across Meta, TikTok, and X - driving reach, engagement, and brand awareness through short-form content.",
    highlights: [
      "Delivered an average of 29.2M impressions across Meta, TikTok, and X; peaked at 41.3M",
      "Secured 109M impressions and 206K engagements in a single campaign via strategic segmentation",
      "Maintained a 17.1% engagement rate at peak by redefining standards for modern short-form humor",
      "Contributed to 15 video projects across 6 campaigns for paid, organic, and television placements",
    ],
  },
];

// ─────────────────────────────────────────────
//  EDUCATION
// ─────────────────────────────────────────────
export const education = [
  {
    institution: "UC San Diego - Rady School of Management",
    degree: "B.S. Business Economics",
    period: "Expected June 2026",
    note: "La Jolla, CA",
  },
  {
    institution: "Product Space, Inc.",
    degree: "Product Manager Fellow",
    period: "Nov 2024 – Jun 2025",
    note: "10-week intensive PM fellowship",
  },
];

// ─────────────────────────────────────────────
//  SKILLS
// ─────────────────────────────────────────────
export const skills = {
  "Product": [
    "Product Strategy",
    "Roadmapping",
    "User Research",
    "PRD Writing",
    "A/B Testing",
    "Customer Analytics",
    "Agile / Kanban",
    "SDLC",
  ],
  "Design & UX": [
    "Figma",
    "Prototyping",
    "UX Research",
    "Design Systems",
    "Framer",
    "Adobe Creative Suite",
    "Canva",
    "WIX",
  ],
  "Growth & Marketing": [
    "GTM Strategy",
    "Paid Social",
    "Short-form Content",
    "Campaign Planning",
    "SEO / SEM",
    "Community Growth",
    "Copywriting",
  ],
  "Tools & Tech": [
    "Jira",
    "Notion",
    "Google Suite",
    "Power BI",
    "Python",
    "R",
    "Stata",
    "Confluence",
    "Smartsheet",
    "Figma",
  ],
};

// ─────────────────────────────────────────────
//  ABOUT
// ─────────────────────────────────────────────
export const about = {
  pullQuote:
    "The best products don't just solve problems - they make you feel something.",
  bio: [
    "Hey, I'm Val - a UCSD undergraduate studying Business Economics. I found Product Management at the exact intersection of everything I love: people, art, and building.",
    "Growing up, my parents' philosophy was 'try everything.' Piano, watercolor, Taekwondo - I did it all. That same curiosity carried into college, where business and design both felt like natural extensions of who I am. Product Management was the answer that let me pursue both without choosing.",
    "My goal is to bridge creativity and strategy - bringing ideas to life while keeping the user at the center of every decision. I care about building things that are not just functional, but genuinely meaningful.",
  ],
  principles: [
    {
      label: "Start with the human",
      description: "Every product decision I make traces back to a real user insight. Not an assumption - an insight.",
    },
    {
      label: "Clarity over cleverness",
      description: "The best work is usually the simplest. I write, prototype, and present with as much precision as I can.",
    },
    {
      label: "Try everything once",
      description: "My best ideas have come from unexpected places - piano, Taekwondo, a random walk. I stay curious.",
    },
    {
      label: "Ship, learn, repeat",
      description: "Momentum beats perfection. I bias toward getting things into the world and improving from there.",
    },
  ],
  interests: ["Wong Kar Wai films", "Vietnamese egg coffee", "LEGOs", "Spotify playlists", "Pokémon", "Bucket lists"],
  lookingFor:
    "PM, APM, or growth/strategy roles at product-driven companies - ideally somewhere that values both analytical rigor and design taste. Open to full-time and internship opportunities.",
};

// ─────────────────────────────────────────────
//  MARQUEE STRIP
// ─────────────────────────────────────────────
export const marqueeItems = [
  "Product Strategy",
  "UX Research",
  "Brand & Identity",
  "Growth & GTM",
  "Prototyping",
  "Short-form Media",
  "Data Analytics",
  "Campaign Planning",
  "0→1 Builds",
  "User Interviews",
  "Design Systems",
  "Storytelling",
];
