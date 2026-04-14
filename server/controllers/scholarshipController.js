
import prisma from "../config/prisma.js";
import { 
  getAllScholarships as fetchScholarshipsFromService,
  getScholarshipById as fetchScholarshipByIdFromService
} from "../services/scholarshipService.js";

// @desc    Get all scholarships (with search, filter, sort, pagination)
// @route   GET /api/scholarships
// @access  Public
export const getAllScholarships = async (req, res) => {
  try {
    const {
      keyword,
      source,
      category,    // caste: General, OBC, SC, ST, EWS
      state,       // domicile state
      gender,      // Male, Female, All
      minAmount,
      maxAmount,
      sortBy = 'createdAt',   // createdAt | amount | deadline | relevance
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // --- Build WHERE clause ---
    const where = {};

    // By default, only show active (non-expired) scholarships
    if (!req.query.includeExpired) {
      where.deadline = { gt: new Date() };
    }

    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { provider: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } }
      ];
    }

    if (source) where.source = source;

    // Category / Caste filter: match scholarships open to this caste OR to "All"
    if (category) {
      where.OR = [
        ...(where.OR || []),
        ...[]
      ];
      // We override the logic here using AND to not break keyword search
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { categoryEligible: { has: category } },
            { categoryEligible: { has: 'All' } },
            { categoryEligible: { isEmpty: true } }
          ]
        }
      ];
    }

    // State domicile filter
    if (state) {
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { state: { equals: state, mode: 'insensitive' } },
            { state: 'All' },
            { state: null }
          ]
        }
      ];
    }

    // Gender filter
    if (gender) {
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { gender: { equals: gender, mode: 'insensitive' } },
            { gender: 'All' },
            { gender: null }
          ]
        }
      ];
    }

    // Amount range
    if (minAmount || maxAmount) {
      const amountFilter = {};
      if (minAmount) amountFilter.gte = parseFloat(minAmount);
      if (maxAmount) amountFilter.lte = parseFloat(maxAmount);
      where.amount = amountFilter;
    }

    // --- Order By ---
    let orderBy = [{ createdAt: 'desc' }];
    if (sortBy === 'amount') orderBy = [{ amount: sortOrder }];
    else if (sortBy === 'deadline') orderBy = [{ deadline: 'asc' }]; // soonest first
    else if (sortBy === 'relevance') {
      // Relevance sort: amount DESC as primary, deadline ASC as secondary (good proxy)
      orderBy = [{ amount: 'desc' }, { deadline: 'asc' }, { createdAt: 'desc' }];
    }

    const [scholarships, total] = await Promise.all([
      prisma.scholarship.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy
      }),
      prisma.scholarship.count({ where })
    ]);

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
    console.error("[getAllScholarships Error]:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


// @desc    Get a single scholarship by ID
// @route   GET /api/scholarships/:id
// @access  Public
export const getScholarshipById = async (req, res) => {
  try {
    const scholarship = await fetchScholarshipByIdFromService(req.params.id);

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
// @access  Private/Admin
export const createScholarship = async (req, res) => {
  try {
    const newScholarship = await prisma.scholarship.create({
      data: req.body
    });
    res.status(201).json({ success: true, data: newScholarship });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Update a scholarship
// @route   PUT /api/scholarships/:id
// @access  Private/Admin
export const updateScholarship = async (req, res) => {
  try {
    const scholarship = await prisma.scholarship.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.status(200).json({ success: true, data: scholarship });
  } catch (error) {
    if (error.code === 'P2025') {
       return res.status(404).json({ success: false, message: "Scholarship not found" });
    }
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Get personalized scholarship recommendations
// @route   GET /api/scholarships/recommendations
// @access  Private (Student)
export const getRecommendations = async (req, res) => {
  try {
    // req.user is populated by prisma via isAuthenticated middleware
    const student = req.user;
    if (!student) {
      return res.status(401).json({ success: false, message: "Student profile not found" });
    }

    const { income, category, state, gender, academicPercentage } = student;

    // Base filters: Only active, verified, and not already applied by this student
    const appliedScholarshipIds = await prisma.application.findMany({
      where: { studentId: student.id },
      select: { scholarshipId: true }
    }).then(apps => apps.map(a => a.scholarshipId));

    const where = {
      id: { notIn: appliedScholarshipIds },
      deadline: { gt: new Date() },
    };

    // Advanced Indian Eligibility Matching
    const andFilters = [];

    // 1. Income Filter
    if (income !== null && income !== undefined) {
      andFilters.push({
        OR: [
          { maxIncome: { gte: income } },
          { maxIncome: null },
          { maxIncome: { isSet: false } }
        ]
      });
    }

    // 2. Academic Merit Filter
    if (academicPercentage !== null && academicPercentage !== undefined) {
      andFilters.push({
        OR: [
          { minPercentage: { lte: academicPercentage } },
          { minPercentage: null },
          { minPercentage: { isSet: false } }
        ]
      });
    }

    // 3. Category (Caste/EWS) Filter
    if (category) {
      andFilters.push({
        OR: [
          { categoryEligible: { has: category } },
          { categoryEligible: { has: 'All' } },
          { categoryEligible: { isEmpty: true } }
        ]
      });
    }

    // 4. State Domicile Filter
    if (state) {
      andFilters.push({
        OR: [
          { state: { equals: state, mode: 'insensitive' } },
          { state: "All" },
          { state: null },
          { state: { isSet: false } }
        ]
      });
    }

    // 5. Gender Filter
    if (gender) {
      andFilters.push({
        OR: [
          { gender: { equals: gender, mode: 'insensitive' } },
          { gender: "All" },
          { gender: null },
          { gender: { isSet: false } }
        ]
      });
    }

    if (andFilters.length > 0) {
      where.AND = andFilters;
    }

    const eligibleScholarships = await prisma.scholarship.findMany({
      where,
      take: 50,
      orderBy: [
        { amount: 'desc' }
      ]
    });

    // Score and Rank Algorithm
    const scored = eligibleScholarships.map(sch => {
        // Base match score for being eligible (passing the 'where' filters)
        let score = 15;
        const matchReasons = [];

        // 0. Base reason (every eligible scholarship has a base match basis)
        if (sch.source === 'GOVERNMENT') matchReasons.push("Govt Verified");
        else if (sch.source === 'CORPORATE_CSR') matchReasons.push("CSR Match");

        // 1. Geography specific bonus
        if (sch.state && sch.state !== "All") {
            if (student.state && sch.state.toLowerCase() === student.state.toLowerCase()) {
                score += 30;
                matchReasons.push("State Match");
            } else if (student.state) {
                score -= 50; 
            }
        }
        
        // 2. Category specific bonus
        if (sch.categoryEligible && sch.categoryEligible.length > 0 && !sch.categoryEligible.includes('All')) {
            if (student.category && sch.categoryEligible.includes(student.category)) {
                score += 25;
                matchReasons.push(`${student.category} Match`);
            } else if (student.category) {
                score -= 30;
            }
        } else {
            matchReasons.push("Open to All");
        }

        // 3. Gender specific bonus
        if (sch.gender && sch.gender !== "All") {
            if (student.gender && sch.gender.toLowerCase() === student.gender.toLowerCase()) {
                score += 20;
                matchReasons.push("Gender Match");
            } else if (student.gender) {
                score -= 40;
            }
        }

        // 4. Academic Merit bonus
        if (sch.minPercentage && student.academicPercentage) {
            if (student.academicPercentage >= sch.minPercentage + 15) {
                score += 15;
                matchReasons.push("High Merit");
            } else if (student.academicPercentage >= sch.minPercentage) {
                score += 5;
                matchReasons.push("Merit Match");
            }
        } else if (!sch.minPercentage) {
            matchReasons.push("No Min Marks");
        }

        // 5. Financial Eligibility
        if (sch.maxIncome) {
            if (student.income !== null && student.income <= sch.maxIncome) {
                matchReasons.push("Income Match");
                if (student.income <= sch.maxIncome * 0.5) {
                    score += 10;
                    matchReasons.push("Highly Eligible");
                }
            }
        }
        
        // 6. Urgency bonus
        if (sch.deadline) {
            const daysLeft = (new Date(sch.deadline) - new Date()) / (1000 * 60 * 60 * 24);
            if (daysLeft > 0 && daysLeft <= 14) {
                score += 10;
                matchReasons.push("Closing Soon");
            }
        }

        return { ...sch, matchScore: Math.round(Math.max(5, score)), matchReasons: [...new Set(matchReasons)].slice(0, 3) };
    });

    // Sort by score first, then by deadline (with safety check for missing deadlines)
    scored.sort((a, b) => {
        const scoreDiff = b.matchScore - a.matchScore;
        if (scoreDiff !== 0) return scoreDiff;
        
        const dateA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
        const dateB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
        return dateA - dateB;
    });

    const recommendations = scored.slice(0, 6);

    res.status(200).json({
      success: true,
      count: recommendations.length,
      totalMatches: scored.length,
      data: recommendations
    });
  } catch (error) {
    console.error("Matchmaking Error:", error);
    res.status(500).json({ success: false, message: "Recommendation engine failed", error: error.message });
  }
};
// @desc    Delete a scholarship
// @route   DELETE /api/scholarships/:id
// @access  Private/Admin
export const deleteScholarship = async (req, res) => {
  try {
    await prisma.scholarship.delete({
      where: { id: req.params.id }
    });

    res.status(200).json({ success: true, message: "Scholarship removed successfully", data: {} });
  } catch (error) {
    if (error.code === 'P2025') {
       return res.status(404).json({ success: false, message: "Scholarship not found" });
    }
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
