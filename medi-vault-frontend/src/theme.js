import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#f4a6b7', // baby pink
      light: '#fbd5e0',
      dark: '#e56e8a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f8bbd0',
    },
    background: {
      default: '#fff0f5', // light pink background
      paper: '#ffe6f0', // soft card background
    },
    text: {
      primary: '#4a2b2b',
      secondary: '#6d4c4c',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
      color: '#4a2b2b',
    },
    body1: {
      color: '#4a2b2b',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          boxShadow: '0 4px 10px rgba(244, 166, 183, 0.4)',
          '&:hover': {
            backgroundColor: '#f28ca8',
          },
        },
      },
    },
  },
});

export default theme;