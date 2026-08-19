export const resumeData = {
  header: {
    name: 'Sai Akilesh Venigalla',
    location: 'San Francisco, CA 94107',
    tagline: '4+ Years of SWE Experience',
    phone: '347-477-8764',
    email: 'clueless101.exe@gmail.com',
    linkedin: 'https://linkedin.com/in/sai-akilesh/',
    linkedinLabel: 'linkedin.com/in/sai-akilesh',
    github: 'https://github.com/Clue0110',
    githubLabel: 'github.com/Clue0110',
    website: 'http://clueless.nyc',
    websiteLabel: 'clueless.nyc',
  },

  experience: [
    {
      company: 'Tesla',
      title: 'Software Engineer Intern',
      period: 'Jan 2026 – Present',
      description: 'Building mission-critical products and features for the RoboTaxi and Supercharging teams.',
      bullets: [
        'Accelerated Robotaxi payments processing by 85% by architecting a scalable Kafka pipeline and Go-based DLQ for robust, asynchronous event processing and fault-tolerant retries.',
        'Achieved 90% faster ride data retrieval via a high-throughput MySQL to Elasticsearch sync pipeline.',
        'Maximized Supercharger utility via 100% visibility of live wait-time forecasts to Google Maps via gRPC and OCPI.',
        'Scaled referral device fingerprinting to 3.5M+ DAU using Redis, idempotency and a secure Apple Pay pre-auth engine.',
        'Leveraged H3 geospatial indexing to optimize Robotaxi surge pricing for a 400+ vehicle fleet, adjusting rates in real-time based on location, fleet congestion, and demand patterns.',
      ],
    },
    {
      company: 'Citrix (Cloud Software Group)',
      title: 'Software Engineer 2',
      period: 'Sept 2023 – Aug 2024',
      description: 'Led new feature development and backend optimizations for Unified Security.',
      bullets: [
        'Optimized API response times by over 95% (4 min to 9 s) by re-architecting cloud backend services in C++.',
        'Drove a 60% increase in application security license sales by architecting a security recommendation microservice in Python and C++, deployed on Docker and Kubernetes, while also serving as the team\'s Scrum Master.',
        'Saved the threat research team 30+ hours of manual work and minimized CPU usage by 30% by leading the integration of LLMs (OpenAI) with Python and C to automate WAF signature extraction and categorization.',
        'Resolved database bottlenecks with Splunk, strategic indexing and refactoring, enhancing backend efficiency by 66%.',
        'Mentored and trained 5 software engineers in Agile, OOP, and System Design, and conducted detailed code walkthroughs.',
      ],
    },
    {
      company: 'Citrix (Cloud Software Group)',
      title: 'Software Engineer 1',
      period: 'Jul 2021 – Sept 2023',
      description: 'Drove innovation by architecting large-scale parallel and distributed systems for application security.',
      bullets: [
        'Slashed Software Development Life Cycle runtime by 88% (16 hrs to under 2 hrs) by architecting a large-scale CI/CD pipeline using Jenkins, Java, Python, Groovy, and Bash Scripting — earning the Award for Technical Innovation.',
        'Boosted build cycles 30x (1/wk to 30/wk) with an adaptive scheduling module that parallelized distributed workloads.',
        'Eliminated 100% of false negatives with a context-aware Java module that adaptively selects Ruby and Perl test cases.',
        'Accelerated container recovery time by 75% by using Prometheus and Grafana for monitoring to trigger Kubernetes-orchestrated disaster recovery actions.',
      ],
    },
    {
      company: 'Citrix (Cloud Software Group)',
      title: 'Software Engineering Intern',
      period: 'Jan 2021 – Jul 2021',
      description: "Developed new features and built full-stack solutions to accelerate Netscaler's development lifecycle.",
      bullets: [
        'Cut kernel test time by 96% by building a full-stack web app (Flask, React) for rapid isolated testing.',
        'Reduced server load by 20% by blocking malicious bots with browser fingerprinting in JavaScript and C++.',
        "Reduced processing overhead by 30% while enhancing the positive security model, engineering optimized C-code directly inside the Netscaler kernel's core packet engine.",
      ],
    },
  ],

  skills: [
    {
      category: 'Languages',
      items: ['Go', 'Python', 'Java', 'C', 'C++', 'C#', 'HTML/CSS', 'JavaScript', 'SQL', 'TypeScript', 'Ruby', 'Bash/Shell Scripting'],
    },
    {
      category: 'Databases',
      items: ['PostgreSQL', 'MongoDB', 'Amazon S3', 'Pinecone (Vector DB)', 'Redis', 'DynamoDB'],
    },
    {
      category: 'Technologies & Frameworks',
      items: ['Docker', 'Kubernetes', 'Jenkins CI/CD', 'AWS', 'Azure', 'GCP', 'FastAPI', 'Flask', 'Django', 'ReactJS', 'Git', 'TensorFlow', 'PyTorch', 'Spark', 'Kafka', 'Elasticsearch', 'Logstash', 'Kibana', 'Terraform', 'Cursor'],
    },
    {
      category: 'Core Skills',
      items: ['Fullstack Development', 'Backend Development', 'System Design', 'Microservices', 'REST API', 'Kernel Development'],
    },
  ],

  projects: [
    {
      title: 'WeaveAI',
      tech: 'ReactJS, FastAPI, LangChain, LLMs, MongoDB, ChromaDB, Redis, RAG, Prompt Engineering, GenAI',
      link: 'https://github.com/Clue0110/WeaveAI',
      bullets: [
        'Built an AI learning platform (ReactJS, FastAPI) using LangChain to orchestrate LLMs for custom curricula generation.',
        'Engineered a RAG pipeline with a multi-database backend (ChromaDB, MongoDB, Redis) and automated podcast/quiz generation, reducing tutor response time by 95% and boosting user engagement by 40%.',
      ],
    },
    {
      title: 'VibeTrader',
      tech: 'ReactJS, Flask, Kafka, SparkNLP, LSTM, TensorFlow, MLOps, Spark, AI Agents, Dask, Finance',
      link: 'https://github.com/Clue0110/VibeTrader',
      bullets: [
        'Developed a smart trading platform fusing market data with a tri-modal sentiment engine to improve stock predictions.',
        'Implemented an end-to-end ETL pipeline using Selenium & PySpark and a Kafka streaming architecture on a multi-database backend (PostgreSQL, MongoDB, Redis) for live alerts & improving inference optimization by 70%.',
      ],
    },
  ],

  education: [
    {
      school: 'New York University',
      degree: 'Master of Science in Computer Science',
      gpa: '3.95/4.0',
      period: 'May 2026',
    },
    {
      school: 'Manipal Institute of Technology',
      degree: 'Bachelor of Science in Computer Science',
      gpa: '3.95/4.0',
      period: 'May 2021',
    },
  ],
}
