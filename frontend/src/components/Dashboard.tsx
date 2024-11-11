import React from 'react';
import { Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
    return (
        <div>
            <Typography variant="h4">Dashboard</Typography>
            <Button variant="contained" color="primary" component={Link} to="/add-candidate">
                Añadir Candidato
            </Button>
        </div>
    );
};

export default Dashboard;
