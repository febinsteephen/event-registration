import mongoose from 'mongoose';

// event schema
const eventschema = new mongoose.Schema(
  {
  name: {
      type: String,
      required: true,
      trim: true
  },
    description: {
    type: String,
    required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true
    },
    venue: {
        type: String,
        required: true,
      trim: true
    },
  totalRegistrations: {
      type: Number,
      default: 0,
      min: 0
    }
},
{ timestamps: true }
);

const Event = mongoose.model('Event', eventschema);

export default Event;
