import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  Code2,
  Cpu,
  Database,
  FileText,
  HelpCircle,
  Layers,
  Search,
  Server,
  ShieldCheck,
  Terminal,
  Zap,
  Check,
  Copy,
  ExternalLink,
  Bot,
  ArrowRight,
} from "lucide-react";
import { company, contact } from "@/data/siteContent";

export const Route = createFileRoute("/documentation")({
  head: () => ({
    meta: [
      { title: "Documentation — GetSetAI Innovations" },
      {
        name: "description",
        content:
          "Official documentation for GetSetAI Innovations platform, AI-driven software architecture, enterprise integrations, and student courses.",
      },
      { property: "og:title", content: "Documentation — GetSetAI Innovations" },
      {
        property: "og:description",
        content:
          "Explore platform guides, API documentation, AI workflows, and technical specifications for GetSetAI Innovations.",
      },
    ],
  }),
  component: DocumentationPage,
});

interface DocSection {
  id: string;
  title: string;
  icon: typeof BookOpen;
  category: string;
  summary: string;
  content: {
    heading: string;
    description: string;
    points?: string[];
    code?: string;
    codeLang?: string;
  }[];
}

const DOCS_DATA: DocSection[] = [
  {
    id: "getting-started",
    title: "Platform Overview",
    icon: Zap,
    category: "Introduction",
    summary: "Welcome to GetSetAI Innovations, government-recognized MSME deep-tech enterprise.",
    content: [
      {
        heading: "About GetSetAI Innovations",
        description:
          "GetSetAI Innovations is an AI-first engineering and education organization officially registered under the Ministry of Micro, Small & Medium Enterprises (MSME), Govt. of India (Licence: UDYAM-CG-05-0057895). We architect enterprise AI solutions, conduct intensive technical seminars, and deliver specialized industry-grade software engineering training.",
        points: [
          "HQ & Innovation Center: Vivekananda Nagar, Kohka, Bhilai, Chhattisgarh 490023",
          "Cloud & Engineering HQ: Kodigehalli, Ayappa Nagar, Bengaluru, Karnataka 560067",
          "MSME Government Verified License: UDYAM-CG-05-0057895",
          "Focus Areas: AI-driven Software, Robotics & Automation, Full-Stack Systems, Technical Seminars",
        ],
      },
      {
        heading: "Core Ecosystem Pillars",
        description:
          "Our platform powers two interconnected verticals: Enterprise AI Solutions (custom development, robotics, automation) and Tech Education (live cohorts, hands-on masterclasses, industry-certified courses).",
      },
    ],
  },
  {
    id: "ai-solutions",
    title: "AI & ML Architecture",
    icon: Bot,
    category: "Engineering",
    summary: "Design patterns, model deployment, agentic workflows, and prompt engineering pipelines.",
    content: [
      {
        heading: "AI-Driven Software Lifecycle",
        description:
          "We build bespoke intelligence engines tailored to enterprise business workflows. From RAG (Retrieval-Augmented Generation) knowledge engines to multi-agent autonomous orchestrations, our solutions integrate directly into your production databases.",
        points: [
          "Autonomous Agent Frameworks with real-time tool calling and safety guardrails",
          "Vector Embeddings & Semantic Search Pipelines (Pinecone, ChromaDB, Qdrant)",
          "Domain-Specific Fine-Tuned Language Models (OpenAI, Anthropic, DeepSeek, Llama)",
          "Computer Vision & Edge OCR for document automation and visual quality control",
        ],
      },
      {
        heading: "Sample AI Inference Pipeline",
        description:
          "A representative example of integrating GetSetAI's intelligent processing layer with custom business logic:",
        code: `// GetSetAI Pipeline Integration Example
import { GetSetAIEngine } from "@getsetai/sdk";

const aiClient = new GetSetAIEngine({
  apiKey: process.env.GETSETAI_API_KEY,
  environment: "production"
});

async function processBusinessDocument(documentBuffer: Buffer) {
  const result = await aiClient.inference.execute({
    task: "enterprise_rag_query",
    input: documentBuffer,
    options: {
      enableConfidenceScoring: true,
      returnCitations: true
    }
  });

  return result.insights;
}`,
        codeLang: "typescript",
      },
    ],
  },
  {
    id: "fullstack-cloud",
    title: "Full-Stack & Cloud Architecture",
    icon: Layers,
    category: "Engineering",
    summary: "Modern web architecture, microservices, containerization, and security protocols.",
    content: [
      {
        heading: "Modern Frontend & Backend Standards",
        description:
          "GetSetAI full-stack applications are crafted using modern type-safe stacks: React 19, TypeScript, TanStack Start/Router, Tailwind CSS, Express/Node.js, and MongoDB with secure JWT auth & RBAC permissions.",
        points: [
          "Zero-latency client hydration with TanStack Start & SSR error boundaries",
          "Strict TypeScript type safety end-to-end across API client and backend schemas",
          "Isolated microservices orchestrated with Docker and Kubernetes clusters",
          "End-to-end TLS encryption, rate limiting, and MSME compliant data custody",
        ],
      },
      {
        heading: "Backend Authentication Flow",
        description:
          "Authentication leverages JSON Web Tokens (JWT) with bcrypt password hashing and secure HTTP-only cookies or bearer tokens.",
        code: `// Sample Auth Middleware Structure
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Authentication required" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.user = user;
    next();
  });
};`,
        codeLang: "javascript",
      },
    ],
  },
  {
    id: "courses-lms",
    title: "Course Platform & LMS",
    icon: BookOpen,
    category: "Education",
    summary: "Student onboarding, live sessions, interactive curriculum, and certificates.",
    content: [
      {
        heading: "Enhanced Courses Structure",
        description:
          "GetSetAI courses are designed for students and working professionals aiming to achieve real industry capability. Each course features live interactive sessions, hands-on capstone projects, code reviews, and government-recognized completion credentials.",
        points: [
          "AI Tools & Automation (4 Weeks) — Master LLMs, prompt engineering, agentic tools",
          "AI Mastery (8 Weeks) — Deep learning, neural networks, production deployment",
          "Python Mastery (6 Weeks) — Core syntax, OOP, backend APIs, automation scripts",
          "Machine Learning (10 Weeks) — Supervised/unsupervised models, predictive analytics",
          "DevOps Live Training (8 Weeks) — Docker, Kubernetes, CI/CD pipelines, cloud",
          "1-on-1 Consultation — Personalized career & project mentoring with core engineers",
        ],
      },
      {
        heading: "Verification & Credentials",
        description:
          "Every certified graduate receives a digitally verifiable certificate backed by GetSetAI Innovations MSME registration details.",
      },
    ],
  },
  {
    id: "robotics-iot",
    title: "Robotics & Edge Systems",
    icon: Cpu,
    category: "Hardware & Edge",
    summary: "Robotics prototyping, IoT sensors, ROS integration, and industrial automation.",
    content: [
      {
        heading: "Applied Robotics Solutions",
        description:
          "We develop physical automation solutions combining embedded microcontrollers (Raspberry Pi, ESP32, NVIDIA Jetson) with high-level computer vision and ROS (Robot Operating System).",
        points: [
          "Edge AI inference with TensorRT and ONNX runtime on embedded hardware",
          "Autonomous navigation, LiDAR mapping, and obstacle avoidance algorithms",
          "Industrial sensor telemetry & live dashboards with WebSocket streaming",
        ],
      },
    ],
  },
  {
    id: "api-reference",
    title: "API Reference & Endpoints",
    icon: Server,
    category: "Developer",
    summary: "REST API endpoints, payload contracts, authentication headers, and response formats.",
    content: [
      {
        heading: "REST API Overview",
        description:
          "All API endpoints accept JSON payloads and return structured responses with standard HTTP status codes.",
        code: `// Base URL: https://api.getsetai.in/v1
// Headers:
// Authorization: Bearer <YOUR_JWT_OR_API_KEY>
// Content-Type: application/json

// Example: User Profile Endpoint
GET /api/auth/profile
Response:
{
  "success": true,
  "user": {
    "id": "65fc8e129...",
    "name": "Praveen Sai",
    "email": "praveen@getsetai.in",
    "role": "student",
    "enrolledCourses": ["ai-tools", "python-mastery"]
  }
}`,
        codeLang: "json",
      },
    ],
  },
];

function DocumentationPage() {
  const [selectedSection, setSelectedSection] = useState<string>("getting-started");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredDocs = DOCS_DATA.filter((doc) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(query) ||
      doc.summary.toLowerCase().includes(query) ||
      doc.content.some(
        (c) =>
          c.heading.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query)
      )
    );
  });

  const activeDoc = DOCS_DATA.find((d) => d.id === selectedSection) || DOCS_DATA[0];

  return (
    <div className="grid-field min-h-dvh px-5 pb-24 pt-28 md:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header section */}
        <div className="mb-12 border-b border-border pb-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-primary/10 text-primary border border-primary/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Official Documentation
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              Version 2.4.0 • Updated 2026
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            Documentation
          </h1>
          <p className="mt-4 max-w-3xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Comprehensive developer guides, AI software patterns, LMS platform workflows, and system architecture for {company.name}.
          </p>

          {/* Search bar */}
          <div className="mt-8 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search guides, architecture, API endpoints, tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-card/60 backdrop-blur-md border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Main Grid: Sidebar navigation & Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-4 space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground px-3 mb-3">
              Table of Contents ({filteredDocs.length})
            </h3>
            <div className="space-y-1.5">
              {filteredDocs.map((doc) => {
                const Icon = doc.icon;
                const isActive = doc.id === activeDoc.id;
                return (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedSection(doc.id)}
                    className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 flex items-start gap-3 border ${
                      isActive
                        ? "bg-card border-primary/40 shadow-sm text-foreground"
                        : "bg-transparent border-transparent hover:bg-card/40 hover:border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{doc.title}</span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground">
                          {doc.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground/80 line-clamp-1 mt-0.5">
                        {doc.summary}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Links Card */}
            <div className="mt-8 p-5 rounded-2xl border border-border bg-card/30 backdrop-blur-sm">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-primary" />
                Need Assistance?
              </h4>
              <p className="text-xs text-muted-foreground mb-4">
                Our support engineering team is available for enterprise consultation and student queries.
              </p>
              <div className="space-y-2">
                <Link
                  to="/support"
                  className="inline-flex w-full items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Visit Support Center
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/tutorials"
                  className="inline-flex w-full items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-border bg-background/50 text-foreground hover:bg-muted transition-colors"
                >
                  Browse Tutorials
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Doc Content Viewer */}
          <main className="lg:col-span-8 bg-card/40 backdrop-blur-md border border-border rounded-2xl p-6 sm:p-8 space-y-8">
            <div className="border-b border-border pb-6">
              <div className="flex items-center gap-2 text-xs font-mono text-primary mb-2">
                <span>{activeDoc.category}</span>
                <span>/</span>
                <span className="text-foreground">{activeDoc.title}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                {activeDoc.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                {activeDoc.summary}
              </p>
            </div>

            {/* Content blocks */}
            <div className="space-y-8">
              {activeDoc.content.map((block, idx) => (
                <div key={idx} className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded bg-primary" />
                    {block.heading}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {block.description}
                  </p>

                  {block.points && (
                    <ul className="space-y-2 mt-3">
                      {block.points.map((pt, pIdx) => (
                        <li
                          key={pIdx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {block.code && (
                    <div className="mt-4 rounded-xl border border-border bg-black/70 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-muted/20">
                        <span className="text-xs font-mono text-muted-foreground uppercase">
                          {block.codeLang || "code"}
                        </span>
                        <button
                          onClick={() => handleCopy(block.code!)}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copiedCode === block.code ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-4 text-xs font-mono text-foreground/90 overflow-x-auto leading-relaxed">
                        <code>{block.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Documentation Footer Info */}
            <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Registration:</span>
                <span className="font-mono text-foreground font-medium">
                  UDYAM-CG-05-0057895
                </span>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-foreground transition-colors"
                >
                  Contact Docs Team
                </a>
                <Link to="/courses" className="hover:text-foreground transition-colors">
                  Explore Courses
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
