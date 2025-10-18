import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../services/AuthContext';
import LoginForm from '../components/LoginForm';
import Dashboard from '../components/Dashboard';
import { Container, Box, CircularProgress } from '@mui/material';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      {user ? <Dashboard /> : <LoginForm />}
    </Container>
  );
}