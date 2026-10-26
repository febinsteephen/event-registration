import Event from '../models/event_model.js';

// get all events
export const getEvents = async (req, res) => {
  try {
    const all_evts = await Event.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: all_evts.length, data: all_evts });
  } catch (err) {
    console.log('Error getting events:', err.message);
    res.status(500).json({ success: false, message: 'Failed to get events' });
  }
};

// get single event by id
export const getEventById = async (req, res) => {
  try {
    const single_evt = await Event.findById(req.params.id);
    if (!single_evt) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: single_evt });
  } catch (e) {
    res.status(400).json({ success: false, message: 'Invalid id' });
  }
};

// create new event
export const createEvent = async (req, res) => {
  try {
    const { name, description, date, venue, totalRegistrations } = req.body;

  // check required fields
  if (!name || !description || !date || !venue) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields'
      });
  }

    const created_item = await Event.create({
      name: name.trim(),
      description: description.trim(),
      date,
      venue: venue.trim(),
      totalRegistrations: Number(totalRegistrations) || 0
    });

    res.status(201).json({ success: true, data: created_item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// update existing event
export const updateEvent = async (req, res) => {
  try {
    const { name, description, date, venue, totalRegistrations } = req.body;

    let upData = {};
    if (name !== undefined) upData.name = name.trim();
    if (description !== undefined) upData.description = description.trim();
    if (date !== undefined) upData.date = date;
    if (venue !== undefined) upData.venue = venue.trim();
    if (totalRegistrations !== undefined) {
      upData.totalRegistrations = Math.max(0, Number(totalRegistrations));
    }

    const updated = await Event.findByIdAndUpdate(req.params.id, upData, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// delete event
export const deleteEvent = async (req, res) => {
  try {
    const del_res = await Event.findByIdAndDelete(req.params.id);
    if (!del_res) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: 'Could not delete' });
  }
};

// register +1 attendee
export const registerForEvent = async (req, res) => {
  try {
    const item = await Event.findByIdAndUpdate(
      req.params.id,
      { $inc: { totalRegistrations: 1 } },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({ success: true, data: item });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};
