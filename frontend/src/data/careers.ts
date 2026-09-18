export type JobListing = {
  title: string;
  type: string;
  location: string;
  applyHref: string;
};

export const careersHero = {
  badge: "We're hiring — Join Getsetai",
  title: "Plan your career",
  description:
    "We are always looking for passionate individuals to help us build cutting edge digital solutions. Join Getsetai Innovations today.",
  subline: "Fast-track your career: internships, dev roles, and remote positions.",
  applyFormHref: "https://forms.gle/jY6U79KkcWjd1HbB9",
};

export const jobs: JobListing[] = [
  {
    title: "Software Development SDE 1 Intern",
    type: "Internship",
    location: "Remote",
    applyHref: "https://forms.gle/jY6U79KkcWjd1HbB9",
  },
  {
    title: "UI UX Designer Intern",
    type: "Internship",
    location: "Remote",
    applyHref: "https://forms.gle/jY6U79KkcWjd1HbB9",
  },
  {
    title: "Project Manager",
    type: "Full-Time",
    location: "Remote",
    applyHref: "https://forms.gle/jY6U79KkcWjd1HbB9",
  },
];
