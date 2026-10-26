import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
      minlength: [2, 'Event name must have at least 2 characters'],
      maxlength: [100, 'Event name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    date: {
      type: Date,
      required: [true, 'Event date is required']
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true
    },
    totalRegistrations: {
      type: Number,
      default: 0,
      min: [0, 'Registrations count cannot be negative']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

eventSchema.virtual('displayId').get(function () {
  return `EVT-${this._id.toString().slice(-6).toUpperCase()}`;
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
