/**
 * Central content model migrated from the reference business site
 * https://www.getsetai.in/ (content only — no markup, styling or assets copied).
 * Items marked [VERIFY] could not be confirmed from the public page.
 */

export type Service = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: "Services";
};

export type Course = {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: string;
  url: string;
  category: "Courses";
  detailedDescription?: string;
  duration?: string;
  level?: string;
  prerequisites?: string[];
  curriculum?: string[];
};

export const company = {
  name: "Getsetai Innovations",
  tagline: "Digital Innovation with AI & Tech",
  description:
    "Getsetai Innovations delivers AI-driven software, full-stack development, and enterprise solutions to clients throughout India.",
  welcome: "Discover the bleeding edge of AI development, tech seminars, and enterprise solutions.",
  registration:
    "Officially registered under the Ministry of Micro, Small & Medium Enterprises (MSME), Govt. of India. Licence No: UDYAM-CG-05-0057895",
  founded: "[VERIFY]",
};

export const services: Service[] = [
  {
    id: 2,
    slug: "technical-seminar",
    title: "Technical Seminar",
    description:
      "Technical seminars and workshops delivered for institutions and enterprise teams.",
    category: "Services",
  },
  {
    id: 3,
    slug: "ai-driven-software-solutions",
    title: "AI Driven Software Solutions",
    description:
      "AI-driven software built for real business workflows, from prototype through production.",
    category: "Services",
  },
  {
    id: 4,
    slug: "website-development-full-stack",
    title: "Website Development Full Stack",
    description: "Full-stack website and web application development, front to back.",
    category: "Services",
  },
  {
    id: 5,
    slug: "digital-marketing",
    title: "Digital Marketing",
    description: "Digital marketing programmes designed to grow reach and measurable demand.",
    category: "Services",
  },
  {
    id: 6,
    slug: "social-media-management",
    title: "Social Media Management",
    description: "Day-to-day social media management, content planning and community response.",
    category: "Services",
  },
  {
    id: 7,
    slug: "robotics",
    title: "Robotics",
    description: "Robotics development and partnership work for applied automation projects.",
    category: "Services",
  },
  {
    id: 8,
    slug: "enhanced-courses",
    title: "Enhanced Courses",
    description:
      "Premium training courses built to give teams an edge in a fast-moving tech industry.",
    category: "Services",
  },
];

export const courses: Course[] = [
  {
    id: 1,
    slug: "ai-tools",
    title: "AI Tools",
    description: "Practical hands-on with modern AI tools and workflows.",
    price: "₹2999",
    url: "https://www.getsetai.in/courses/ai-tools",
    category: "Courses",
    detailedDescription: "Master cutting-edge AI tools including ChatGPT, Claude, Midjourney, and automation workflows. Learn to integrate AI into your daily workflow for maximum productivity.",
    duration: "4 weeks",
    level: "Beginner",
    prerequisites: ["Basic computer skills", "Internet access"],
    curriculum: ["Introduction to AI Tools", "ChatGPT & Language Models", "Image Generation with AI", "AI Automation Workflows", "Business Applications", "Project Implementation"],
  },
  {
    id: 2,
    slug: "ai-mastery",
    title: "AI Mastery",
    description: "Deep dive into advanced AI concepts and production patterns.",
    price: "₹2999",
    url: "https://www.getsetai.in/courses/ai-mastery",
    category: "Courses",
    detailedDescription: "Advanced AI training covering neural networks, deep learning, and production AI systems. Build real-world AI applications from scratch.",
    duration: "8 weeks",
    level: "Intermediate",
    prerequisites: ["Python basics", "Math fundamentals", "AI Tools course (recommended)"],
    curriculum: ["Neural Networks Fundamentals", "Deep Learning Architectures", "Natural Language Processing", "Computer Vision", "Model Deployment", "AI Ethics & Safety"],
  },
  {
    id: 3,
    slug: "python-mastery",
    title: "Python Mastery",
    description: "Become a Python pro with practical coding, automation, and backend skills.",
    price: "₹3999",
    url: "https://www.getsetai.in/courses/python-mastery",
    category: "Courses",
    detailedDescription: "Comprehensive Python programming course covering fundamentals to advanced concepts. Build real applications and automation scripts.",
    duration: "6 weeks",
    level: "Beginner to Intermediate",
    prerequisites: ["No prior experience needed"],
    curriculum: ["Python Basics", "Data Structures", "Object-Oriented Programming", "File Handling & Automation", "Web Development with Flask", "Database Integration"],
  },
  {
    id: 4,
    slug: "machine-learning",
    title: "Machine Learning",
    description: "Master ML algorithms and build predictive models with real datasets.",
    price: "₹4999",
    url: "https://www.getsetai.in/courses/machine-learning",
    category: "Courses",
    detailedDescription: "Complete machine learning course from algorithms to implementation. Work with real datasets and build predictive models.",
    duration: "10 weeks",
    level: "Intermediate",
    prerequisites: ["Python proficiency", "Basic statistics", "Linear algebra basics"],
    curriculum: ["ML Fundamentals", "Supervised Learning", "Unsupervised Learning", "Feature Engineering", "Model Evaluation", "Deep Learning Introduction"],
  },
  {
    id: 5,
    slug: "devops-live-training",
    title: "DevOps Live Training",
    description: "Hands-on DevOps training with CI/CD, containers and observability.",
    price: "₹6999",
    url: "https://www.getsetai.in/courses/devops-live",
    category: "Courses",
    detailedDescription: "Live DevOps training with real-world projects. Learn CI/CD pipelines, containerization, cloud deployment, and monitoring.",
    duration: "8 weeks",
    level: "Intermediate",
    prerequisites: ["Basic Linux knowledge", "Understanding of software development", "Git basics"],
    curriculum: ["DevOps Fundamentals", "CI/CD Pipelines", "Docker & Kubernetes", "Cloud Platforms (AWS/GCP)", "Monitoring & Logging", "Infrastructure as Code"],
  },
  {
    id: 6,
    slug: "expert-consultation",
    title: "1-on-1 Expert Consultation",
    description:
      "A personal consultation with industry professionals covering AI, software development, career roadmap or a startup idea.",
    price: "₹2",
    url: "https://www.getsetai.in/courses/expert-consultation",
    category: "Courses",
    detailedDescription: "Personalized 1-on-1 consultation with industry experts. Get guidance on AI implementation, software development, career planning, or startup ideas.",
    duration: "1 hour session",
    level: "All Levels",
    prerequisites: ["Specific questions or topics prepared"],
    curriculum: ["Personalized discussion", "Q&A session", "Actionable recommendations", "Resource sharing", "Follow-up guidance"],
  },
];

export const contact = {
  email: "innovationsgetsetai@gmail.com",
  phone: "+91 92028 93485",
  phoneHref: "tel:+919202893485",
  hours: "Mon – Sat, 10:00 AM – 7:00 PM (IST)",
  intro:
    "Reach out to our core team for AI integrations, software solutions, or robotics partnerships.",
};

export const locations = [
  {
    label: "HQ · Innovation Center",
    city: "Bhilai",
    lines: ["Vivekananda Nagar, Kohka", "Bhilai Nagar, Chhattisgarh 490023"],
  },
  {
    label: "Cloud HQ",
    city: "Bengaluru",
    lines: ["Kodigehalli, Ayappa Nagar", "Bengaluru, Karnataka 560067"],
  },
];

/** [VERIFY] Reference site renders social icons client-side; profile URLs unconfirmed. */
export const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/getsetai.in/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/getsetai/posts/?feedView=all" },
  { label: "WhatsApp", href: "https://wa.me/message/P565IMYLCIDBG1" },
];

export const footerNav = {
  company: [
    { label: "Services", to: "/services" },
    { label: "Courses", to: "/courses" },
    { label: "Team", to: "/team" },
    { label: "Careers", to: "/careers" },
    { label: "Contact", to: "/contact" },
  ],
  resources: [
    { label: "Documentation", to: "/documentation" },
    { label: "Tutorials", to: "/tutorials" },
    { label: "Support", to: "/support" },
    { label: "Blog", to: "/blog" },
  ],
};
