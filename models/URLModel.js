const mongoose = require('mongoose');
const shortid = require('shortid');

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: [true, 'Please provide a valid URL'],
      validate: {
        validator: function (v) {
          return /^(http|https):\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(v);
        },
        message: 'Please provide a valid URL',
      },
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      default: shortid.generate,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('URL', urlSchema);
