const mongoose = require('mongoose');

// Schema
const schema = mongoose.Schema({
  create_date: {
    type: Date,
    default: Date.now,
  },
  shop_name: {
    type: String,
    required: true,
  },
  oldShop: {
    type: Boolean,
    required: true,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  selling_brands: {
    type: String,
    required: true,
  },
  selling_capacity: {
    type: String,
    required: true,
  },
  percent_ev_easyBike: {
    type: String,
    required: true,
  },
  preferred_payment: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  geoLocation: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('clients', schema);
