const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

const aliasTopTours = (req, res, next) => {
  req.query = {
    ...req.query,
    limit: '5',
    sort: '-ratingsAverage,price',
    fields: 'name,price,ratingsAverage,summary,difficulty'
  };
  next();
};
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
// );

// const checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);
//
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID'
//     });
//   }
//   next();
// };

// const checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price'
//     });
//   }
//   next();
// };

const getAllTours = async (req, res) => {
  try {
    console.log('req.query', req.query);
    const feature = new APIFeatures(Tour.find(), req.query);
    feature
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await feature.query;

    res.status(200).json({
      status: 'success', results: tours.length, data: {
        tours
      }
    });
  } catch (err) {
    console.error(`ERROR - ${err.message}`);
    res.status(404).json({
      status: 'fail', message: err.message || err
    });
  }
};

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success', data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail', message: err
    });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success', data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail', message: err
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    res.status(200).json({
      status: 'success', data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail', message: err
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success', data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail', message: err
    });
  }
};

const getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 }
      }
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);
    res.status(200).json({
      status: 'success', data: {
        stats
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail', message: err
    });
  }
};

const getMonthlyPlan = async (req, res) => {
  try {
    const { year } = req.params;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStarts: -1 }
      },
      {
        $limit: 12
      }
    ]);
    res.status(200).json({
      status: 'success', data: {
        plan
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail', message: err
    });
  }
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan
};