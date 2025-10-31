import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Card, CardContent, CardHeader, Typography, Box, 
  Paper, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert
} from '@mui/material';
import {
  EventAvailable, MedicalServices, CalendarToday, Pending, CheckCircle, Cancel
} from '@mui/icons-material';

function DashboardHome({ patientInfo }) {
  // 1. Hardcoded doctor details
  const hardcodedDoctors = [
    { _id: 'doc1', name: 'Dr. A. Sharma', specialization: 'Cardiologist', consultation_fee: 600 },
    { _id: 'doc2', name: 'Dr. B. Verma', specialization: 'Dermatologist', consultation_fee: 500 },
    { _id: 'doc3', name: 'Dr. C. Chakraborty', specialization: 'Pediatrician', consultation_fee: 550 }
  ];

  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [openAppointmentDialog, setOpenAppointmentDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newAppointment, setNewAppointment] = useState({
    doctor: '',
    appointment_date: '',
    appointment_time: '',
    symptoms: ''
  });

  useEffect(() => {
    setPrescriptions([]); // Use backend later
    setAppointments([]);  // Use backend later
  }, [patientInfo]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Update appointments state on booking
  const scheduleAppointment = (e) => {
    e.preventDefault();
    const selectedDoctor = hardcodedDoctors.find(d => d._id === newAppointment.doctor);
    if (!selectedDoctor) {
      showSnackbar('Selected doctor not found', 'error');
      return;
    }
    // Construct new appointment object
    const newAppObj = {
      _id: `appt_${Date.now()}`,
      doctor: { name: selectedDoctor.name, specialization: selectedDoctor.specialization },
      appointment_date: newAppointment.appointment_date,
      appointment_time: newAppointment.appointment_time,
      consultation_fee: selectedDoctor.consultation_fee,
      symptoms: newAppointment.symptoms,
      status: "pending"
    };
    setAppointments(prev => [...prev, newAppObj]);
    showSnackbar('Appointment booked successfully!');
    setOpenAppointmentDialog(false);
    setNewAppointment({ doctor: '', appointment_date: '', appointment_time: '', symptoms: '' });
  };

  const getAppointmentStatusColor = (status) => {
    const colors = { pending: 'warning', confirmed: 'info', completed: 'success', cancelled: 'error' };
    return colors[status] || 'default';
  };

  const getAppointmentStatusIcon = (status) => {
    const icons = { pending: <Pending />, confirmed: <CheckCircle />, completed: <CheckCircle />, cancelled: <Cancel /> };
    return icons[status] || <Pending />;
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#1a237e' }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your appointments and prescriptions
        </Typography>
      </Box>
      {/* Quick Action Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<EventAvailable />}
          onClick={() => setOpenAppointmentDialog(true)}
          sx={{
            px: 4, py: 1.5, borderRadius: 2,
            background: 'linear-gradient(135deg, #1e5dbc 0%, #2196f3 100%)',
            boxShadow: '0 4px 15px rgba(30, 93, 188, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
              boxShadow: '0 6px 20px rgba(30, 93, 188, 0.4)'
            }
          }}
        >
          Book New Appointment
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Prescriptions */}
        <Grid colSpan={{ xs: 12, lg: 6 }}>
          <Card elevation={0} sx={{
            height: '100%',
            border: '1px solid #e3f2fd',
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(30, 93, 188, 0.08)'
          }}>
            <CardHeader
              sx={{
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                borderBottom: '1px solid #e3f2fd'
              }}
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MedicalServices sx={{ color: '#1976d2' }} />
                  <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600 }}>
                    My Prescriptions
                  </Typography>
                  <Chip
                    label={prescriptions.length}
                    size="small"
                    sx={{
                      bgcolor: '#2196f3',
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </Box>
              }
            />
            <CardContent sx={{ maxHeight: 600, overflow: 'auto', p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {prescriptions.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <MedicalServices sx={{ fontSize: 60, color: '#e0e0e0', mb: 2 }} />
                    <Typography color="text.secondary" variant="h6">
                      No prescriptions yet
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Appointments */}
        <Grid colSpan={{ xs: 12, lg: 6 }}>
          <Card elevation={0} sx={{
            height: '100%',
            border: '1px solid #e8f5e9',
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(76, 175, 80, 0.08)'
          }}>
            <CardHeader
              sx={{
                background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                borderBottom: '1px solid #e8f5e9'
              }}
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday sx={{ color: '#4caf50' }} />
                  <Typography variant="h6" sx={{ color: '#1b5e20', fontWeight: 600 }}>
                    My Appointments
                  </Typography>
                  <Chip
                    label={appointments.length}
                    size="small"
                    sx={{
                      bgcolor: '#4caf50',
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </Box>
              }
            />
            <CardContent sx={{ maxHeight: 600, overflow: 'auto', p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {appointments.map(appointment => (
                  <Paper
                    key={appointment._id}
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      border: '1px solid #e8f5e9',
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(76, 175, 80, 0.12)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 600 }} gutterBottom>
                          {appointment.doctor?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {appointment.doctor?.specialization}
                        </Typography>
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                          <Grid colSpan={{ xs: 6 }}>
                            <Typography variant="body2">
                              <strong>Date:</strong> {new Date(appointment.appointment_date).toLocaleDateString()}
                            </Typography>
                          </Grid>
                          <Grid colSpan={{ xs: 6 }}>
                            <Typography variant="body2">
                              <strong>Time:</strong> {appointment.appointment_time}
                            </Typography>
                          </Grid>
                          <Grid colSpan={{ xs: 12 }}>
                            <Typography variant="body2">
                              <strong>Fee:</strong> ${appointment.consultation_fee}
                            </Typography>
                          </Grid>
                        </Grid>
                        {appointment.symptoms && (
                          <Box sx={{ mt: 2, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Symptoms:</strong> {appointment.symptoms}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <Chip
                        icon={getAppointmentStatusIcon(appointment.status)}
                        label={appointment.status}
                        color={getAppointmentStatusColor(appointment.status)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Paper>
                ))}
                {appointments.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <CalendarToday sx={{ fontSize: 60, color: '#e0e0e0', mb: 2 }} />
                    <Typography color="text.secondary" variant="h6">
                      No appointments scheduled
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Book Appointment Dialog */}
      <Dialog
        open={openAppointmentDialog}
        onClose={() => setOpenAppointmentDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(30, 93, 188, 0.2)'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #1e5dbc 0%, #2196f3 100%)',
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EventAvailable sx={{ mr: 1 }} />
            Book New Appointment
          </Box>
        </DialogTitle>
        <form onSubmit={scheduleAppointment}>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl fullWidth required>
                <InputLabel>Select Doctor</InputLabel>
                <Select
                  value={newAppointment.doctor}
                  label="Select Doctor"
                  onChange={(e) => setNewAppointment({ ...newAppointment, doctor: e.target.value })}
                >
                  {hardcodedDoctors.map(doctor => (
                    <MenuItem key={doctor._id} value={doctor._id}>
                      {doctor.name} {doctor.specialization ? `- ${doctor.specialization}` : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Appointment Date"
                type="date"
                value={newAppointment.appointment_date}
                onChange={(e) => setNewAppointment({ ...newAppointment, appointment_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />
              <TextField
                label="Appointment Time"
                type="time"
                value={newAppointment.appointment_time}
                onChange={(e) => setNewAppointment({ ...newAppointment, appointment_time: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />
              <TextField
                label="Symptoms (Optional)"
                value={newAppointment.symptoms}
                onChange={(e) => setNewAppointment({ ...newAppointment, symptoms: e.target.value })}
                multiline
                rows={3}
                fullWidth
                placeholder="Describe your symptoms..."
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpenAppointmentDialog(false)} sx={{ color: '#666' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #1e5dbc 0%, #2196f3 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
                }
              }}
            >
              Book Appointment
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar always present, never conditional */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity || 'info'}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message || ""}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default DashboardHome;
