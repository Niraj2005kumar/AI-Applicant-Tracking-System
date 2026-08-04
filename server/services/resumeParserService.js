import fs from "fs";
import path from "path";
import { extractResumeText } from "./resumeTextExtractor.js";

const normalizeText = (text = "") =>
  text
    .replace(/\r\n/g, "\n")
    .replace(/\s+/g, " ")
    .trim();

const normalizeItem = (value = "") => {
  if (!value) return "";

  return value
    .toString()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^[\-•*\d.\s]+/, "")
    .trim();
};

const dedupeList = (items = []) => {
  const seen = new Set();
  return (items || [])
    .map((item) => normalizeItem(item))
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const extractYears = (text = "") => {
  const patterns = [
    /(\d+)\s*(?:\+\s*)?years?/i,
    /(\d+)\s*(?:\+\s*)?yrs?/i,
    /experience\s*[:\-]\s*(\d+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return Number(match[1]);
    }
  }

  return 0;
};

const extractSkills = (text = "") => {
  const skillSectionRegex = /skills?[:\-](.+)/i;
  const match = text.match(skillSectionRegex);
  if (match?.[1]) {
    const raw = match[1];
    const parts = raw.split(/[,;|]/).map(normalizeItem).filter(Boolean);
    return dedupeList(parts);
  }

  return [];
};

const extractEducation = (text = "") => {
  const lines = text
    .split(/\n|\.|;/)
    .map(normalizeItem)
    .filter(Boolean);

  const educationKeywords = [
    "b.tech",
    "bachelor",
    "bachelors",
    "master",
    "masters",
    "m.tech",
    "mca",
    "phd",
    "diploma",
    "associate",
    "computer science",
    "engineering",
    "university",
    "college",
    "degree",
  ];

  const matched = lines.filter((line) =>
    educationKeywords.some((keyword) => line.toLowerCase().includes(keyword))
  );

  return dedupeList(matched);
};

const extractProjects = (text = "") => {
  const lines = text
    .split(/\n|\.|;/)
    .map(normalizeItem)
    .filter(Boolean);

  const projectKeywords = [
    "built",
    "developed",
    "created",
    "designed",
    "project",
    "application",
    "website",
    "platform",
    "system",
  ];

  const matches = lines.filter((line) =>
    projectKeywords.some((keyword) => line.toLowerCase().includes(keyword))
  );

  return dedupeList(matches).slice(0, 8);
};

const extractCertifications = (text = "") => {
  const lines = text
    .split(/\n|\.|;/)
    .map(normalizeItem)
    .filter(Boolean);

  const certKeywords = ["certified", "certificate", "certification", "aws", "azure"];
  const matches = lines.filter((line) =>
    certKeywords.some((keyword) => line.toLowerCase().includes(keyword))
  );

  return dedupeList(matches);
};

const extractJobTitles = (text = "") => {
  const titleMatches = text.match(/([A-Z][A-Za-z&/.-]+(?:\s+[A-Z][A-Za-z&/.-]+){0,3})/g) || [];
  const titles = titleMatches
    .map(normalizeItem)
    .filter((item) => item.length > 2 && !/^(The|And|For|With|Skills|Experience)$/i.test(item));

  return dedupeList(titles).slice(0, 8);
};

const parseResumeText = (resumeText = "") => {
  try {
    const cleanedText = normalizeText(resumeText);

    if (!cleanedText) {
      return {
        skills: [],
        experience: { years: 0 },
        education: [],
        projects: [],
        certifications: [],
        jobTitles: [],
      };
    }

    return {
      skills: extractSkills(cleanedText),
      experience: {
        years: extractYears(cleanedText),
      },
      education: extractEducation(cleanedText),
      projects: extractProjects(cleanedText),
      certifications: extractCertifications(cleanedText),
      jobTitles: extractJobTitles(cleanedText),
    };
  } catch (error) {
    console.error("Resume parsing failed:", error);
    return {
      skills: [],
      experience: { years: 0 },
      education: [],
      projects: [],
      certifications: [],
      jobTitles: [],
    };
  }
};

export const parseResumeForCandidate = async ({ resumePath, userProfile }) => {
  let resumeText = "";
  let parsedResume = {
    skills: [],
    experience: { years: 0 },
    education: [],
    certifications: [],
    projects: [],
    jobTitles: [],
  };

  if (resumePath) {
    const normalizedPath = resumePath.startsWith("/") ? resumePath.slice(1) : resumePath;
    const absolutePath = path.join(process.cwd(), normalizedPath);

    if (fs.existsSync(absolutePath)) {
      const extraction = await extractResumeText(resumePath);
      if (extraction.success) {
        resumeText = extraction.resumeText;
      }
    }
  }

  if (resumeText) {
    parsedResume = parseResumeText(resumeText);
  } else if (userProfile) {
    parsedResume = {
      skills: dedupeList(userProfile.skills || []),
      experience: { years: Number(userProfile.experience) || 0 },
      education: dedupeList(userProfile.education ? [userProfile.education] : []),
      certifications: [],
      projects: [],
      jobTitles: [],
    };
  }

  return {
    resumeText,
    parsedResume,
  };
};

export { parseResumeText };
