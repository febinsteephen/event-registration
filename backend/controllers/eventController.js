import Event from '../models/Event.js';

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    console.log('Error getting events:', error.message);
    res.status(500).json({ success: false, message: 'Failed to get events' });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid id' });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { name, description, date, venue, totalRegistrations } = req.body;

    if (!name || !description || !date || !venue) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields'
      });
    }

    const newevent = await Event.create({
      name: name.trim(),
      description: description.trim(),
      date,
      venue: venue.trim(),
      totalRegistrations: Number(totalRegistrations) || 0
    });

    res.status(201).json({ success: true, data: newevent });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { name, description, date, venue, totalRegistrations } = req.body;

    const payload = {};
    if (name !== undefined) payload.name = name.trim();
    if (description !== undefined) payload.description = description.trim();
    if (date !== undefined) payload.date = date;
    if (venue !== undefined) payload.venue = venue.trim();
    if (totalRegistrations !== undefined) {
      payload.totalRegistrations = Math.max(0, Number(totalRegistrations));
    }

    const updated = await Event.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const removed = await Event.findByIdAndDelete(req.params.id);
    if (!removed) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: 'Could not delete' });
  }
};

export const registerForEvent = async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      { $inc: { totalRegistrations: 1 } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};