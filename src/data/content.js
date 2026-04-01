// ─── Personal Details ───
export const personal = {
  name: 'Sai Akilesh Venigalla',
  location: 'New York, NY',
  email: 'saiakilesh101@gmail.com',
  phone: '+1 347 477 8764',
  linkedin: 'https://www.linkedin.com/in/sai-akilesh/',
  github: 'https://github.com/Clue0110',
  website: 'https://clueless.nyc',
  tagline: {
    recruiter: 'Software Engineer @ Tesla · NYU CS · Building Scalable Distributed Systems',
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
    role: 'Software Engineer',
    period: 'Jan 2026 – Present',
    location: 'Fremont, CA',
    color: '#e31937',
    bullets: {
      recruiter: [
        'Accelerated Robotaxi payment processing by 85% — architected a scalable Apache Kafka pipeline with a Go-based Dead Letter Queue for asynchronous, fault-tolerant event processing and automated retries.',
        'Achieved 90% faster ride data retrieval — engineered a high-throughput MySQL-to-Elasticsearch real-time sync pipeline for sub-second query latency across millions of ride records.',
        'Shipped live Supercharger wait-time forecasts to Google Maps — built gRPC + OCPI integration delivering 100% visibility of real-time forecasts to millions of EV drivers.',
        'Scaled referral device fingerprinting to 3.5M+ DAU — built Redis-backed idempotency layer + secure Apple Pay pre-authorization engine for fraud-resistant referral processing.',
        'Optimized Robotaxi surge pricing for 400+ vehicle fleet — leveraged H3 geospatial indexing to compute real-time rate adjustments based on location, congestion, and demand patterns.',
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
        'Architected a cost-effective IPv4 host reservation system using FastAPI + MySQL, replacing expensive ISC licensing tools — designed RESTful CRUD APIs and database models for Kea DHCP lease management.',
        'Containerized Kea DHCP, PostgreSQL, and FastAPI services with Docker — leveraged Docker Networks for inter-microservice communication, achieving 50% reduction in resource consumption.',
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
        'Developed Citrix WAF Security Recommendation Engine as a microservice — Python + C++ engine identifying critical web app vulnerabilities with real-time analytics; drove 60% increase in AppSec license sales.',
        'Deployed security engine across cloud (Kubernetes/Docker) and on-premises (FreeBSD kernel) — implemented technology scanning to tailor attack payloads and streamline URL exploration across 10,000+ URLs.',
        'Reduced Unified Security API response time by 95% (4min → <10s) — rewrote core processing in C++, implemented Redis caching, and eliminated redundant database queries.',
        'Optimized PostgreSQL performance — diagnosed bottlenecks via Splunk log analysis, created strategic indexes, and refactored SQL queries to reduce query time by 50% and boost DB efficiency by 20%.',
        'Automated WAF signature categorization using Google Gemini + CVE data — reduced CPU usage by 30% and saved 20+ developer-hours per update cycle through LLM-powered prompt engineering.',
        'Designed centralized API management system — used API specification files as single source of truth for security policy enforcement across REST and gRPC, reducing API security setup effort by 60%.',
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
        'Engineered Jenkins CI/CD pipeline (Java/Groovy + Ansible) for WAF cloud migration — reduced SDLC from 16 hours to <2 hours (88% reduction); built Prometheus + Grafana observability dashboards.',
        'Designed dynamic build scheduling module — parallelized workloads via dependency graph analysis, increasing build throughput 30x (1/week → 6/day).',
        'Built globally-adopted test selection module in Java — dynamically analyzes codebases to run only relevant tests, eliminating 100% of false negatives across all NetScaler feature teams.',
        'Architected multi-cloud disaster recovery (AWS/Azure/GCP) with Terraform + Ansible — automated VM snapshotting and heartbeat monitoring for zero-downtime failover; 75% faster DR provisioning.',
        'Implemented proxy authentication module in C for NetScaler kernel — secured WAF signature downloads from S3, closing a critical unauthenticated data channel vulnerability.',
        'Automated signature update pipeline (Python/C/Shell) — hashing-based change detection triggering S3 PRs + auto-generated release notes; reduced processing time by 84%.',
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
        'Built Flask-based rapid testing tool — reduced NetScaler sub-feature validation from 24 hours to 1 hour (96% reduction), boosting developer productivity by 25%.',
        'Developed self-learning payload generation tool in Python — auto-generated 1,000+ randomized HTTP attack payloads per CI/CD commit for WAF regression testing.',
        'Pioneered browser fingerprinting bot detection prototype in JavaScript — combined duck typing + user-agent analysis to unmask spoofed bots bypassing WAF defenses.',
        'Resolved high-priority production WAF escalations — debugged 25-year-old legacy C codebase for critical customer-impacting incidents.',
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
    role: 'Research Intern — Panoramic Video Stitching',
    period: 'May 2021 – Nov 2021',
    location: 'Bangalore, India',
    color: '#1428a0',
    bullets: {
      recruiter: [
        'Engineered real-time dual-camera panoramic video stitching module using Python + OpenCV — achieved sub-100ms per-frame processing via SIFT feature matching, RANSAC homography, and multi-threaded pipeline.',
        'Implemented histogram matching + multi-band blending — eliminated visible seams, maintained 99% source resolution, and reduced user-reported visual artifacts by 30%.',
        'Built multi-threaded Tkinter diagnostic GUI — real-time visualization of individual camera feeds alongside stitched panoramic output for live debugging.',
      ],
      dev: [
        'stitched two phone cameras into one panoramic video in real-time. SIFT for feature matching, RANSAC for homography, multi-threading to hit <100ms per frame. math is beautiful.',
        'the seam between cameras was ugly — fixed it with histogram matching + multi-band blending. 99% resolution preserved, 30% fewer user complaints.',
        'built a tkinter gui that shows both camera feeds + the stitched output side by side in real-time. threading was key — can\'t block the UI thread.',
      ],
    },
  },
  {
    company: 'Samsung R&D',
    role: 'Research Intern — Object Eraser',
    period: 'Oct 2020 – Mar 2021',
    location: 'Bangalore, India',
    color: '#1428a0',
    bullets: {
      recruiter: [
        'Developed custom GAN-based neural inpainting model for Samsung\'s Object Eraser — trained on 350,000+ indoor images for robust background reconstruction.',
        'Built automated image scraper in Python — harvested diverse 350K-image dataset from Google Image Search, accelerating R&D timelines; praised by Samsung leadership.',
        'Trained flash-artifact removal GAN — enabled clean inpainting under harsh lighting conditions, improving real-world reliability.',
      ],
      dev: [
        'trained a GAN to erase objects from photos and reconstruct the background — the samsung object eraser feature. fed it 350k images i scraped from google.',
        'built a python scraper to automate the dataset collection. samsung liked it so much they called it out specifically.',
        'phone flash artifacts were destroying the inpainting results. trained a separate GAN just to nuke the flash glare before reconstruction. clean results.',
      ],
    },
  },
  {
    company: 'Samsung R&D',
    role: 'Research Intern — Gait Analysis',
    period: 'Jan 2020 – Aug 2020',
    location: 'Bangalore, India',
    color: '#1428a0',
    bullets: {
      recruiter: [
        'Investigated smartphone sensor-based gait authentication — captured 100Hz accelerometer + gyroscope data from diverse user cohort for biometric pattern analysis.',
        'Developed custom peak detection algorithm in Python — correlated accelerometer footstep signatures with unique gait baselines for ML-based authentication.',
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
        'Developed dynamic e-commerce platform using Adobe Experience Manager — implemented AJAX-based rendering to eliminate page refreshes, increasing conversions and engagement.',
        'Built gamified spin-the-wheel promotion (JavaScript + TailwindCSS) — 35% increase in email sign-ups over static forms; adopted as reusable marketing component.',
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
        'Engineered RAG pipeline with ChromaDB vector store — reduced LLM token consumption by embedding entire course content for optimized AI tutor context retrieval.',
        'Integrated Redis chat history caching — decreased AI chatbot response latency by 95% for real-time conversational tutoring.',
        'Built multimodal AI tutor (chat + voice) using LangChain + Gemini — prompt-engineered to strictly scope responses to user-provided materials.',
        'Developed auto-podcast generation using coquiTTS + ElevenLabs + pydub — 40% increase in user engagement from audio content.',
        'Implemented auto-quiz generation (OpenAI + Gemini) with MongoDB progress tracking — 30% improvement in measured learning efficiency.',
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
        'Built real-time streaming architecture with Apache Kafka + Zookeeper — ingests live stock data, social feeds, and news; telemetry service pushes instant alert on sentiment flags.',
        'Engineered tri-model sentiment engine — SparkNLP ML model + rule-based analyzer + LLM fine-tuned for Reddit/GenZ language for superior accuracy.',
        'Constructed two-stage prediction: LSTM for initial price forecast → 2-layer neural network combining predictions + sentiment + 60h historical data for final buy/sell signals.',
        'Leveraged PySpark + Dask for distributed preprocessing; Redis caching for real-time 60h sliding window; MongoDB for serialized model storage (70% faster model loading).',
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
        'Designed normalized database schema with ER diagrams — modeled complex relationships across clients, donors, volunteers, donations, and inventory in PostgreSQL.',
        'Implemented XSS/SQL injection prevention, input sanitization, and Flask-Login session authentication for secure multi-role access control.',
        'Built volunteer leaderboard + automated report generation — data visualizations for client metrics, inventory levels, and expense tracking.',
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
        'Developed Gemini 1.0 Pro-powered AI therapist with customizable personality — prompt-engineered for context-aware, confidential conversational support with scope-limited responses.',
        'Conducted rigorous UX evaluation: 30+ user interviews, NASA-TLX workload assessment, ANOVA/T-Test validation, and SUS scoring.',
        'Prototyped VR wellness environment using Unity + C# via Wonda — exploring immersive next-gen mental health platforms.',
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
    { label: 'Years of Experience', value: '5+' },
    { label: 'Companies Shipped At', value: '5' },
    { label: 'Avg Performance Gain', value: '60%+' },
    { label: 'DAU Scaled To', value: '3.5M+' },
  ],
  dev: [
    { label: 'years shipping code', value: '5+' },
    { label: 'companies deep', value: '5' },
    { label: 'legacy codebases survived', value: '3' },
    { label: 'kafka topics created', value: '∞' },
  ],
}
