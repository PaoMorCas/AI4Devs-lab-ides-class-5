import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, ThemeProvider, createTheme } from '@mui/material';
import Dashboard from './components/Dashboard';
import AddCandidate from './components/AddCandidate';

const theme = createTheme();

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Container>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/add-candidate" element={<AddCandidate />} />
                    </Routes>
                </Container>
            </Router>
        </ThemeProvider>
    );
}

export default App;
