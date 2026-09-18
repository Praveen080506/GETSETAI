import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  LifeBuoy,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  ChevronDown,
  Send,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Headphones,
  ExternalLink,
} from "lucide-react";
import { company, contact, locations } from "@/data/siteContent";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support & Help Center — GetSetAI Innovations" },
      {
        name: "description",
        content:
          "Official Support & Help Center for GetSetAI Innovations. Submit support tickets, read FAQs, and connect with technical support.",
      },
      { property: "og:title", content: "Support & Help Center — GetSetAI Innovations" },
      {
        property: "og:description",
        content:
          "Need help with courses, enterprise AI consulting, or technical seminars? Get direct support from GetSetAI Innovations.",
      },
    ],
  }),
  component: SupportPage,
});

interface FAQItem {
  question: string;
  answer: string;
  category: "General" | "Courses & LMS" | "Enterprise AI & Services" | "Certificates & MSME";
}

const FAQS: FAQItem[] = [
  {
    category: "General",
    question: "What is GetSetAI Innovations and what services do you provide?",
    answer:
      "GetSetAI Innovations is an MSME-registered deep-tech organization (Licence: UDYAM-CG-05-0057895) providing AI-driven software development, full-stack web architectures, robotics automation solutions, university tech seminars, and career-advancing tech courses throughout India.",
  },
  {
    category: "Courses & LMS",
    question: "How do I access my enrolled courses and live sessions?",
    answer:
      "Once you enroll in any course (such as AI Tools, Python Mastery, Machine Learning, or DevOps), you will receive credentials to access your dedicated student portal. Live session links and recorded sessions are provided with lifetime access.",
  },
  {
    category: "Certificates & MSME",
    question: "Are GetSetAI course certificates government-recognized?",
    answer:
      "Yes. Every course completion certificate includes an official verification ID issued under our MSME registration (UDYAM-CG-05-0057895), verifiable by employers, institutions, and recruiters.",
  },
  {
    category: "Enterprise AI & Services",
    question: "How do we request a custom AI software or enterprise seminar?",
    answer:
      "You can submit a ticket via this Support Center or reach us directly at innovationsgetsetai@gmail.com / +91 92028 93485. Our solution architects will schedule an introductory discovery call within 24 hours.",
  },
  {
    category: "General",
    question: "What are your standard support working hours?",
    answer:
      "Our support desk operates Monday through Saturday from 10:00 AM to 7:00 PM IST. Priority production support for enterprise clients is available 24/7.",
  },
  {
    category: "Courses & LMS",
    question: "Can I book a 1-on-1 expert consultation with your engineering team?",
    answer:
      "Yes! You can book our '1-on-1 Expert Consultation' directly through our Courses page. It connects you directly with our senior developers and tech founders for personalized guidance, project architecture reviews, or career roadmap planning.",
  },
];

function SupportPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [ticketSubmitted, setTicketSubmitted] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "course_support",
    priority: "normal",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate support ticket submission
    setTicketSubmitted(true);
  };

  const filteredFaqs = FAQS.filter((faq) => {
    if (selectedCategory === "All") return true;
    return faq.category === selectedCategory;
  });

  return (
    <div className="grid-field min-h-dvh px-5 pb-24 pt-28 md:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 border-b border-border pb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-primary/10 text-primary border border-primary/20">
              <Headphones className="w-3.5 h-3.5" />
              Help Center & Support Desk
            </span>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Systems Operational (SLA &lt; 2 hrs)
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            How can we help you?
          </h1>
          <p className="mt-4 max-w-3xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Get prompt assistance for your courses, enterprise software engagements, technical seminars, and general inquiries.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <a
            href={`mailto:${contact.email}`}
            className="p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-sm hover:border-primary/50 hover:bg-card/70 transition-all duration-200 group"
          >
            <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-foreground mb-1">Email Support</h2>
            <p className="text-xs text-muted-foreground mb-3">Direct response within 2-4 business hours</p>
            <span className="text-xs font-mono text-primary group-hover:underline break-all">
              {contact.email}
            </span>
          </a>

          <a
            href={contact.phoneHref}
            className="p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-sm hover:border-primary/50 hover:bg-card/70 transition-all duration-200 group"
          >
            <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Phone className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-foreground mb-1">Phone Line</h2>
            <p className="text-xs text-muted-foreground mb-3">{contact.hours}</p>
            <span className="text-xs font-mono text-primary group-hover:underline">
              {contact.phone}
            </span>
          </a>

          <a
            href="https://wa.me/message/P565IMYLCIDBG1"
            target="_blank"
            rel="noreferrer"
            className="p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-sm hover:border-emerald-500/50 hover:bg-card/70 transition-all duration-200 group"
          >
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-foreground mb-1">WhatsApp Chat</h2>
            <p className="text-xs text-muted-foreground mb-3">Instant messaging for rapid queries</p>
            <span className="text-xs font-mono text-emerald-400 group-hover:underline">
              Chat on WhatsApp &rarr;
            </span>
          </a>

          <div className="p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-sm">
            <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-foreground mb-1">Innovation Centers</h2>
            <p className="text-xs text-muted-foreground mb-2">Bhilai HQ & Bengaluru Cloud HQ</p>
            <span className="text-[11px] font-mono text-muted-foreground">
              UDYAM-CG-05-0057895
            </span>
          </div>
        </div>

        {/* 2 Columns: Submit Ticket & FAQ Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Support Ticket Submission */}
          <div className="lg:col-span-5 bg-card/50 backdrop-blur-md border border-border rounded-2xl p-6 sm:p-8">
            <div className="mb-6">
              <span className="text-xs font-mono text-primary uppercase">Direct Resolution</span>
              <h2 className="text-2xl font-bold text-foreground mt-1">Submit a Support Ticket</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Our support team will review your inquiry and get back to you promptly.
              </p>
            </div>

            {ticketSubmitted ? (
              <div className="p-8 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-center space-y-4 animate-in fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-foreground">Support Ticket Created!</h3>
                <p className="text-xs text-muted-foreground">
                  Ticket reference #GSAI-{Math.floor(100000 + Math.random() * 900000)} has been logged. We will contact you at {formData.email || "your email"} shortly.
                </p>
                <button
                  onClick={() => {
                    setTicketSubmitted(false);
                    setFormData({ name: "", email: "", topic: "course_support", priority: "normal", message: "" });
                  }}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
                >
                  Submit Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Praveen Sai"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background/60 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background/60 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Topic Area
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full px-3 py-2.5 bg-background/60 border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="course_support">Course & LMS Support</option>
                      <option value="enterprise_ai">Enterprise AI Software</option>
                      <option value="seminar">Technical Seminar</option>
                      <option value="billing">Billing & Certification</option>
                      <option value="other">General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Priority Level
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3 py-2.5 bg-background/60 border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="normal">Normal (24 hrs)</option>
                      <option value="high">High (4 hrs)</option>
                      <option value="urgent">Urgent / Production</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Message / Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Please explain how we can assist you..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background/60 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-md"
                >
                  <Send className="w-4 h-4" />
                  Submit Support Ticket
                </button>
              </form>
            )}
          </div>

          {/* FAQs Accordion */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-mono text-primary uppercase">Knowledge Base</span>
              <h2 className="text-2xl font-bold text-foreground mt-1">Frequently Asked Questions</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Find quick answers to common questions about courses, certifications, and enterprise services.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {["All", "General", "Courses & LMS", "Enterprise AI & Services", "Certificates & MSME"].map((cat) => (
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

            <div className="space-y-3">
              {filteredFaqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-xl border border-border bg-card/30 backdrop-blur-sm overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-foreground hover:text-primary transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 border-t border-border/50 text-xs sm:text-sm text-muted-foreground leading-relaxed animate-in fade-in">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card/20 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Need in-depth technical documentation?</h3>
                <p className="text-xs text-muted-foreground">Browse our complete engineering and platform manuals.</p>
              </div>
              <Link
                to="/documentation"
                className="px-4 py-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted transition-colors shrink-0"
              >
                Read Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
