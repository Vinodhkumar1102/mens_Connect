const BloodRequest = require('../models/BloodRequestModel');
const mongoose = require('mongoose');

/**
 * GET /api/blood-requests?userId=<phone>
 * List blood requests by userId (user sees only their own requests)
 * For admin: GET /api/blood-requests (no userId filter) - shows all requests
 */
exports.listAll = async (req, res) => {
  try {
    const { userId } = req.query;
    
    // If userId is provided, filter by that user (mobile app request)
    // If no userId, return all requests (admin panel request)
    const filter = { isActive: true };
    if (userId) {
      filter.userId = userId;
    }
    
    const data = await BloodRequest.find(filter)
      .sort({ createdAt: -1 });

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blood requests',
    });
  }
};

/**
 * POST /api/blood-requests
 * Create new blood request
 */
exports.create = async (req, res) => {
  try {
    const {
      fullName,
      bloodGroup,
      hospital,
      contact,
      location,
      urgency,
      additionalNotes,
      userId,
    } = req.body;

    // Basic validation
    if (!fullName || !bloodGroup || !hospital || !contact || !location) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing',
      });
    }

    const request = await BloodRequest.create({
      fullName,
      bloodGroup,
      hospital,
      contact,
      location,
      urgency,
      additionalNotes,
      userId,
    });

    res.status(201).json({
      success: true,
      message: 'Blood request created successfully',
      data: request,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * GET /api/blood-requests/:id
 * Get blood request by ID
 */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID',
      });
    }

    const data = await BloodRequest.findById(id);

    if (!data || !data.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found',
      });
    }

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch request',
    });
  }
};

/**
 * PUT /api/blood-requests/:id
 * Update blood request by ID
 */
exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID',
      });
    }

    const updated = await BloodRequest.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found',
      });
    }

    res.json({
      success: true,
      message: 'Blood request updated successfully',
      data: updated,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * DELETE /api/blood-requests/:id
 * Soft delete blood request
 */
exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID',
      });
    }

    const deleted = await BloodRequest.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found',
      });
    }

    res.json({
      success: true,
      message: 'Blood request deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete request',
    });
  }
};

/**
 * PATCH /api/blood-requests/:id
 * Update blood request status (approve/decline)
 */
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approvedBy } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID',
      });
    }

    // Validate status
    if (!['pending', 'approved', 'declined'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, approved, or declined',
      });
    }

    // Update the request
    const updateData = {
      status,
    };

    if (status === 'approved') {
      updateData.approvedAt = new Date();
      updateData.approvedBy = approvedBy || 'admin';
    }

    const data = await BloodRequest.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found',
      });
    }

    res.json({
      success: true,
      message: `Blood request ${status} successfully`,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update request status',
      error: err.message,
    });
  }
};

// Count pending blood requests
exports.countPending = async (req, res) => {
  try {
    const pendingCount = await BloodRequest.countDocuments({ status: 'pending' });
    res.json({
      success: true,
      count: pendingCount,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to count pending requests',
      error: err.message,
    });
  }
};

