const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const {
  getAllFarmers,
  getStats,
  addFarmer,
  updateFarmer,
  deleteFarmer
} = require('../controllers/farmer.controller');

router.get('/stats', verifyToken, isAdmin, getStats);
router.get('/', verifyToken, isAdmin, getAllFarmers);
router.post('/', verifyToken, isAdmin, addFarmer);
router.put('/:id', verifyToken, isAdmin, updateFarmer);
router.delete('/:id', verifyToken, isAdmin, deleteFarmer);

module.exports = router;