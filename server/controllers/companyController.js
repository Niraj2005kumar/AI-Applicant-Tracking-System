import mongoose from "mongoose";
import Company from "../models/Company.js";

const isValidCompanyId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createCompany = async (req, res) => {
  try {
    const {
      name,
      logo,
      website,
      industry,
      description,
      location,
      companySize,
      foundedYear,
    } = req.body;

    const existingCompany = await Company.findOne({
      name,
      owner: req.user.id,
    });

    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message: "Company already exists.",
      });
    }

    const company = await Company.create({
      name,
      logo,
      website,
      industry,
      description,
      location,
      companySize,
      foundedYear,
      owner: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Company created successfully.",
      company,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    if (!isValidCompanyId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company id.",
      });
    }

    const company = await Company.findById(req.params.id).populate(
      "owner",
      "name email"
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateCompany = async (req, res) => {
  try {
    if (!isValidCompanyId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company id.",
      });
    }

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    if (company.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Company updated successfully.",
      company: updatedCompany,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    if (!isValidCompanyId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company id.",
      });
    }

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    if (company.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    await company.deleteOne();

    res.status(200).json({
      success: true,
      message: "Company deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};