import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Newspaper,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Tag,
  Search,
  User,
  Share2,
  Bookmark,
  Check,
} from "lucide-react";
import { company } from "@/data/siteContent";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog & AI Insights — GetSetAI Innovations" },
      {
        name: "description",
        content:
          "Read latest engineering insights, AI trends, full-stack architectural deep-dives, and company news from GetSetAI Innovations.",
      },
      { property: "og:title", content: "Blog & AI Insights — GetSetAI Innovations" },
      {
        property: "og:description",
        content:
          "Discover practical engineering write-ups, AI research summaries, and career guides by GetSetAI Innovations.",
      },
    ],
  }),
  component: BlogPage,
});

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: "AI & Innovation" | "Engineering" | "DevOps & Cloud" | "Company News" | "Career & Learning";
  author: {
    name: string;
    role: string;
  };
  date: string;
  readTime: string;
  featured?: boolean;
  tags: string[];
  content: string[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "future-of-enterprise-ai-2026",
    title: "The Next Generation of Enterprise AI: Beyond Simple Prompting to Autonomous Multi-Agent Workflows",
    excerpt:
      "How forward-thinking Indian businesses are automating complex business logic using coordinated AI agent swarms, vector knowledge graphs, and safe tool-calling protocols.",
    category: "AI & Innovation",
    featured: true,
    author: {
      name: "GetSetAI Research Lab",
      role: "AI Architecture Team",
    },
    date: "September 15, 2026",
    readTime: "7 min read",
    tags: ["Agentic AI", "Enterprise", "LangChain", "LLMs"],
    content: [
      "The initial era of Generative AI focused heavily on chat interfaces and basic prompting. In 2026, the paradigm has shifted dramatically toward autonomous multi-agent systems that can inspect enterprise databases, make tool decisions, and execute multi-step business transactions securely.",
      "At GetSetAI Innovations, we have deployed agentic frameworks across multiple verticals—from automated invoice reconciliation to real-time telemetry processing in industrial manufacturing.",
      "Key architectures powering modern agents include deterministic state machines, semantic vector retrieval with hybrid lexical re-ranking, and strict validation guardrails before any irreversible write operation occurs.",
    ],
  },
  {
    id: "modern-fullstack-performance",
    title: "Building Microsecond-Fast Full-Stack Web Apps with React 19, Vite, and TanStack Start",
    excerpt:
      "A comprehensive deep-dive into zero-waterfall data loaders, SSR streaming boundaries, and modern bundle optimizations that keep bundle payloads under 150KB.",
    category: "Engineering",
    author: {
      name: "Engineering Core",
      role: "Full-Stack Lead",
    },
    date: "September 10, 2026",
    readTime: "5 min read",
    tags: ["React 19", "TypeScript", "TanStack", "Performance"],
    content: [
      "Modern web applications demand lightning-fast initial page loads and instantaneous route transitions. With React 19's enhanced Server Components model and TanStack Router's type-safe routing tree, developers no longer have to sacrifice DX for runtime performance.",
      "In this breakdown, we explore how route-level loaders eliminate waterfall requests and how optimistic UI updates create a native desktop app feel on modern browsers.",
    ],
  },
  {
    id: "demystifying-devops-and-kubernetes",
    title: "DevOps & Cloud Infrastructure: Simplifying Kubernetes and Automated GitOps for Scale",
    excerpt:
      "Why continuous integration, automated rollbacks, and observable cloud metrics are essential for scaling modern microservices without operational headaches.",
    category: "DevOps & Cloud",
    author: {
      name: "Cloud Ops Team",
      role: "DevOps Specialist",
    },
    date: "September 02, 2026",
    readTime: "6 min read",
    tags: ["DevOps", "Docker", "Kubernetes", "CI/CD"],
    content: [
      "Deploying software reliably requires more than just pushing code. Our DevOps curriculum and internal infrastructure leverage containerized pipelines that validate code quality, execute security scans, and deploy zero-downtime rolling updates to distributed cloud clusters.",
    ],
  },
  {
    id: "upskilling-future-engineers-msme",
    title: "Bridging the Academia-Industry Gap: How GetSetAI Has Mentored 5,000+ Students",
    excerpt:
      "Reflecting on our MSME-recognized technical seminars, university partnerships, and hands-on cohorts across Chhattisgarh, Karnataka, and beyond.",
    category: "Company News",
    author: {
      name: "GetSetAI Foundation",
      role: "Education & Outreach",
    },
    date: "August 28, 2026",
    readTime: "4 min read",
    tags: ["MSME", "Education", "Seminars", "Impact"],
    content: [
      "As an MSME-registered enterprise (UDYAM-CG-05-0057895), GetSetAI was founded on the belief that cutting-edge AI and software education must be practical, project-centric, and accessible to students across tier-1, tier-2, and tier-3 cities.",
      "Through our comprehensive courses in AI Tools, Python Mastery, and Machine Learning, graduates have gone on to build production applications and secure high-impact engineering roles.",
    ],
  },
  {
    id: "edge-ai-and-robotics-revolution",
    title: "Edge AI and Vision Automation: Integrating Computer Vision into Applied Robotics",
    excerpt:
      "Running lightweight neural networks directly on edge microcontrollers and embedded Jetson boards for real-time robotic perception and safety.",
    category: "AI & Innovation",
    author: {
      name: "Robotics Division",
      role: "Hardware Systems",
    },
    date: "August 20, 2026",
    readTime: "6 min read",
    tags: ["Robotics", "Computer Vision", "Edge AI", "IoT"],
    content: [
      "Edge computing enables real-time decision-making without relying on cloud round-trips. By optimizing YOLO models with TensorRT and integrating ROS publishers, our robotics team achieves 60+ FPS real-time object tracking on compact hardware.",
    ],
  },
];

const BLOG_CATEGORIES = [
  "All",
  "AI & Innovation",
  "Engineering",
  "DevOps & Cloud",
  "Company News",
  "Career & Learning",
] as const;

function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCat = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const featuredPost = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];

  return (
    <div className="grid-field min-h-dvh px-5 pb-24 pt-28 md:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 border-b border-border pb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-primary/10 text-primary border border-primary/20">
              <Newspaper className="w-3.5 h-3.5" />
              Insights & Engineering Blog
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            GetSetAI Insights
          </h1>
          <p className="mt-4 max-w-3xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Thought leadership, software engineering deep-dives, AI automation breakthroughs, and updates from the {company.name} team.
          </p>

          {/* Search & Category Tabs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles, topics, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card/60 border border-border rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {BLOG_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card/40 text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Post Card (Hero) */}
        {selectedCategory === "All" && !searchQuery && (
          <div className="mb-14 rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card/80 to-primary/5 p-6 sm:p-10 backdrop-blur-md shadow-xl">
            <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-mono">
              <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground font-semibold">
                Featured Article
              </span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {featuredPost.date}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {featuredPost.readTime}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground hover:text-primary transition-colors mb-4">
              {featuredPost.title}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-4xl mb-6">
              {featuredPost.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs">
                  AI
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{featuredPost.author.name}</p>
                  <p className="text-[11px] text-muted-foreground">{featuredPost.author.role}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveArticle(featuredPost)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
              >
                Read Full Story
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Article Reader Modal */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-card border border-border rounded-3xl max-w-3xl w-full p-6 sm:p-10 my-8 space-y-6 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95">
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-6 right-6 p-2 rounded-full border border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 text-xs font-mono text-primary">
                <span>{activeArticle.category}</span>
                <span>•</span>
                <span>{activeArticle.readTime}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                {activeArticle.title}
              </h2>

              <div className="flex items-center gap-3 pb-6 border-b border-border">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                  {activeArticle.author.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{activeArticle.author.name}</p>
                  <p className="text-[11px] text-muted-foreground">{activeArticle.date}</p>
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                {activeArticle.content.map((p, idx) => (
                  <p key={idx} className="text-foreground/90 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>

              <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {activeArticle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-muted text-[11px] font-mono text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
                >
                  Close Reader
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setActiveArticle(post)}
              className="p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-sm hover:border-primary/40 hover:bg-card/70 transition-all duration-200 flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs font-mono">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {post.category}
                  </span>
                  <span className="text-muted-foreground">{post.readTime}</span>
                </div>

                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{post.date}</span>
                <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Article &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
