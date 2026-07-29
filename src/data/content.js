// ─── Personal Details ───
export const personal = {
  name: 'Sai Akilesh Venigalla',
  location: 'New York, NY',
  email: 'clueless101.exe@gmail.com',
  phone: '+1 347 477 8764',
  linkedin: 'https://www.linkedin.com/in/sai-akilesh/',
  github: 'https://github.com/Clue0110',
  website: 'https://clueless.nyc',
  tagline: {
    recruiter: 'Software Engineer @ Tesla · NYU CS \n Building Scalable Distributed Systems',
    dev: 'building stuff at tesla // broke things at citrix for 3 years // nyu cs',
  },
  bio: {
    recruiter:
      'Software Engineer with 4+ years of experience building high-throughput distributed systems, real-time data pipelines, and security platforms. Currently at Tesla engineering Robotaxi payments and fleet infrastructure. Passionate about performance optimization, system design, and AI.',
    dev:
      "hey, i'm akilesh — i write code that moves cars, secures the web, and occasionally trades stocks. i've gone from debugging a 25-year-old C codebase at citrix to building kafka pipelines for robotaxis at tesla. when i'm not shipping features, i'm probably building an AI that turns your notes into a course or scraping the internet for sentiment to predict stonks. NYU CS grad, former astronomy club president and yes, i organized stargazing for 500 people.",
  },
}

// ─── Education ───
export const education = [
  {
    school: 'New York University',
    degree: 'M.S. Computer Science',
    period: '2024 – 2026',
    location: 'New York, NY',
    gpa: '3.9 / 4.0',
    honors: [],
    courses: ['Algorithm Design', 'Networking', 'Database Systems', 'Big Data', 'Machine Learning', 'AI', 'HCI'],
    highlight: {
      recruiter: 'Teaching Assistant for Core Algorithms & Data Structures at NYU Courant, supporting 250+ students.',
      dev: 'TA for the algorithms class — grading 250 students\' code and trying not to cry at their merge sort implementations.',
    },
  },
  {
    school: 'Manipal Institute of Technology',
    degree: 'B.S. Computer Science',
    period: '2017 – 2021',
    location: 'Manipal, India',
    gpa: '3.95 / 4.0',
    honors: ["Dean's List", 'Summa Cum Laude'],
    courses: ['Data Structures', 'Algorithms', 'OS', 'Distributed Systems', 'Cloud Computing', 'ML', 'Compiler Design', 'Computer Networks'],
    highlight: {
      recruiter: 'Academic Excellence Award · Best Project Award (Samsung Prism 2021) · Led Astronomy Club (500+ event attendees) · ACM Core Committee',
      dev: 'ran the astronomy club, organized stargazing for 500 people, led a lake cleanup crew, and somehow still got summa cum laude. also won best project at samsung prism which was pretty sick.',
    },
  },
]

// ─── Work Experience ───
export const experience = [
  {
    company: 'Tesla',
    role: 'Software Engineer Intern',
    period: 'Jan 2026 – Present',
    location: 'Fremont, CA',
    color: '#e31937',
    bullets: {
      recruiter: [
        'Accelerated Robotaxi payment processing by 85% by architecting a scalable Apache Kafka pipeline with a Go-based Dead Letter Queue for asynchronous, fault-tolerant event processing and automated retries.',
        'Reduced ride-data retrieval latency by 90%, enabling sub-second queries across millions of ride records, by engineering a high-throughput real-time MySQL-to-Elasticsearch sync pipeline.',
        'Delivered live Supercharger wait-time forecasts to millions of EV drivers, achieving 100% real-time forecast visibility on Google Maps, by building a gRPC + OCPI integration.',
        'Scaled referral device fingerprinting to 3.5M+ DAU with fraud-resistant processing by building a Redis-backed idempotency layer and a secure Apple Pay pre-authorization engine.',
        'Optimized surge pricing across a 400+ vehicle Robotaxi fleet, computing real-time rate adjustments from location, congestion, and demand patterns, by leveraging H3 geospatial indexing.',
      ],
      dev: [
        'built a kafka pipeline + go DLQ that made robotaxi payments 85% faster — turns out async event processing hits different when you\'re charging people for robot car rides.',
        'wrote a mysql → elasticsearch sync that cut ride data lookups by 90%. searching through millions of rides? now it\'s basically instant.',
        'hooked up supercharger wait times to google maps via gRPC + OCPI — every EV driver can now see live forecasts. you\'re welcome.',
        'scaled device fingerprinting to 3.5M daily users with redis + apple pay pre-auth. catching referral fraud at tesla scale is... a ride.',
        'used H3 geo-indexing for surge pricing across 400+ robotaxis. basically, the price of your ride changes in real-time based on where every car is. pretty wild system.',
      ],
    },
  },
  {
    company: 'NYU IT – High Speed Research Network',
    role: 'Software Engineer',
    period: 'Jan 2025 – Present',
    location: 'New York, NY',
    color: '#57068c',
    bullets: {
      recruiter: [
        'Eliminated costly ISC licensing fees by architecting an IPv4 host reservation system with FastAPI + MySQL, designing RESTful CRUD APIs and database models for Kea DHCP lease management.',
        'Reduced infrastructure resource consumption by 50% by containerizing Kea DHCP, PostgreSQL, and FastAPI services with Docker and orchestrating inter-service communication via Docker Networks.',
      ],
      dev: [
        'NYU needed a way to manage IP reservations without paying ISC a fortune — so i built a FastAPI + MySQL backend from scratch. REST APIs, CRUD, the whole thing.',
        'dockerized the entire stack (Kea DHCP, postgres, fastapi) and used docker networks for service-to-service comms. cut resource usage in half and deployments are now one command.',
      ],
    },
  },
  {
    company: 'Citrix (Cloud Software Group)',
    role: 'Software Engineer 2',
    period: 'Sep 2023 – Aug 2024',
    location: 'Bangalore, India',
    color: '#00a1e0',
    bullets: {
      recruiter: [
        'Drove a 60% increase in AppSec license sales by developing the Citrix WAF Security Recommendation Engine — a Python + C++ microservice identifying critical web-app vulnerabilities with real-time analytics.',
        'Streamlined vulnerability scanning across 10,000+ URLs in cloud (Kubernetes/Docker) and on-premises (FreeBSD kernel) deployments by implementing technology scanning that tailors attack payloads per stack.',
        'Reduced Unified Security API response time by 95% (4 min → <10 s) by rewriting core processing in C++, implementing Redis caching, and eliminating redundant database queries.',
        'Cut PostgreSQL query time by 50% and boosted DB efficiency by 20% by diagnosing bottlenecks via Splunk log analysis, creating strategic indexes, and refactoring SQL queries.',
        'Saved 20+ developer-hours per update cycle and reduced CPU usage by 30% by automating WAF signature categorization with Google Gemini and CVE data through LLM-powered prompt engineering.',
        'Reduced API security setup effort by 60% by designing a centralized API management system using specification files as the single source of truth for policy enforcement across REST and gRPC.',
      ],
      dev: [
        'built a WAF recommendation engine in python + C++ that scans web apps for vulnerabilities. it was so good it bumped security license sales by 60%.',
        'deployed the engine on k8s AND on-prem freeBSD — because some customers love their bare metal. it scans 10k+ URLs and tailors attack payloads per tech stack.',
        'inherited APIs that took 4 MINUTES to respond. rewrote the core in C++, slapped a redis cache on it, and got it to < 10 seconds. 95% improvement.',
        'played detective with splunk logs, found the slow postgres queries, added indexes, rewrote the SQL. 50% faster queries, 20% DB efficiency boost.',
        'used gemini to auto-categorize WAF signatures from CVE data. saved the threat research team 20+ hours per cycle and cut CPU 30%. prompt engineering ftw.',
        'built a centralized API gateway that reads spec files and auto-enforces auth across REST + gRPC. developers stopped having to think about security — which, honestly, is ideal.',
      ],
    },
  },
  {
    company: 'Citrix (Cloud Software Group)',
    role: 'Software Engineer 1',
    period: 'Jul 2021 – Sep 2023',
    location: 'Bangalore, India',
    color: '#00a1e0',
    bullets: {
      recruiter: [
        'Reduced the WAF cloud-migration SDLC from 16 hours to under 2 (88% reduction) by engineering a Jenkins CI/CD pipeline (Java/Groovy + Ansible) with Prometheus + Grafana observability dashboards.',
        'Increased build throughput 30x (1/week → 6/day) by designing a dynamic build-scheduling module that parallelizes workloads through dependency-graph analysis.',
        'Eliminated 100% of false negatives across all NetScaler feature teams by building a globally-adopted Java test-selection module that dynamically analyzes codebases to run only relevant tests.',
        'Achieved zero-downtime failover and 75% faster DR provisioning by architecting multi-cloud disaster recovery (AWS/Azure/GCP) with Terraform + Ansible, automating VM snapshotting and heartbeat monitoring.',
        'Closed a critical unauthenticated data-channel vulnerability by implementing a proxy authentication module in C for the NetScaler kernel, securing WAF signature downloads from S3.',
        'Cut signature-update processing time by 84% by automating the pipeline (Python/C/Shell) with hashing-based change detection, auto-triggered S3 PRs, and auto-generated release notes.',
      ],
      dev: [
        'the WAF cloud migration had a 16-hour SDLC. i built a jenkins pipeline with ansible playbooks + prometheus/grafana dashboards and got it down to 2 hours. *88% go brr*.',
        'builds were running once a week. i analyzed the dependency graph, parallelized everything, and suddenly we were doing 6 builds a day. 30x improvement.',
        'wrote a java module that figures out which tests actually matter for your code change and only runs those. adopted company-wide. false negatives: zero.',
        'built DR automation across AWS/azure/GCP with terraform + ansible. VMs self-heal with heartbeat monitoring. 75% faster to spin up disaster recovery.',
        'found out netscaler was downloading WAF signatures from S3 *without auth*. wrote a proxy auth module in C — gdb was my best friend for weeks.',
        'signature updates were manual and painful. built a pipeline that hashes for diffs, auto-creates S3 PRs, and generates release notes. 84% faster.',
      ],
    },
  },
  {
    company: 'Citrix (Cloud Software Group)',
    role: 'Software Engineering Intern',
    period: 'Jan 2021 – Jun 2021',
    location: 'Bangalore, India',
    color: '#00a1e0',
    bullets: {
      recruiter: [
        'Reduced NetScaler sub-feature validation from 24 hours to 1 (96% reduction), boosting developer productivity by 25%, by building a Flask-based rapid testing tool.',
        'Strengthened WAF regression testing with 1,000+ randomized HTTP attack payloads per CI/CD commit by developing a self-learning payload-generation tool in Python.',
        'Unmasked spoofed bots bypassing WAF defenses by pioneering a browser-fingerprinting bot-detection prototype in JavaScript combining duck typing and user-agent analysis.',
        'Resolved high-priority, customer-impacting production WAF escalations by debugging a 25-year-old legacy C codebase.',
      ],
      dev: [
        'testing a kernel change took 24 hours. built a flask app that lets devs test their specific feature in isolation — got it down to 1 hour. productivity jumped 25%.',
        'wrote a self-learning payload generator in python that evolves its attack patterns over time. it fires 1000+ unique payloads at every CI commit. WAF never stood a chance.',
        'built a JS prototype that catches bots pretending to be browsers using duck typing + UA fingerprinting. if your "chrome" doesn\'t quack like chrome, you\'re blocked.',
        'spent my internship debugging a 25-year-old C codebase for production escalations. if that doesn\'t build character, nothing will.',
      ],
    },
  },
  {
    company: 'Samsung R&D',
    role: 'Research Intern — 4K Panoramic Movie Recording',
    period: 'May 2021 – Nov 2021',
    location: 'Bangalore, India',
    color: '#1428a0',
    bullets: {
      recruiter: [
        'Achieved sub-100ms per-frame processing for panoramic 4K movie recording across multiple phones by engineering synchronized dual-camera capture with real-time stitching in Python + OpenCV.',
        'Eliminated visible seams while preserving 99% of source resolution, cutting user-reported visual artifacts by 30%, by implementing histogram matching and multi-band blending.',
        'Enabled live pipeline debugging by building a multi-threaded Tkinter diagnostic GUI visualizing individual camera feeds alongside the stitched panoramic output in real time.',
      ],
      dev: [
        'recorded a panoramic 4K movie using multiple phones. synchronized capture, stitched feeds in real-time (<100ms per frame) with SIFT, RANSAC, and multi-threading.',
        'the seam between cameras was ugly — fixed it with histogram matching + multi-band blending. 99% resolution preserved, 30% fewer user complaints.',
        'built a tkinter gui that shows both camera feeds + the stitched output side by side in real-time. threading was key — can\'t block the UI thread.',
      ],
    },
  },
  {
    company: 'Samsung R&D',
    role: 'Research Intern — Neural Inpainting',
    period: 'Oct 2020 – Mar 2021',
    location: 'Bangalore, India',
    color: '#1428a0',
    bullets: {
      recruiter: [
        'Delivered robust background reconstruction for an AI object-eraser by developing a custom GAN-based neural inpainting model trained on 350,000+ indoor images.',
        'Accelerated R&D timelines, earning direct recognition from Samsung leadership, by building an automated Python scraper that harvested a diverse 350K-image dataset from Google Image Search.',
        'Improved real-world inpainting reliability under harsh lighting by training a dedicated flash-artifact-removal GAN.',
      ],
      dev: [
        'trained a GAN to erase objects from photos and reconstruct the background — a simple AI eraser feature. fed it 350k images i scraped from google.',
        'built a python scraper to automate the dataset collection. samsung liked it so much they called it out specifically.',
        'phone flash artifacts were destroying the inpainting results. trained a separate GAN just to nuke the flash glare before reconstruction. clean results.',
      ],
    },
  },
  {
    company: 'Samsung R&D',
    role: 'Research Intern — Anomaly Detection',
    period: 'Jan 2020 – Aug 2020',
    location: 'Bangalore, India',
    color: '#1428a0',
    bullets: {
      recruiter: [
        'Enabled biometric gait-authentication research by capturing 100Hz accelerometer + gyroscope data from a diverse smartphone user cohort for pattern analysis.',
        'Correlated footstep signatures with unique per-user gait baselines for ML-based authentication by developing a custom peak-detection algorithm in Python.',
      ],
      dev: [
        'turns out everyone walks differently. i captured 100Hz accelerometer data from phone sensors and built a peak detection algo to fingerprint individual footsteps.',
        'computed unique gait baselines per person and used them to train models for walk-based authentication. your phone knows how you walk.',
      ],
    },
  },
  {
    company: 'Virtusa',
    role: 'Software Engineering Intern',
    period: 'May 2019 – Jul 2019',
    location: 'Hyderabad, India',
    color: '#e63312',
    bullets: {
      recruiter: [
        'Increased conversions and engagement by developing a dynamic e-commerce platform on Adobe Experience Manager with AJAX-based rendering that eliminated full-page refreshes.',
        'Grew email sign-ups by 35% over static forms by building a gamified spin-the-wheel promotion in JavaScript + TailwindCSS, later adopted as a reusable marketing component.',
      ],
      dev: [
        'built an e-commerce site on adobe experience manager with AJAX rendering — no more full page reloads. conversions went up noticeably.',
        'made a spin-the-wheel for marketing promos in vanilla JS + tailwind. 35% more email signups than boring popups. sometimes fun > functional.',
      ],
    },
  },
]

// ─── Projects ───
export const projects = [
  {
    title: 'WeaveAI',
    emoji: '🧠',
    link: 'https://github.com/Clue0110/WeaveAI',
    tags: ['React', 'FastAPI', 'MongoDB', 'ChromaDB', 'Redis', 'LangChain', 'Gemini', 'RAG', 'TTS'],
    description: {
      recruiter: 'AI-powered personalized learning platform — transforms unstructured content into structured courses with RAG-based AI tutor, auto-generated podcasts, and adaptive quizzes.',
      dev: 'upload your notes, youtube links, whatever — weaveAI turns them into an actual course with modules, an AI tutor that only knows your material, auto-generated podcasts, and quizzes. learning, but custom.',
    },
    bullets: {
      recruiter: [
        'Reduced LLM token consumption by engineering a RAG pipeline with a ChromaDB vector store that embeds entire course content for optimized AI-tutor context retrieval.',
        'Decreased AI chatbot response latency by 95% by integrating Redis-backed chat-history caching for real-time conversational tutoring.',
        'Scoped AI-tutor responses strictly to user-provided materials by building a multimodal (chat + voice) tutor with LangChain + Gemini and targeted prompt engineering.',
        'Increased user engagement by 40% by developing auto-podcast generation from course content with coquiTTS, ElevenLabs, and pydub.',
        'Improved measured learning efficiency by 30% by implementing auto-quiz generation (OpenAI + Gemini) with MongoDB progress tracking.',
      ],
      dev: [
        'RAG pipeline with chromaDB so the AI tutor only answers from YOUR materials. no hallucinating random facts.',
        'redis for chat history caching — bot replies went from sluggish to instant. 95% latency drop.',
        'the AI tutor works via chat or voice. prompt engineered it hard so it stays on-topic with your content.',
        'auto-generates podcasts from your notes using coquiTTS + elevenlabs. engagement went up 40% once people could just listen.',
        'auto-generates quizzes too. saves to mongo for tracking. learning efficiency bumped 30%.',
      ],
    },
  },
  {
    title: 'VibeTrader',
    emoji: '📈',
    link: 'https://github.com/Clue0110/VibeTrader',
    tags: ['React', 'Flask', 'Kafka', 'SparkNLP', 'LSTM', 'Redis', 'PostgreSQL', 'MongoDB', 'PySpark', 'Selenium'],
    description: {
      recruiter: 'AI-powered algorithmic trading platform — fuses real-time sentiment analysis from news, Twitter, and Reddit with LSTM predictions for automated buy/sell execution.',
      dev: 'scrapes news + reddit + twitter, runs sentiment through 3 different models (including one fine-tuned for gen-z reddit language), feeds everything into an LSTM → neural net pipeline, and auto-executes trades. fully automated stonk vibes.',
    },
    bullets: {
      recruiter: [
        'Enabled instant alerts on sentiment spikes by building a real-time streaming architecture with Apache Kafka + Zookeeper ingesting live stock data, social feeds, and news.',
        'Achieved superior sentiment accuracy by engineering a tri-model engine: SparkNLP ML model, rule-based analyzer, and an LLM fine-tuned for Reddit/Gen-Z language.',
        'Generated automated buy/sell signals by constructing a two-stage predictor — LSTM price forecast feeding a 2-layer neural network over predictions, sentiment, and 60h of historical data.',
        'Cut model loading time by 70% by combining PySpark + Dask distributed preprocessing, Redis caching of a real-time 60h sliding window, and MongoDB serialized-model storage.',
      ],
      dev: [
        'kafka + zookeeper for real-time streaming of stock data, reddit posts, and news articles. push alerts when sentiment spikes.',
        'three sentiment models: sparkNLP (scale), rule-based (baseline), and an LLM fine-tuned to understand reddit-speak. "hodl" and "to the moon" are valid signals.',
        'LSTM gives an initial price prediction → that + sentiment + last 60 hours of data feeds into a 2-layer neural net for the actual buy/sell decision.',
        'pyspark + dask for distributed processing, redis for the sliding window cache, mongo for storing serialized models. 70% faster model reloading.',
      ],
    },
  },
  {
    title: 'WelcomeHome',
    emoji: '🏠',
    link: 'https://github.com/Clue0110/welcomeHome',
    tags: ['Flask', 'PostgreSQL', 'JavaScript', 'TailwindCSS', 'Flask-Login'],
    description: {
      recruiter: 'Full-stack donation management platform for non-profits — handles refugee client orders, inventory tracking, volunteer management, and data-driven reporting.',
      dev: 'built a full-stack app for non-profits to manage donations for refugees. inventory, orders, volunteer tracking, reports — the works. looks like an e-commerce site so refugees feel comfortable using it.',
    },
    bullets: {
      recruiter: [
        'Modeled complex relationships across clients, donors, volunteers, donations, and inventory by designing a normalized PostgreSQL schema from ER diagrams.',
        'Secured multi-role access control by implementing XSS/SQL-injection prevention, input sanitization, and Flask-Login session authentication.',
        'Delivered data-driven insights on client metrics, inventory levels, and expenses by building a volunteer leaderboard and automated report generation with visualizations.',
      ],
      dev: [
        'proper ER-designed postgres schema covering donations, clients, volunteers, inventory — all the relationships.',
        'security was priority one — input sanitization, XSS/SQLi prevention, flask-login for auth. non-profit data is sensitive.',
        'built a volunteer leaderboard to gamify engagement + auto-generated reports with data viz for management insights.',
      ],
    },
  },
  {
    title: 'Teddy',
    emoji: '🧸',
    link: null,
    tags: ['Gemini', 'Figma', 'Unity', 'C#', 'Dialogflow', 'NASA-TLX', 'UX Research'],
    description: {
      recruiter: 'Research-driven AI companion for student wellness — combines AI therapy (Gemini), personalized planning, gamified engagement, and community support. Validated via NASA-TLX, ANOVA, and SUS studies.',
      dev: 'an AI companion app for stressed-out students. it\'s your therapist (gemini-powered), your planner, your study buddy, and has a tamagotchi. validated with actual user studies because HCI class.',
    },
    bullets: {
      recruiter: [
        'Provided context-aware, confidential conversational support by developing a Gemini 1.0 Pro-powered AI therapist with customizable personality and scope-limited prompt engineering.',
        'Validated product decisions through rigorous UX evaluation — 30+ user interviews, NASA-TLX workload assessment, ANOVA/T-Test analysis, and SUS scoring.',
        'Explored immersive next-gen mental-health platforms by prototyping a VR wellness environment in Unity + C# via Wonda.',
      ],
      dev: [
        'gemini-powered AI therapist with prompt engineering so it stays helpful and safe. personality is even customizable.',
        'did proper UX research — 30+ interviews, NASA-TLX, ANOVA/t-tests, SUS scores. HCI class doesn\'t mess around.',
        'even prototyped a VR version in unity + C#. imagine a wellness app but you\'re inside it.',
      ],
    },
  },
]

// ─── Stats / Metrics Pills ───
export const stats = {
  recruiter: [
    { label: 'Companies', value: 'Tesla, Citrix, NYU, Samsung, Virtusa' },
    { label: 'Companies Shipped At', value: '5' },
    { label: 'DAU Scaled To', value: '3.5M+' },
  ],
  dev: [
    { label: 'companies deep', value: '5' },
    { label: 'legacy codebases survived', value: '3' },
    { label: 'kafka topics created', value: '∞' },
  ],
}
