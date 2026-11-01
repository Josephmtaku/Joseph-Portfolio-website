window.SITE = {

  /* ---------- About and contact ---------- */
  profile: {
    name: 'Joseph Mtaku',
    role: 'Software Engineer',
    photo: 'assets/IMG_9568.JPG',
    status: 'Open to roles, collaborations, and interesting projects',
    bio: 'I am an enthusiastic and adaptable Software Engineer with experience in object-oriented programming. I am a quick learner and team player who brings strong communication skills and a creative approach to problem-solving. I am eager to contribute to a progressive organization and deliver value through innovation and collaboration.',
    focus: 'Full-stack development, systems programming and Salesforce',
    buildsWith: 'React Native, Node.js, Express, Supabase, MySQL',
    email: 'j.mtaku@icloud.com',
    phone: '07404 879 754',
    phoneLink: '+447404879754',
    github: 'https://github.com/Josephmtaku',
    githubLabel: 'github.com/Josephmtaku'
  },

  /* ---------- Projects ---------- */
  projectsIntro: 'A selection of projects spanning full-stack development, systems programming and Salesforce administration, each built to solve a real problem end to end.',

  /* tags decide which filter buttons a project appears under:
     mobile, fullstack, web, backend, salesforce
     A project with a "video" gets a large featured card with its demo. */
  projects: [
    {
      id: 'floodbuddy',
      name: 'FloodBuddy',
      title: 'FloodBuddy - Real-Time Flood Data',
      desc: 'Developed an application to provide real-time flood data and enhance disaster response. Surfaces live alerts and map overlays to help communities prepare and respond faster.',
      tags: ['mobile'],
      badges: ['React Native', 'REST APIs', 'Maps', 'Node.js'],
      role: 'Front-end',
      status: 'Completed',
      thumb: 'assets/floodbuddy-poster.jpg',
      video: { file: 'assets/floodbuddy-demo.mp4', poster: 'assets/floodbuddy-poster.jpg', tagline: 'React Native flood alerts app' },
      links: [
        { label: 'GitHub (App)', href: 'https://github.com/Josephmtaku/FloodBuddy-App.git' },
        { label: 'GitHub (Admin Portal)', href: 'https://github.com/Josephmtaku/FloodBuddy-Portal-website-main.git' }
      ]
    },
    {
      id: 'grabit',
      name: 'GrabIT',
      title: 'GrabIT - Checkout-Free Shopping',
      desc: 'Mobile app that lets customers scan products, pay securely, and receive a QR receipt for verification at exit. Includes admin dashboard for stock & analytics.',
      tags: ['mobile', 'fullstack'],
      badges: ['React Native', 'Node.js', 'Express', 'Supabase (Postgres)'],
      role: 'Full-stack dev',
      status: 'Completed',
      thumb: 'assets/grabit-poster.jpg',
      video: { file: 'assets/grabit-demo.mp4', poster: 'assets/grabit-poster.jpg', tagline: 'Checkout-free shopping app' },
      links: [
        { label: 'GitHub', href: 'https://github.com/Josephmtaku/Honours_Stage_Project_No_Checkout_Shop_Joseph_Mtaku.git' }
      ]
    },
    {
      id: 'church',
      name: 'Church Management System',
      title: 'Church Management System',
      desc: 'Multi-page web app for leaders/admins to manage members, attendance, lost-sheep tracking, and weekly reports with role-based access.',
      tags: ['fullstack', 'web'],
      badges: ['HTML', 'CSS', 'JavaScript', 'Supabase'],
      role: 'Front-end & DB',
      status: 'Live',
      thumb: 'assets/psci-thumb.png',
      thumbSmall: 'assets/psci-thumb.jpg',
      links: [
        { label: 'Live Site', href: 'https://josephmtaku.github.io/PSCI-church-Management-System/', primary: true },
        { label: 'GitHub', href: 'https://github.com/Josephmtaku/PSCI-church-Management-System.git' }
      ]
    },
    {
      id: 'whois',
      name: 'whois',
      title: 'whois - Networked Database Tool',
      desc: 'C# client–server application exposing a MySQL-backed user accounts database over the network. Includes a static client and a TCP server that handles lookups, updates, and inserts, with simple URL-style queries',
      tags: ['backend'],
      badges: ['C#', 'MySQL', 'TCP Server', 'Client App', 'Multithreading'],
      role: 'Full-stack (DB + Server + Client)',
      status: 'Completed',
      thumb: 'assets/whois-thumb.png',
      links: [
        { label: 'GitHub', href: 'https://github.com/Josephmtaku/whois.git' }
      ]
    },
    {
      id: 'transport',
      name: 'Transport Network Route-Finder',
      title: 'Transport Network Route-Finder',
      desc: 'C++ implementation of data structures and algorithms for a transport network (nodes & arcs) with precise input/output formats. Supports distance queries, neighbour discovery, and journey validation; includes performance diagnostics (visited node/arc counts) and fast route-finding using Dijkstra/A*.',
      tags: ['backend'],
      badges: ['C++'],
      role: 'Systems & Algorithms',
      status: 'Completed',
      thumb: 'assets/transport-net-thumb.png',
      links: [
        { label: 'GitHub', href: 'https://github.com/500083-Advanced-Programming-2324/lab-i-final-lab-Josephmtaku.git' }
      ]
    },
    {
      id: 'smartqueue',
      name: 'Smart Queue Prioritisation',
      title: 'Smart Queue Prioritisation - Salesforce Omni‑Channel',
      desc: 'Implemented an intelligent routing system for Salesforce Service Cloud. By separating Live Chat and WhatsApp requests into distinct Omni‑Channel queues and assigning different routing priorities, I eliminated missed chats and improved response times. The solution uses Apex, custom queues and presence statuses all built in an org.',
      tags: ['backend', 'web', 'salesforce'],
      badges: ['Salesforce', 'Apex', 'Service Cloud', 'Omni‑Channel'],
      role: 'Developer',
      status: 'Completed',
      thumb: 'assets/smartqueue-thumb.PNG',
      links: [
        { label: 'Case Study', href: 'https://docs.google.com/document/d/1qB0E5MQZLDS8s83pcL0P8GY7R6nPbl87PqE7O4NcEtc/edit?usp=sharing', primary: true }
      ]
    },
    {
      id: 'billing',
      name: 'Telecom Billing System',
      title: 'Telecom Billing System (Salesforce)',
      desc: 'Salesforce app built by a 12-person team to replace manual Excel billing for 3,000+ telecom customers. Plans, customers, bills and usage records are modelled as linked custom objects, with roll-up and formula fields that calculate each bill automatically from usage and plan allowances. Includes validation rules, a unique-email constraint, role-based security, plan change tracking and a branded Lightning app.',
      tags: ['backend', 'web', 'salesforce'],
      badges: ['Salesforce', 'Apex', 'Formula Fields', 'Validation Rules', 'Data Loader', 'Lightning App'],
      role: 'Administrator & Tester',
      status: 'Completed',
      thumb: 'assets/Telecom%20Billing%20System%20Showcase.png',
      links: []
    },
    {
      id: 'ivelora',
      name: 'Velora',
      title: 'Velora (AI Bible Presentation System)',
      desc: 'An AI presentation system that listens to a live speaker and displays the correct Bible passage the moment it is mentioned, even when the speaker paraphrases it. Transforms messy, error-prone speech into accurate on-screen scripture within seconds using speech recognition, a custom detection pipeline, an AI model, and a full-text Bible index.',
      tags: ['backend', 'web', 'ai'],
      role: 'Software Engineer & AI Developer',
      status: 'In Development',
      badges: ['Vanilla JavaScript','Node.js','Speech Recognition','AI','Full-Text Bible Index'],
      thumb: 'assets/Velora%20Showcase.png',
      links: []
    }

  ],

  /* ---------- Skills ----------
     Groups appear in this order. "items" show as chips (with a logo if icon is set).
     "notes" show as a plain list. mono:true marks a dark logo that needs
     lightening on the dark Mac theme. */
  skills: [
    { key: 'languages', title: 'Core Languages', sub: 'I am proficient in the use of the following languages', items: [
      { name: 'C#', icon: 'csharp' }, { name: 'C++', icon: 'cpp' }, { name: 'JavaScript', icon: 'javascript' }, { name: 'HTML', icon: 'html5' }
    ] },
    { key: 'frameworks', title: 'Frameworks & Libraries', sub: 'I use the following tools to build UIs and clients.', items: [
      { name: 'React Native', icon: 'react' }, { name: 'Node.js', icon: 'nodejs' }, { name: 'Express', icon: 'express', mono: true }
    ] },
    { key: 'databases', title: 'Databases', sub: 'Schema design and queries', items: [
      { name: 'MySQL', icon: 'mysql', mono: true }, { name: 'PostgreSQL', icon: 'postgresql' }, { name: 'Supabase', icon: 'supabase' }
    ], notes: [
      'Designing normalized schemas & indexes', 'Building RESTful data access layers', 'Auth & row-level security (JWT / policies)'
    ] },
    { key: 'backend', title: 'Back-End & Systems', notes: [
      'C# API development (ASP.NET Core)', 'Client–server communication (sockets / HTTP)'
    ] },
    { key: 'salesforce', title: 'Salesforce', sub: 'Built through my Salesforce projects', items: [
      { name: 'Apex', icon: 'salesforce' }, { name: 'Omni-Channel' }, { name: 'Lightning apps' }, { name: 'Validation rules' }, { name: 'Formula fields' }, { name: 'Data Loader' }
    ] },
    { key: 'professional', title: 'Professional Skills', notes: [
      'Communication', 'Presentation', 'Problem-solving', 'Critical thinking', 'Organisation', 'Time management', 'Collaboration', 'Teamwork'
    ] },
    { key: 'pm', title: 'Project Management', notes: [
      'Agile & Waterfall methodologies', 'Backlog, sprints, and demos', 'Version control with Git/GitHub'
    ] },
    { key: 'tooling', title: 'Tooling', items: [
      { name: 'Git / GitHub', icon: 'git' }, { name: 'Postman', icon: 'postman' }, { name: 'VS Code', icon: 'vscode' }, { name: 'Figma', icon: 'figma' }, { name: 'XML', icon: 'xml' }
    ] }
  ]
};
