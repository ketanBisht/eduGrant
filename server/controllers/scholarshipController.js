import Scholarship from "../models/Scholarship.js";

// @desc    Get all scholarships (with search, filter, pagination)
// @route   GET /api/scholarships
// @access  Public
export const getAllScholarships = async (req, res) => {
  try {
    const { keyword, type, amount, page = 1, limit = 10 } = req.query;

    const query = {};

    // Search by keyword in title or provider
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { provider: { $regex: keyword, $options: "i" } }
      ];
    }

    // Filter by type (searching in eligibility_criteria since schema lacks 'type' field)
    if (type) {
      query.eligibility_criteria = { $regex: type, $options: "i" };
    }

    // Filter by amount
    if (amount) {
      // Assuming exact amount filter, or could parse as a minimum amount e.g. amount >= value
      query.amount = { $gte: Number(amount) };
    }

    // Pagination basics
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const startIndex = (pageNumber - 1) * limitNumber;

    const total = await Scholarship.countDocuments(query);
    const scholarships = await Scholarship.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limitNumber);

    res.status(200).json({
      success: true,
      count: scholarships.length,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / limitNumber),
        limit: limitNumber
      },
      data: scholarships
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
