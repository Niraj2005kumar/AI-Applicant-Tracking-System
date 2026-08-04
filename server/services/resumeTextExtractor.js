import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const normalizeText = (text = "") => {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[\t\u00a0]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n /g, "\n")
    .replace(/ \n/g, "\n")
    .trim();
};

export const extractResumeText = async (resumePath) => {
  if (!resumePath) {
    return {
      success: false,
      message: "No resume path provided.",
      resumeText: "",
    };
  }

  const normalizedPath = resumePath.startsWith("/") ? resumePath.slice(1) : resumePath;
  const absolutePath = path.join(process.cwd(), normalizedPath);

  if (!fs.existsSync(absolutePath)) {
    return {
      success: false,
      message: "Resume file was not found.",
      resumeText: "",
    };
  }

  try {
    const extension = path.extname(absolutePath).toLowerCase();

    if (extension === ".pdf") {
      const fileBuffer = fs.readFileSync(absolutePath);
      const data = await pdfParse(fileBuffer);
      return {
        success: true,
        resumeText: normalizeText(data.text || ""),
      };
    }

    if (extension === ".docx") {
      const fileBuffer = fs.readFileSync(absolutePath);
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return {
        success: true,
        resumeText: normalizeText(result.value || ""),
      };
    }

    if (extension === ".doc") {
      return {
        success: false,
        message: "DOC format is not supported for text extraction in this implementation.",
        resumeText: "",
      };
    }

    return {
      success: false,
      message: "Unsupported resume format.",
      resumeText: "",
    };
  } catch (error) {
    console.error("Resume extraction failed:", error);
    return {
      success: false,
      message: "Unable to extract text from the uploaded resume.",
      resumeText: "",
    };
  }
};
