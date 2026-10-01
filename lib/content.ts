export type Step = { title: string; text: string };
export type Faq = { q: string; a: string };
export type Plan = {
  name: string;
  price?: string;
  unit?: string;
  desc: string;
  features: string[];
  cta: string;
  main?: boolean;
  href?: string;
};
export type ServiceId = "support" | "dev" | "spec";
export type ServicePageData = {
  id: ServiceId;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  crumb: string;
  icon: string;
  h1a: string;
  h1b: string;
  sub: string;
  cta: string;
  highlights: string[];
  offersEyebrow: string;
  offersTitle: string;
  offers: { icon: string; title: string; text: string }[];
  steps: Step[];
  plansTitle: string;
  plansSub: string;
  plans: Plan[];
  faq: Faq[];
  band: string;
};

// Replace [PRICE] with your real prices.
export const SUPPORT_PLANS: Plan[] = [
  {
    name: "Hourly",
    price: "$32",
    unit: "/ hour",
    desc: "Pay only for the time spent. Perfect for occasional issues.",
    features: ["Billed after each remote session", "No commitment", "Response within 48 business hours"],
    cta: "Book hours",
    href: "/?service=support&plan=Hourly#request",
  },
  {
    name: "Monthly",
    price: "$90",
    unit: "/ month",
    desc: "A set number of support hours every month with your own technician.",
    features: ["Dedicated technician", "Monthly video review", "Response within 24 business hours"],
    cta: "Choose Monthly",
    main: true,
    href: "/?service=support&plan=Monthly#request",
  },
  {
    name: "Premium",
    price: "Custom",
    unit: "contract",
    desc: "A fully tailored contract adapted to your business needs and scale.",
    features: ["Unlimited remote support, 24/7", "Priority technician", "Response within 1 hour"],
    cta: "Contact us",
    href: "/contact",
  },
];

export const HOME_STEPS: Step[] = [
  { title: "Describe your need", text: "A 3-step form, no account needed upfront." },
  { title: "Compare proposals", text: "Price, timeline and reviews, side by side." },
  { title: "Pay securely", text: "Funds are held in escrow while the work is done." },
  { title: "Approve the result", text: "The expert is paid only once you're satisfied." },
];

export const HOME_FAQ: Faq[] = [
  { q: "How does a remote intervention work?", a: "The technician calls you by video, then takes control of your computer with your permission through a secure tool. You see everything they do and can stop at any time." },
  { q: "When is the expert paid?", a: "Your payment is held on the platform and released only after you approve the intervention or each project milestone." },
  { q: "Which languages and time zones do you cover?", a: "Experts work in English, French and Arabic, and you are matched with someone available in your time zone." },
  { q: "Is my data protected?", a: "Communications are encrypted, experts sign a confidentiality agreement and the platform complies with GDPR." },
];

export const SERVICE_OPTIONS: { id: ServiceId; label: string; hint: string; categories: string[] }[] = [
  {
    id: "support",
    label: "IT Support",
    hint: "Breakdowns, assistance, maintenance",
    categories: ["Computers and software", "Microsoft 365 / Google Workspace", "Network and VPN", "Backup and recovery", "Other"],
  },
  {
    id: "dev",
    label: "Custom Development",
    hint: "Website, app, business tool",
    categories: ["Website", "Mobile app", "ERP / CRM / business tool", "Automation and APIs", "Maintenance of an existing app"],
  },
  {
    id: "spec",
    label: "Specialized Service",
    hint: "Security, cloud, consulting",
    categories: ["Cybersecurity and audit", "Cloud and migration", "IP telephony", "Digital transformation", "Training"],
  },
];

export const URGENCY = ["Urgent", "This week", "Flexible"] as const;
export const PLAN_OPTIONS = ["Hourly", "Monthly", "Premium", "Fixed-price project"] as const;
export const LANGUAGES = ["English", "Français", "العربية"] as const;
export const TIMEZONES = ["UTC−5 (New York, Toronto)", "UTC+0 (London)", "UTC+1 (Paris, Tunis)", "UTC+4 (Dubai)", "Other"] as const;

export const SERVICE_PAGES: Record<string, ServicePageData> = {
  "it-support": {
    id: "support",
    slug: "it-support",
    metaTitle: "Remote IT Support",
    metaDescription: "Vetted IT technicians fix your computers, Microsoft 365, network and backups remotely. Pay by the hour, monthly or Premium.",
    crumb: "IT SUPPORT",
    icon: "headset",
    h1a: "Remote IT support that",
    h1b: "fixes it fast.",
    sub: "Vetted technicians connect to your systems in minutes, by video call and secure remote access, in your language and time zone.",
    cta: "Open a support ticket",
    highlights: ["A technician on your issue in minutes", "Video call and secure screen sharing", "Pay by the hour, monthly or Premium", "Payment released only when it's solved"],
    offersEyebrow: "WHAT WE HANDLE",
    offersTitle: "Every everyday IT problem, solved remotely.",
    offers: [
      { icon: "monitor", title: "Workstations and software", text: "Slow PCs, crashes, installs and updates on Windows and macOS." },
      { icon: "mail", title: "Microsoft 365 and Google Workspace", text: "Accounts, mailboxes, licenses, Teams and shared drives." },
      { icon: "wifi", title: "Network and VPN", text: "Remote configuration of routers, Wi-Fi, firewalls and VPN access." },
      { icon: "database", title: "Backup and recovery", text: "Backup setup, monitoring and file recovery." },
      { icon: "printer", title: "Printers and peripherals", text: "Drivers, network printers and scanners, set up remotely." },
      { icon: "user", title: "Employee onboarding", text: "Accounts, devices and access ready on a new hire's first day." },
    ],
    steps: [
      { title: "Open a ticket", text: "Describe the issue and its urgency in under 2 minutes." },
      { title: "Get matched", text: "An available technician who speaks your language takes the ticket." },
      { title: "Fix it live", text: "Video call and secure screen sharing, with your permission." },
      { title: "Approve and pay", text: "Payment is released only when you confirm it's solved." },
    ],
    plansTitle: "Support plans that fit.",
    plansSub: "Pay by the hour, subscribe monthly, or go Premium for unlimited support.",
    plans: SUPPORT_PLANS,
    faq: [
      { q: "What do I need for a remote session?", a: "Just an internet connection. The technician sends a secure link; you approve access and can end it at any time." },
      { q: "Can you fix hardware problems?", a: "We diagnose remotely and guide you or your supplier step by step; nobody is sent on site." },
      { q: "Can I switch plans later?", a: "Yes. You can move between Hourly, Monthly and Premium at any time." },
    ],
    band: "Something not working right now?",
  },
  development: {
    id: "dev",
    slug: "development",
    metaTitle: "Custom Software Development",
    metaDescription: "Websites, mobile apps, ERP, CRM and automation built by vetted developers. Compare quotes and pay by milestone.",
    crumb: "DEVELOPMENT",
    icon: "code",
    h1a: "Software built around",
    h1b: "how you work.",
    sub: "Share your requirements, compare quotes from vetted developers and agencies, and follow your project milestone by milestone.",
    cta: "Get development quotes",
    highlights: ["Quotes from vetted developers within 24 hours", "Milestones funded in escrow", "Full source code and IP are yours", "Optional maintenance after launch"],
    offersEyebrow: "WHAT WE BUILD",
    offersTitle: "From a landing page to a full platform.",
    offers: [
      { icon: "globe", title: "Websites", text: "Company sites, landing pages and online stores, fast and SEO-ready." },
      { icon: "phone", title: "Mobile apps", text: "iOS and Android apps from a single codebase." },
      { icon: "layers", title: "ERP, CRM and business tools", text: "Quotes, invoicing, stock and planning tools fitted to your process." },
      { icon: "zap", title: "Automation", text: "Scripts and workflows that remove repetitive manual work." },
      { icon: "plug", title: "API integrations", text: "Connect your tools: payments, accounting, CRM, logistics." },
      { icon: "wrench", title: "Maintenance and upgrades", text: "Take over, fix and extend an existing application." },
    ],
    steps: [
      { title: "Describe your project", text: "Upload a specification or simply explain your goal." },
      { title: "Compare quotes", text: "Price, timeline, portfolio and reviews side by side." },
      { title: "Build by milestones", text: "Each milestone is funded in escrow and delivered for your review." },
      { title: "Launch", text: "Source code, documentation and an optional maintenance plan." },
    ],
    plansTitle: "Two ways to build.",
    plansSub: "A fixed-price project with milestones, or a developer dedicated to your team.",
    plans: [
      { name: "Fixed-price project", desc: "A clear quote split into milestones; each one is paid only after you approve it.", features: ["Scope and price agreed upfront", "Milestones held in escrow", "Code and IP transferred at the end"], cta: "Request a quote", href: "/?service=dev&plan=Fixed-price%20project#request" },
      { name: "Dedicated developer", price: "[PRICE]", unit: "/ month", desc: "A developer working with your team month by month on ongoing needs.", features: ["Full-time or part-time", "Weekly progress reviews", "Cancel any month"], cta: "Find a developer", main: true, href: "/?service=dev&plan=Monthly#request" },
    ],
    faq: [
      { q: "Who owns the source code?", a: "You do. The full code and intellectual property are transferred when the final milestone is approved." },
      { q: "What if I don't have a specification?", a: "Describe your need in plain words; the developer can include a scoping phase in the quote." },
      { q: "Which technologies do your developers use?", a: "Modern stacks such as React, Next.js, Node.js, Flutter and Python; you choose or let the developer recommend." },
    ],
    band: "Have a project in mind?",
  },
  "specialized-services": {
    id: "spec",
    slug: "specialized-services",
    metaTitle: "Specialized IT Services",
    metaDescription: "Cybersecurity audits, cloud migration, IP telephony and digital transformation by certified remote experts.",
    crumb: "SPECIALIZED SERVICES",
    icon: "shield",
    h1a: "Expert help for",
    h1b: "critical IT projects.",
    sub: "Security, cloud and digital transformation specialists, available remotely for an audit, a project or ongoing advice.",
    cta: "Talk to an expert",
    highlights: ["Certified specialists, verified credentials", "Fixed-price audits with a written report", "Confidentiality agreement on every job", "Workshops by video, worldwide"],
    offersEyebrow: "EXPERTISE",
    offersTitle: "Specialists for the work your team can't do alone.",
    offers: [
      { icon: "shield", title: "Cybersecurity and audit", text: "Vulnerability assessment, hardening and a clear action plan." },
      { icon: "cloud", title: "Cloud and migration", text: "Move servers, email and files to AWS, Azure or Google Cloud." },
      { icon: "phone", title: "IP telephony", text: "Cloud phone systems configured and connected to your tools." },
      { icon: "camera", title: "Video surveillance setup", text: "Remote configuration of cameras, recorders and secure viewing access." },
      { icon: "map", title: "Digital transformation", text: "Process mapping and a roadmap to digitize your operations." },
      { icon: "book", title: "Training", text: "Live online sessions for your team on tools and security." },
    ],
    steps: [
      { title: "Brief the expert", text: "Explain your context and goals, and share documents securely." },
      { title: "Receive a proposal", text: "Scope, deliverables, timeline and a fixed price." },
      { title: "Work together remotely", text: "Video workshops, remote access when needed, regular updates." },
      { title: "Get your deliverables", text: "Report, configuration and handover, approved before payment." },
    ],
    plansTitle: "Engage an expert your way.",
    plansSub: "A fixed-price audit to start, or a full project and monthly advisory.",
    plans: [
      { name: "Audit or assessment", desc: "A fixed-price review with a written report and clear priorities.", features: ["Fixed price agreed upfront", "Written report and action plan", "Debrief call with the expert"], cta: "Request an audit", href: "/?service=spec&plan=Fixed-price%20project#request" },
      { name: "Project or retainer", price: "[PRICE]", unit: "/ month", desc: "A full project by milestones, or monthly expert hours.", features: ["Dedicated specialist", "Milestones held in escrow", "Monthly advisory hours"], cta: "Talk to an expert", main: true, href: "/?service=spec&plan=Monthly#request" },
    ],
    faq: [
      { q: "Are your experts certified?", a: "Each expert's certifications are verified and shown on their profile." },
      { q: "Is my data safe during an audit?", a: "Experts sign a confidentiality agreement, and access is granted only for the duration of the work." },
      { q: "Can you work with our internal IT team?", a: "Yes. Experts can work alongside your team, transfer knowledge and document everything they do." },
    ],
    band: "Need an expert opinion?",
  },
};
