const normalizeText = (value) =>
  (value || "")
    .toString()
    .toLowerCase()
    .trim();

const normalizeSkillList = (items = []) =>
  (Array.isArray(items) ? items : [])
    .map((item) => item.toString().trim().toLowerCase())
    .filter(Boolean);

const getEducationScore = (education = "") => {
  const edu = normalizeText(education);

  if (edu.includes("ph.d") || edu.includes("doctor")) return 100;
  if (edu.includes("master")) return 95;
  if (edu.includes("bachelor")) return 85;
  if (edu.includes("diploma") || edu.includes("associate")) return 75;
  return 70;
};

export const buildAtsAnalysis = ({ candidateProfile, job }) => {
  const candidateSkills = normalizeSkillList(candidateProfile?.skills || []);
  const requiredSkills = normalizeSkillList(job?.skills || []);
  const candidateExperience = Number(candidateProfile?.experience) || 0;
  const requiredExperience = Number(job?.experience) || 0;
  const candidateEducation = candidateProfile?.education || "";
  const candidateKeywords = normalizeSkillList(candidateProfile?.keywords || []);
  const jobKeywords = normalizeSkillList(job?.keywords || []);

  const matchedSkills = requiredSkills.filter((skill) =>
    candidateSkills.includes(skill)
  );

  const skillMatchScore =
    requiredSkills.length > 0
      ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
      : 100;

  let experienceMatchScore = 100;
  if (requiredExperience > 0) {
    if (candidateExperience >= requiredExperience) {
      experienceMatchScore = 100;
    } else {
      experienceMatchScore = Math.round((candidateExperience / requiredExperience) * 100);
    }
  }

  const educationMatchScore = getEducationScore(candidateEducation);

  const matchedKeywords = candidateKeywords.filter((keyword) =>
    jobKeywords.includes(keyword)
  );

  const keywordMatchScore = Math.min(100, matchedKeywords.length * 15 + 40);

  const atsScore = Math.round(
    skillMatchScore * 0.5 +
      experienceMatchScore * 0.3 +
      educationMatchScore * 0.1 +
      keywordMatchScore * 0.1
  );

  const matchPercentage = atsScore;

  let recommendation = "Neutral";
  if (atsScore >= 80) recommendation = "Highly Recommended";
  else if (atsScore >= 60) recommendation = "Recommended";
  else if (atsScore >= 40) recommendation = "Neutral";
  else recommendation = "Not Recommended";

  const missingSkills = requiredSkills.filter(
    (skill) => !candidateSkills.includes(skill)
  );

  return {
    atsScore,
    matchPercentage,
    skillMatch: skillMatchScore,
    experienceMatch: experienceMatchScore,
    recommendation,
    missingSkills,
    keywords: matchedKeywords,
    matchedSkills,
  };
};
