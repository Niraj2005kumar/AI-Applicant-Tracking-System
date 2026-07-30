import fs from "fs";
import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

// Comprehensive Tech Skills Dictionary for extraction
const TECH_SKILLS_DICTIONARY = [
  "javascript", "typescript", "python", "java", "c++", "c#", "ruby", "php", "go", "rust", "scala", "kotlin", "swift",
  "html", "css", "sass", "less", "react", "angular", "vue", "next.js", "nuxt.js", "svelte", "jquery", "bootstrap", "tailwind",
  "node.js", "express", "django", "flask", "fastapi", "spring boot", "laravel", "rails", "asp.net", "graphql", "apollo",
  "mongodb", "postgresql", "mysql", "sqlite", "redis", "cassandra", "elasticsearch", "firebase", "oracle", "mariadb",
  "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "github actions", "gitlab ci", "terraform", "ansible",
  "git", "github", "gitlab", "bitbucket", "jira", "confluence", "slack", "trello",
  "machine learning", "deep learning", "nlp", "computer vision", "tensorflow", "pytorch", "keras", "scikit-learn", "pandas", "numpy",
  "agile", "scrum", "kanban", "devops", "ci/cd", "rest api", "soap", "microservices", "system design"
];

// Common ATS Keywords for ranking
const ATS_KEYWORDS = [
  "problem solving", "communication", "teamwork", "leadership", "collaboration", "analytical", "critical thinking",
  "project management", "software engineer", "frontend developer", "backend developer", "full stack", "cloud architect",
  "database administrator", "qa automation", "testing", "scalability", "performance tuning", "optimization"
];

/**
 * Extract text from PDF resume file
 * @param {string} relativeFilePath Relative path to the uploaded file (e.g. /uploads/filename.pdf)
 * @returns {Promise<string>} Extracted text
 */
export const extractTextFromPDF = async (relativeFilePath) => {
  try {
    const absolutePath = path.join(process.cwd(), relativeFilePath.startsWith("/") ? relativeFilePath.slice(1) : relativeFilePath);
    
    if (!fs.existsSync(absolutePath)) {
      console.warn(`File not found at: ${absolutePath}`);
      return "";
    }

    const fileBuffer = fs.readFileSync(absolutePath);
    const data = await pdfParse(fileBuffer);
    return data.text || "";
  } catch (error) {
    console.error("Error parsing PDF resume:", error);
    return "";
  }
};

/**
 * Parse raw text to extract structured details
 * @param {string} text Raw resume text
 * @returns {object} Extracted skills, experience, education, etc.
 */
export const parseResumeText = (text) => {
  if (!text) {
    return {
      skills: [],
      experience: 0,
      education: "Not Specified",
      certifications: [],
      projects: [],
      keywords: []
    };
  }

  const cleanText = text.toLowerCase();
  
  // 1. Extract Skills
  const extractedSkills = [];
  TECH_SKILLS_DICTIONARY.forEach(skill => {
    // Exact word boundaries matching to avoid sub-word matching (e.g. "go" matching "google")
    const regex = new RegExp(`\\b${skill.replace(".", "\\.")}\\b`, "i");
    if (regex.test(cleanText)) {
      // Capitalize the first letters for display
      const formattedSkill = skill.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      extractedSkills.push(formattedSkill);
    }
  });

  // 2. Extract Experience (Years of Experience)
  let extractedExperience = 0;
  // Match patterns like: "5 years", "3+ years", "4 yrs", "experience: 7 years"
  const expRegexes = [
    /(\d+)\+?\s*years?\s+(?:of\s+)?experience/gi,
    /experience\s*:\s*(\d+)\+?\s*years?/gi,
    /(\d+)\+?\s*yrs?/gi,
    /working\s+for\s+(\d+)\+?\s*years?/gi
  ];

  for (const regex of expRegexes) {
    const match = regex.exec(cleanText);
    if (match && match[1]) {
      const yrs = parseInt(match[1], 10);
      if (yrs > extractedExperience && yrs < 45) { // Cap at 45 to avoid high false positives
        extractedExperience = yrs;
      }
    }
  }

  // Fallback check if years of experience isn't explicitly written but dates exist
  if (extractedExperience === 0) {
    const yearMatches = cleanText.match(/\b(20\d{2})\b/g);
    if (yearMatches && yearMatches.length >= 2) {
      const uniqueYears = [...new Set(yearMatches.map(Number))].sort((a, b) => a - b);
      const span = uniqueYears[uniqueYears.length - 1] - uniqueYears[0];
      if (span > 0 && span < 30) {
        extractedExperience = span;
      }
    }
  }

  // 3. Extract Education Level
  let extractedEducation = "Bachelor's Degree"; // Default fallback
  if (/\bphd\b|\bph\.d\b|doctor of philosophy/i.test(cleanText)) {
    extractedEducation = "Ph.D.";
  } else if (/\bmaster\b|\bmasters\b|\bmsc\b|\bm\.tech\b|\bmca\b|\bm\.s\b\b/i.test(cleanText)) {
    extractedEducation = "Master's Degree";
  } else if (/\bbachelor\b|\bbachelors\b|\bb\.tech\b|\bbe\b|\bb\.s\b|\bbca\b|\bbs\b/i.test(cleanText)) {
    extractedEducation = "Bachelor's Degree";
  } else if (/\bdiploma\b|\bassociate\b/i.test(cleanText)) {
    extractedEducation = "Associate Degree / Diploma";
  } else if (/\bhigh school\b/i.test(cleanText)) {
    extractedEducation = "High School";
  }

  // 4. Extract Certifications
  const certs = [];
  const certKeywords = ["certified", "certification", "certifications", "credential"];
  const lines = text.split("\n");
  lines.forEach(line => {
    if (certKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
      const cleanLine = line.trim();
      if (cleanLine.length > 10 && cleanLine.length < 100 && !cleanLine.includes(":") && !cleanLine.includes("?")) {
        certs.push(cleanLine);
      }
    }
  });

  // 5. Extract Projects
  const projects = [];
  const projectKeywords = ["project", "portfolio", "personal application", "developed a", "built a"];
  lines.forEach(line => {
    if (projectKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
      const cleanLine = line.trim();
      if (cleanLine.length > 15 && cleanLine.length < 120 && !cleanLine.includes("experience") && projects.length < 5) {
        projects.push(cleanLine);
      }
    }
  });

  // 6. Extract matching keywords
  const matchedKeywords = [];
  ATS_KEYWORDS.forEach(keyword => {
    if (cleanText.includes(keyword)) {
      matchedKeywords.push(keyword.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "));
    }
  });

  return {
    skills: extractedSkills,
    experience: extractedExperience || 1, // Default 1 year if parsed as 0
    education: extractedEducation,
    certifications: certs.slice(0, 5),
    projects: projects.slice(0, 5),
    keywords: matchedKeywords
  };
};

/**
 * Compare resume with job description and return matching scores
 * @param {object} parsedResume Extracted structured resume details
 * @param {object} job Mongoose Job document
 * @returns {object} Calculated scores and recommendation
 */
export const matchResumeWithJob = (parsedResume, job) => {
  if (!job) {
    return {
      atsScore: 50,
      matchPercentage: 50,
      skillMatch: 50,
      experienceMatch: 50,
      recommendation: "Neutral",
      keywords: parsedResume.keywords
    };
  }

  const jobRequiredSkills = job.skills || [];
  const candidateSkills = parsedResume.skills || [];

  // 1. Skill Match Score (50% weight)
  let skillMatchScore = 100;
  if (jobRequiredSkills.length > 0) {
    const matchedSkills = jobRequiredSkills.filter(reqSkill =>
      candidateSkills.some(candSkill => candSkill.toLowerCase() === reqSkill.toLowerCase())
    );
    skillMatchScore = Math.round((matchedSkills.length / jobRequiredSkills.length) * 100);
  }

  // 2. Experience Match Score (30% weight)
  const requiredExp = job.experience || 0;
  const candidateExp = parsedResume.experience || 0;
  let experienceMatchScore = 100;

  if (requiredExp > 0) {
    if (candidateExp >= requiredExp) {
      experienceMatchScore = 100;
    } else {
      experienceMatchScore = Math.round((candidateExp / requiredExp) * 100);
    }
  }

  // 3. Education Match Score (10% weight)
  // Simple check: higher degrees score higher
  let educationMatchScore = 70;
  const eduLower = parsedResume.education.toLowerCase();
  if (eduLower.includes("ph.d")) {
    educationMatchScore = 100;
  } else if (eduLower.includes("master")) {
    educationMatchScore = 95;
  } else if (eduLower.includes("bachelor")) {
    educationMatchScore = 85;
  } else if (eduLower.includes("diploma") || eduLower.includes("associate")) {
    educationMatchScore = 75;
  }

  // 4. Keyword Match Score (10% weight)
  const matchedKeywords = parsedResume.keywords || [];
  const keywordMatchScore = Math.min(100, matchedKeywords.length * 15 + 40); // Base 40, +15 per keyword match

  // Calculate overall weighted ATS score
  const atsScore = Math.round(
    (skillMatchScore * 0.5) +
    (experienceMatchScore * 0.3) +
    (educationMatchScore * 0.1) +
    (keywordMatchScore * 0.1)
  );

  // Recommendations
  let recommendation = "Neutral";
  if (atsScore >= 80) {
    recommendation = "Highly Recommended";
  } else if (atsScore >= 60) {
    recommendation = "Recommended";
  } else if (atsScore >= 40) {
    recommendation = "Neutral";
  } else {
    recommendation = "Not Recommended";
  }

  return {
    atsScore,
    matchPercentage: atsScore,
    skillMatch: skillMatchScore,
    experienceMatch: experienceMatchScore,
    recommendation,
    keywords: matchedKeywords
  };
};
