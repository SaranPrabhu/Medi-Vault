const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  getDoctors
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Routes
router.route('/')
  .get(getAppointments)
  .post(createAppointment);

router.route('/doctors')
  .get(getDoctors);

router.route('/:id')
  .get(getAppointment)
  .put(updateAppointment)
  .delete(deleteAppointment);

module.exports = router;

// POST /appointments
router.post('/', async (req, res) => {
  try {
    const appointment = new Appointment(req.body); // Mongoose model
    await appointment.save();
    res.json({ success: true, appointment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// GET /appointments?patientId=123
router.get('/', async (req, res) => {
  const { patientId, doctorId } = req.query;
  let filter = {};
  if (patientId) filter.patientId = patientId;
  if (doctorId) filter.doctorId = doctorId;
  const appointments = await Appointment.find(filter);
  res.json(appointments);
});
