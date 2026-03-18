import Scholarship from "../models/Scholarship.js";
import { getAllScholarships as fetchScholarshipsFromService } from "../services/scholarshipService.js";

// @desc    Get all scholarships (with search, filter, pagination)
// @route   GET /api/scholarships
// @access  Public
export const getAllScholarships = async (req, res) => {
  try {
    const { keyword, type, amount, page = 1, limit = 10 } = req.query;

    let scholarships = await fetchScholarshipsFromService();

    // Search by keyword in title or provider
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      scholarships = scholarships.filter(s => 
        s.title?.toLowerCase().includes(lowerKeyword) || 
        s.source?.toLowerCase().includes(lowerKeyword)
      );
    }

    // Filter by type (searching in eligibility)
    if (type) {
      const lowerType = type.toLowerCase();
      scholarships = scholarships.filter(s => 
        s.eligibility?.toLowerCase().includes(lowerType)
      );
    }

    const total = scholarships.length;

    // Pagination basics
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const startIndex = (pageNumber - 1) * limitNumber;

    // Sort by scrapedAt descending
    scholarships.sort((a, b) => new Date(b.scrapedAt) - new Date(a.scrapedAt));

    const paginatedScholarships = scholarships.slice(startIndex, startIndex + limitNumber);

    res.status(200).json({
      success: true,
      count: paginatedScholarships.length,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / limitNumber),
        limit: limitNumber
      },
      data: paginatedScholarships
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Get a single scholarship by ID
// @route   GET /api/scholarships/:id
// @access  Public
export const getScholarshipById = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
      return res.status(404).json({ success: false, message: "Scholarship not found" });
    }

    res.status(200).json({ success: true, data: scholarship });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Create a new scholarship
// @route   POST /api/scholarships
// @access  Private/Admin (Assuming route level protection later)
export const createScholarship = async (req, res) => {
  try {
    const newScholarship = await Scholarship.create(req.body);
    res.status(201).json({ success: true, data: newScholarship });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Update a scholarship
// @route   PUT /api/scholarships/:id
// @access  Private/Admin
export const updateScholarship = async (req, res) => {
  try {
    let scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
      return res.status(404).json({ success: false, message: "Scholarship not found" });
    }

    scholarship = await Scholarship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: scholarship });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Delete a scholarship
// @route   DELETE /api/scholarships/:id
// @access  Private/Admin
export const deleteScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
      return res.status(404).json({ success: false, message: "Scholarship not found" });
    }

    await scholarship.deleteOne();

    res.status(200).json({ success: true, message: "Scholarship removed successfully", data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
