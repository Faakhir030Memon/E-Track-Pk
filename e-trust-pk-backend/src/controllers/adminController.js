const Store = require('../models/Store');
const TrustScore = require('../models/TrustScore');

/**
 * Get all stores for admin
 * GET /api/v1/admin/stores
 */
const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find().select('-password');
    res.json({
      success: true,
      data: stores,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error fetching stores.' });
  }
};

/**
 * Approve or deactivate a store
 * PATCH /api/v1/admin/stores/:id
 */
const updateStoreStatus = async (req, res) => {
  try {
    const { isApproved, isActive, plan, expiryDate } = req.body;
    
    const updateData = {};
    if (isApproved !== undefined) updateData.isApproved = isApproved;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (plan) updateData['subscription.plan'] = plan;
    if (expiryDate) updateData['subscription.expiryDate'] = expiryDate;
    
    if (isApproved === true) {
      updateData['subscription.status'] = 'active';
      // If no expiry date provided, default to 30 days
      if (!expiryDate) {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        updateData['subscription.expiryDate'] = date;
      }
    }

    const store = await Store.findByIdAndUpdate(req.params.id, updateData, { new: true });
    
    res.json({
      success: true,
      data: store,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error updating store.' });
  }
};

/**
 * Get all fraud reports for admin
 * GET /api/v1/admin/reports
 */
const getAllReports = async (req, res) => {
  try {
    const reports = await TrustScore.find({ 'reportedByStores.0': { $exists: true } });
    res.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error fetching reports.' });
  }
};

module.exports = { getAllStores, updateStoreStatus, getAllReports };
