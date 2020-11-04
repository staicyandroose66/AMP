const mongoose = require('mongoose');


  const EntrySchema = mongoose.Schema({
      url: String,
      statuscheck: String,
      uptime:Number
  }, {
      timestamps: true
  });
  
  module.exports = mongoose.model('Entry', EntrySchema);


