import imgTechnicalSeminar from "@/assets/technical-seminar.jpg";
import imgAiSoftware from "@/assets/ai-driven-software-solutions.jpg";
import imgFullstackWeb from "@/assets/website-development-full-stack.jpg";
import imgDigitalMarketing from "@/assets/digital-marketing.jpg";
import imgSocialMedia from "@/assets/social-media-management.jpg";
import imgRobotics from "@/assets/robotics.jpg";
import imgEnhancedCourses from "@/assets/enhanced-courses.jpg";

import imgAiTools from "@/assets/ai-tools.jpg";
import imgAiMastery from "@/assets/ai-mastery.jpg";
import imgPythonMastery from "@/assets/python-mastery.jpg";
import imgMachineLearning from "@/assets/machine-learning.jpg";
import imgDevopsTraining from "@/assets/devops-live-training.jpg";
import imgExpertConsultation from "@/assets/expert-consultation.jpg";

import { company, contact, courses, services } from "@/data/siteContent";

const serviceImageMap: Record<string, string> = {
  "technical-seminar": imgTechnicalSeminar,
  "ai-driven-software-solutions": imgAiSoftware,
  "website-development-full-stack": imgFullstackWeb,
  "digital-marketing": imgDigitalMarketing,
  "social-media-management": imgSocialMedia,
  robotics: imgRobotics,
  "enhanced-courses": imgEnhancedCourses,
};

const courseImageMap: Record<string, string> = {
  "ai-tools": imgAiTools,
  "ai-mastery": imgAiMastery,
  "python-mastery": imgPythonMastery,
  "machine-learning": imgMachineLearning,
  "devops-live-training": imgDevopsTraining,
  "expert-consultation": imgExpertConsultation,
};

const allCovers = [
  imgTechnicalSeminar,
  imgAiSoftware,
  imgFullstackWeb,
  imgDigitalMarketing,
  imgSocialMedia,
  imgRobotics,
  imgEnhancedCourses,
  imgAiTools,
  imgAiMastery,
  imgPythonMastery,
  imgMachineLearning,
  imgDevopsTraining,
  imgExpertConsultation,
];

export type Project = {
  slug: string;
  title: string;
  client: string;
  category: "Services" | "Courses";
  year: string;
  location: string;
  cover: string;
  ratio: "portrait" | "landscape";
  excerpt: string;
  body: string[];
  credits: { role: string; name: string }[];
  gallery: string[];
};

const serviceEntries: Project[] = services.map((s, i) => {
  const coverImg = serviceImageMap[s.slug] || allCovers[i % allCovers.length]!;
  return {
    slug: s.slug,
    title: s.title,
    client: company.name,
    category: "Services",
    year: "Service",
    location: "India",
    cover: coverImg,
    ratio: i % 2 === 0 ? "portrait" : "landscape",
    excerpt: s.description,
    body: [
      s.description,
      `${company.name} delivers this work as part of a wider practice spanning AI-driven software, full-stack development and enterprise solutions.`,
      `To scope a ${s.title.toLowerCase()} engagement, write to ${contact.email} or call ${contact.phone}.`,
    ],
    credits: [
      { role: "Offering", name: s.title },
      { role: "Delivered by", name: company.name },
      { role: "Availability", name: contact.hours },
    ],
    gallery: [
      coverImg,
      allCovers[(i + 2) % allCovers.length]!,
      allCovers[(i + 4) % allCovers.length]!,
    ],
  };
});

const courseEntries: Project[] = courses.map((c, i) => {
  const coverImg = courseImageMap[c.slug] || allCovers[(i + 7) % allCovers.length]!;
  return {
    slug: c.slug,
    title: c.title,
    client: `${c.price} — Course`,
    category: "Courses",
    year: c.price,
    location: "Online",
    cover: coverImg,
    ratio: i % 2 === 0 ? "landscape" : "portrait",
    excerpt: c.description,
    body: [
      c.description,
      `Enrolment for ${c.title} is listed at ${c.price} on the Getsetai Innovations course catalogue.`,
      `Questions before enrolling? Email ${contact.email} — the team replies ${contact.hours}.`,
    ],
    credits: [
      { role: "Course", name: c.title },
      { role: "Price", name: c.price },
      { role: "Enrol", name: c.url },
    ],
    gallery: [
      coverImg,
      allCovers[(i + 1) % allCovers.length]!,
      allCovers[(i + 5) % allCovers.length]!,
    ],
  };
});

export const projects: Project[] = [...serviceEntries, ...courseEntries];

export const categories = ["All", "Services", "Courses"] as const;

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function nextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length]!;
}
