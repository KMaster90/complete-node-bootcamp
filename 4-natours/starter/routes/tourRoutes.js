const express = require('express');
const {
  createTour,
  deleteTour,
  getAllTours,
  updateTour,
  getTour,

  aliasTopTours,
  getTourStats,
  getMonthlyPlan
  // checkID,
  // checkBody
} = require('../controllers/tourController');

const router = express.Router();

// router.param('id', checkID);

router.route('/top-5-cheap')
  .get(aliasTopTours, getAllTours);

router.route('/tour-stats')
  .get(getTourStats);

router.route('/monthly-plan/:year')
  .get(getMonthlyPlan);

router.route('/')
  .get(getAllTours)
  .post(createTour);
// .post(checkBody, createTour);

router.route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
