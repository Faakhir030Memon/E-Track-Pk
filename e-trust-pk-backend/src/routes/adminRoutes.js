const express = require('express');
const router = express.Router();
const { authenticate, authorizeAdmin } = require('../middlewares/auth');
const { getAllStores, updateStoreStatus, getAllReports } = require('../controllers/adminController');

// All routes here are protected and require admin role
router.use(authenticate);
router.use(authorizeAdmin);

router.get('/stores', getAllStores);
router.patch('/stores/:id', updateStoreStatus);
router.get('/reports', getAllReports);

module.exports = router;
