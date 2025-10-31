import React from 'react';
import {
  Container, Grid, Card, CardContent, Typography, Box,
  Button, Chip, Snackbar, Alert
} from '@mui/material';
import {
  CalendarToday, CheckCircle, Cancel, AccessTime, AttachMoney
} from '@mui/icons-material';


function MyAppointments({ doctorInfo, appointments, setAppointments }) {
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  const updateAppointmentStatus = (appointmentId, status) => {
    setAppointments(prev =>
      prev.map(a => a._id === appointmentId ? { ...a, status } : a)
    );
    showSnackbar(`Appointment ${status}${status === 'confirmed' ? ' and patient assigned' : ''}`);
  };

  const getStatusColor = (status) => {
    const colors = { pending: 'warning', confirmed: 'info', completed: 'success', cancelled: 'error' };
    return colors[status] || 'default';
  };

  // SHOW ONLY THIS DOCTOR'S APPOINTMENTS:
  const myAppointments = appointments.filter(app => app.doctor_id === doctorInfo.id);

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#1a237e' }}>
          My Appointments
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your scheduled appointments
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {myAppointments.map((appointment) => (
          <Grid item xs={12} sm={6} lg={4} key={appointment._id}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid #e8f5e9',
                borderRadius: 3,
                boxShadow: '0 2px 12px rgba(76, 175, 80, 0.08)',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 6px 20px rgba(76, 175, 80, 0.15)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 600 }}>
                    {appointment.patient?.user?.name}
                  </Typography>
                  <Chip
                    label={appointment.status}
                    color={getStatusColor(appointment.status)}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday sx={{ fontSize: 18, color: '#666' }} />
                    <Typography variant="body2">
                      {new Date(appointment.appointment_date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime sx={{ fontSize: 18, color: '#666' }} />
                    <Typography variant="body2">
                      {appointment.appointment_time}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachMoney sx={{ fontSize: 18, color: '#666' }} />
                    <Typography variant="body2">
                      ${appointment.consultation_fee}
                    </Typography>
                  </Box>
                </Box>
                {appointment.symptoms && (
                  <Box sx={{ p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="600">
                      Symptoms:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {appointment.symptoms}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CheckCircle />}
                    onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                    disabled={appointment.status === 'confirmed' || appointment.status === 'completed'}
                    sx={{ flex: 1 }}
                  >Confirm</Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<CheckCircle />}
                    onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                    disabled={appointment.status === 'completed'}
                    sx={{ flex: 1, background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)' }}
                  >Complete</Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    startIcon={<Cancel />}
                    onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                    disabled={appointment.status === 'cancelled'}
                    sx={{ flex: 1 }}
                  >Cancel</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {myAppointments.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CalendarToday sx={{ fontSize: 80, color: '#e0e0e0', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No appointments scheduled
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity || 'info'}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message || ''}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default MyAppointments;
