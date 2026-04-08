import prisma from "../config/prisma.js";

// @desc    Upload a document
// @route   POST /api/vault/upload
// @access  Private (Student)
export const uploadDocument = async (req, res) => {
  try {
    const { type, url, metadata } = req.body;
    const studentId = req.user.id;

    if (!type || !url) {
      return res.status(400).json({ success: false, message: "Document type and URL are required" });
    }

    const document = await prisma.document.create({
      data: {
        studentId,
        type,
        url,
        metadata,
        isVerified: false
      }
    });

    res.status(201).json({ success: true, data: document });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Get all documents for a student
// @route   GET /api/vault
// @access  Private (Student)
export const getStudentDocuments = async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
      where: { studentId: req.user.id }
    });

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Delete a document
// @route   DELETE /api/vault/:id
// @access  Private (Student)
export const deleteDocument = async (req, res) => {
  try {
    const document = await prisma.document.findUnique({
        where: { id: req.params.id }
    });

    if (!document || document.studentId !== req.user.id) {
        return res.status(404).json({ success: false, message: "Document not found" });
    }

    await prisma.document.delete({
      where: { id: req.params.id }
    });

    res.status(200).json({ success: true, message: "Document removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
