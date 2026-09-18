import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  Code,
  Clock,
  Sparkles,
  ChevronRight,
  Terminal,
  Cpu,
  Layers,
  CheckCircle2,
  ArrowRight,
  PlayCircle,
  ExternalLink,
  Laptop,
} from "lucide-react";
import { company, courses } from "@/data/siteContent";

export const Route = createFileRoute("/tutorials")({
  head: () => ({
    meta: [
      { title: "Tutorials — GetSetAI Innovations" },
      {
        name: "description",
        content:
          "Practical step-by-step tutorials on AI tools, Full-Stack development, Python mastery, DevOps pipelines, and Robotics by GetSetAI Innovations.",
      },
      { property: "og:title", content: "Tutorials — GetSetAI Innovations" },
      {
        property: "og:description",
        content:
          "Master cutting-edge AI and software skills with hands-on coding walkthroughs and engineering tutorials.",
      },
    ],
  }),
  component: TutorialsPage,
});

interface Tutorial {
  id: string;
  title: string;
  category: "AI & Agents" | "Full-Stack" | "Python & ML" | "DevOps & Cloud" | "Robotics";
  level: "Beginner" | "Intermediate" | "Advanced";
  readTime: string;
  description: string;
  steps: {
    title: string;
    detail: string;
    codeSnippet?: string;
  }[];
  relatedCourseSlug?: string;
}

const TUTORIALS: Tutorial[] = [
  {
    id: "building-ai-agent-rag",
    title: "Building an Autonomous RAG Agent with Python & LangChain",
    category: "AI & Agents",
    level: "Intermediate",
    readTime: "12 min read",
    description:
      "Learn how to create a production-grade Retrieval-Augmented Generation agent capable of searching enterprise documents and answering customer queries with source citations.",
    steps: [
      {
        title: "1. Environment Setup & Dependency Installation",
        detail:
          "Initialize your Python virtual environment and install LangChain, Chroma vector database, and OpenAI / DeepSeek connectors.",
        codeSnippet: `pip install langchain langchain-community chromadb openai python-dotenv`,
      },
      {
        title: "2. Document Ingestion & Chunking",
        detail:
          "Load unstructured PDF or Markdown documents using RecursiveCharacterTextSplitter with optimal chunk overlap to preserve context.",
        codeSnippet: `from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

loader = PyPDFLoader("company_knowledge.pdf")
docs = loader.load()

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
splits = text_splitter.split_documents(docs)`,
      },
      {
        title: "3. Vector Embedding & Retrieval QA Chain",
        detail:
          "Index chunks into ChromaDB and connect a ChatOpenAI / local model with temperature 0.2 for hallucination-free querying.",
        codeSnippet: `from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.chains import create_retrieval_chain

vectorstore = Chroma.from_documents(documents=splits, embedding=OpenAIEmbeddings())
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})`,
      },
    ],
    relatedCourseSlug: "ai-mastery",
  },
  {
    id: "fullstack-react19-tanstack",
    title: "Full-Stack Web App Architecture with React 19 & TanStack Router",
    category: "Full-Stack",
    level: "Intermediate",
    readTime: "15 min read",
    description:
      "Step-by-step blueprint for setting up type-safe routing, SSR data fetching, and microsecond hydration in high-traffic enterprise portals.",
    steps: [
      {
        title: "1. Scaffold TanStack Router with Vite",
        detail:
          "Set up file-based routing with automatic code splitting, nested route layouts, and router devtools.",
        codeSnippet: `npm create vite@latest getsetai-portal -- --template react-ts
npm install @tanstack/react-router @tanstack/react-query lucide-react clsx tailwindcss`,
      },
      {
        title: "2. Defining Type-Safe File Routes",
        detail:
          "Create route definitions using createFileRoute with custom loaders, head tags, and suspense boundaries.",
        codeSnippet: `import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard')({
  loader: async () => fetchUserData(),
  component: DashboardView,
});`,
      },
      {
        title: "3. Integrating Global State & Authentication Context",
        detail:
          "Wrap your root router outlet with React Context for real-time authentication persistence across page transitions.",
      },
    ],
    relatedCourseSlug: "python-mastery",
  },
  {
    id: "docker-kubernetes-cicd",
    title: "Enterprise CI/CD Pipelines with Docker, GitHub Actions & Cloud",
    category: "DevOps & Cloud",
    level: "Advanced",
    readTime: "18 min read",
    description:
      "Containerize your full-stack microservices, configure automated linting & unit tests on GitHub Actions, and deploy zero-downtime rolling updates to Kubernetes.",
    steps: [
      {
        title: "1. Multi-Stage Dockerfile Optimization",
        detail:
          "Build lean production container images using Alpine Linux and multi-stage build layers to minimize image footprint under 80MB.",
        codeSnippet: `# Multi-stage build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]`,
      },
      {
        title: "2. Setting up Automated GitHub Actions Workflow",
        detail:
          "Configure test runner triggers on pull requests and automated push to container registries on main branch merges.",
      },
    ],
    relatedCourseSlug: "devops-live-training",
  },
  {
    id: "machine-learning-eda-pytorch",
    title: "Predictive Modeling with PyTorch: From Exploratory Data Analysis to Deployment",
    category: "Python & ML",
    level: "Intermediate",
    readTime: "14 min read",
    description:
      "Clean real-world datasets with Pandas & NumPy, train deep neural networks with PyTorch, and expose inference endpoints with FastAPI.",
    steps: [
      {
        title: "1. Exploratory Data Analysis & Feature Engineering",
        detail:
          "Handle missing values, encode categorical variables, and normalize numerical distributions using Scikit-Learn.",
      },
      {
        title: "2. Custom PyTorch Neural Network Module",
        detail:
          "Define linear layers, ReLU activations, Dropout regularizers, and compute backpropagation with Adam optimizer.",
        codeSnippet: `import torch
import torch.nn as nn

class EnterpriseClassifier(nn.Module):
    def __init__(self, input_dim, output_dim):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(input_dim, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, output_dim)
        )
        
    def forward(self, x):
        return self.network(x)`,
      },
    ],
    relatedCourseSlug: "machine-learning",
  },
  {
    id: "ai-prompt-engineering-workflows",
    title: "Advanced Prompt Engineering & LLM Automation Workflows",
    category: "AI & Agents",
    level: "Beginner",
    readTime: "10 min read",
    description:
      "Master Few-Shot Prompting, Chain-of-Thought reasoning, and structured JSON output schemas to automate business tasks with 99%+ accuracy.",
    steps: [
      {
        title: "1. Chain-of-Thought & Reasoning Decomposition",
        detail:
          "Structure system prompts to enforce deliberate step-by-step reasoning before generating final decision outputs.",
      },
      {
        title: "2. Structured Schema Extraction",
        detail:
          "Enforce JSON Mode / Function Calling schemas with strict TypeScript/Pydantic validation for direct API ingestion.",
      },
    ],
    relatedCourseSlug: "ai-tools",
  },
  {
    id: "robotics-ros-edge-vision",
    title: "Edge Computer Vision & Robotics Telemetry with OpenCV & ROS",
    category: "Robotics",
    level: "Advanced",
    readTime: "16 min read",
    description:
      "Integrate camera feeds with YOLOv8 object detection on edge hardware and publish tracking telemetry over ROS topics.",
    steps: [
      {
        title: "1. Camera Stream Ingestion & YOLOv8 Inference",
        detail:
          "Process real-time video frames with OpenCV and run ultra-low latency inference using TensorRT-accelerated weights.",
      },
      {
        title: "2. ROS Node Telemetry Publisher",
        detail:
          "Broadcast bounding box coordinates and object classifications to robot actuator motor controllers.",
      },
    ],
  },
];

const CATEGORIES = ["All", "AI & Agents", "Full-Stack", "Python & ML", "DevOps & Cloud", "Robotics"] as const;

function TutorialsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedTutorialId, setExpandedTutorialId] = useState<string | null>(TUTORIALS[0].id);

  const filteredTutorials = TUTORIALS.filter((t) => {
    if (selectedCategory === "All") return true;
    return t.category === selectedCategory;
  });

  return (
    <div className="grid-field min-h-dvh px-5 pb-24 pt-28 md:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 border-b border-border pb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              Hands-On Learning Hub
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            Tutorials & Code Walkthroughs
          </h1>
          <p className="mt-4 max-w-3xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Step-by-step engineering tutorials, AI tool masterclasses, and code patterns crafted by {company.name} engineers to accelerate your practical skills.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card/50 text-muted-foreground border-border hover:text-foreground hover:bg-card hover:border-foreground/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tutorials List & Viewer */}
        <div className="space-y-6">
          {filteredTutorials.map((tutorial) => {
            const isExpanded = expandedTutorialId === tutorial.id;
            return (
              <div
                key={tutorial.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? "bg-card/70 border-primary/40 shadow-lg"
                    : "bg-card/30 border-border hover:border-border/80 hover:bg-card/50"
                }`}
              >
                {/* Header item */}
                <div
                  onClick={() => setExpandedTutorialId(isExpanded ? null : tutorial.id)}
                  className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none"
                >
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {tutorial.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md ${
                          tutorial.level === "Beginner"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : tutorial.level === "Intermediate"
                              ? "bg-sky-500/10 text-sky-400"
                              : "bg-purple-500/10 text-purple-400"
                        }`}
                      >
                        {tutorial.level}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        {tutorial.readTime}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground hover:text-primary transition-colors">
                      {tutorial.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tutorial.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                    <span className="text-xs font-medium text-primary md:inline hidden">
                      {isExpanded ? "Collapse Guide" : "Explore Tutorial"}
                    </span>
                    <div
                      className={`p-2.5 rounded-full border border-border bg-background/50 text-foreground transition-transform duration-300 ${
                        isExpanded ? "rotate-90 bg-primary text-primary-foreground border-primary" : ""
                      }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Expanded Content Area */}
                {isExpanded && (
                  <div className="border-t border-border/80 bg-background/40 p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-6">
                      {tutorial.steps.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-5 rounded-xl border border-border/70 bg-card/40 space-y-3"
                        >
                          <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                            {step.title}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                            {step.detail}
                          </p>
                          {step.codeSnippet && (
                            <div className="ml-7 mt-3 rounded-lg border border-border bg-black/80 p-4 font-mono text-xs text-foreground overflow-x-auto">
                              <pre>
                                <code>{step.codeSnippet}</code>
                              </pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Bottom CTA for Course Enrollment */}
                    <div className="mt-8 p-6 rounded-xl border border-primary/30 bg-primary/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="text-base font-semibold text-foreground">
                          Want live mentorship and deep-dive projects?
                        </h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Join our comprehensive instructor-led cohort with personalized 1-on-1 code reviews.
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Link
                          to="/courses"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                        >
                          View Full Course
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Global CTA Banner */}
        <div className="mt-16 p-8 sm:p-12 rounded-3xl border border-border bg-gradient-to-br from-card/60 via-card/30 to-background backdrop-blur-md text-center max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Accelerate Your Tech Journey with GetSetAI
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            From hands-on tutorials to live cohorts and MSME-certified courses, level up your engineering skills today.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Browse All Courses
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/documentation"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-background/50 text-foreground text-sm font-medium hover:bg-muted transition-colors"
            >
              Read Docs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
