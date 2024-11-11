import React, { useState } from 'react';
import { TextField, Button, Typography, Snackbar, IconButton, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface Education {
    institution: string;
    startDate: string;
    endDate: string;
    degree: string;
    description?: string;
}

interface Experience {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    responsibilities: string;
}

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    education: Education[];
    experience: Experience[];
    resume?: File | null;
}

const AddCandidate: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        education: [{ institution: '', degree: '', startDate: '', endDate: '', description: '' }],
        experience: [{ company: '', position: '', startDate: '', endDate: '', responsibilities: '' }],
        resume: null,
    });
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, type: 'education' | 'experience') => {
        const { name, value } = e.target;
        const updatedData = { ...formData };
        if (type === 'education') {
            updatedData.education[index] = { ...updatedData.education[index], [name]: value };
        } else {
            updatedData.experience[index] = { ...updatedData.experience[index], [name]: value };
        }
        setFormData(updatedData);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData({ ...formData, resume: file });
    };

    const addEducation = () => {
        setFormData({
            ...formData,
            education: [
                ...formData.education,
                { institution: '', degree: '', startDate: '', endDate: '', description: '' },
            ],
        });
    };

    const addExperience = () => {
        setFormData({
            ...formData,
            experience: [...formData.experience, { company: '', position: '', startDate: '', endDate: '', responsibilities: '' }],
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Crear un objeto en lugar de FormData
        const dataToSubmit = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            education: formData.education.map((edu) => ({
                ...edu,
                startDate: edu.startDate ? new Date(edu.startDate).toISOString() : null,
                endDate: edu.endDate ? new Date(edu.endDate).toISOString() : null,
            })),
            experience: formData.experience.map((exp) => ({
                ...exp,
                startDate: exp.startDate ? new Date(exp.startDate).toISOString() : null,
                endDate: exp.endDate ? new Date(exp.endDate).toISOString() : null,
            })),
        };

        if (!dataToSubmit.email.includes('@')) {
            setErrorMessage('El correo electrónico no es válido');
            setOpen(true);
            return;
        }

        try {
            const response = await fetch('http://localhost:3010/api/candidates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Establecer el tipo de contenido
                },
                body: JSON.stringify(dataToSubmit), // Convertir el objeto a JSON
            });
            
            if (!response.ok) throw new Error('Error al añadir candidato');
            setSuccessMessage('Candidato añadido exitosamente!');
            setOpen(true);
        } catch (error: any) {
            setErrorMessage(error.message);
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const removeEducation = (index: number) => {
        const updatedEducation = formData.education.filter((_, i) => i !== index);
        setFormData({ ...formData, education: updatedEducation });
    };

    const removeExperience = (index: number) => {
        const updatedExperience = formData.experience.filter((_, i) => i !== index);
        setFormData({ ...formData, experience: updatedExperience });
    };


    return (
        <form onSubmit={handleSubmit} style={{ padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <Typography variant="h4" style={{ marginBottom: '20px', color: '#333' }}>Añadir Candidato</Typography>

            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Datos Personales</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField 
    label="Nombre" 
    name="firstName" 
    value={formData.firstName} 
    onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
    fullWidth 
    variant="outlined" 
/>

<TextField 
    label="Apellido" 
    name="lastName" 
    value={formData.lastName} 
    onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
    fullWidth 
    variant="outlined" 
/>

<TextField 
    label="Correo Electrónico" 
    name="email" 
    value={formData.email} 
    onChange={(e) => setFormData({...formData, email: e.target.value})} 
    fullWidth 
    variant="outlined" 
/>

<TextField 
    label="Teléfono" 
    name="phone" 
    value={formData.phone} 
    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
    fullWidth 
    variant="outlined" 
/>

<TextField 
    label="Dirección" 
    name="address" 
    value={formData.address} 
    onChange={(e) => setFormData({...formData, address: e.target.value})} 
    fullWidth 
    variant="outlined" 
/>
                    </Box>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Educación</Typography>
                </AccordionSummary>
                <AccordionDetails>
                {formData.education.map((edu, index) => (
    <Box key={index} mb={2} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
            label="Institución"
            name="institution"
            value={edu.institution}
            onChange={(e) => {
                const updatedEducation = [...formData.education];
                updatedEducation[index].institution = e.target.value;
                setFormData({ ...formData, education: updatedEducation });
            }}
            fullWidth
            variant="outlined"
        />
        <TextField
            label="Grado"
            name="degree"
            value={edu.degree}
            onChange={(e) => {
                const updatedEducation = [...formData.education];
                updatedEducation[index].degree = e.target.value;
                setFormData({ ...formData, education: updatedEducation });
            }}
            fullWidth
            variant="outlined"
        />
        <TextField
            label="Fecha de Inicio"
            name="startDate"
            type="date"
            value={edu.startDate}
            onChange={(e) => {
                const updatedEducation = [...formData.education];
                updatedEducation[index].startDate = e.target.value;
                setFormData({ ...formData, education: updatedEducation });
            }}
            fullWidth
            variant="outlined"
        />
        <TextField
            label="Fecha de Finalización"
            name="endDate"
            type="date"
            value={edu.endDate}
            onChange={(e) => {
                const updatedEducation = [...formData.education];
                updatedEducation[index].endDate = e.target.value;
                setFormData({ ...formData, education: updatedEducation });
            }}
            fullWidth
            variant="outlined"
        />
        <IconButton onClick={() => removeEducation(index)}><RemoveIcon /></IconButton>
    </Box>
))}

                    <Button onClick={addEducation} startIcon={<AddIcon />} variant="contained" color="primary">Añadir Educación</Button>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Experiencia Laboral</Typography>
                </AccordionSummary>
                <AccordionDetails>
                {formData.experience.map((exp, index) => (
    <Box key={index} mb={2} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
            label="Empresa"
            name="company"
            value={exp.company}
            onChange={(e) => {
                const updatedExperience = [...formData.experience];
                updatedExperience[index].company = e.target.value;
                setFormData({ ...formData, experience: updatedExperience });
            }}
            fullWidth
            variant="outlined"
        />
        <TextField
            label="Cargo"
            name="position"
            value={exp.position}
            onChange={(e) => {
                const updatedExperience = [...formData.experience];
                updatedExperience[index].position = e.target.value;
                setFormData({ ...formData, experience: updatedExperience });
            }}
            fullWidth
            variant="outlined"
        />
        <TextField
            label="Fecha de Inicio"
            name="startDate"
            type="date"
            value={exp.startDate}
            onChange={(e) => {
                const updatedExperience = [...formData.experience];
                updatedExperience[index].startDate = e.target.value;
                setFormData({ ...formData, experience: updatedExperience });
            }}
            fullWidth
            variant="outlined"
        />
        <TextField
            label="Fecha de Finalización"
            name="endDate"
            type="date"
            value={exp.endDate}
            onChange={(e) => {
                const updatedExperience = [...formData.experience];
                updatedExperience[index].endDate = e.target.value;
                setFormData({ ...formData, experience: updatedExperience });
            }}
            fullWidth
            variant="outlined"
        />
        <IconButton onClick={() => removeExperience(index)}><RemoveIcon /></IconButton>
    </Box>
))}

                    <Button onClick={addExperience} startIcon={<AddIcon />} variant="contained" color="primary">Añadir Experiencia</Button>
                </AccordionDetails>
            </Accordion>
            {/* <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Currículum</Typography>
    </AccordionSummary>
    <AccordionDetails>
        <Box mb={2} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <input
                type="file"
                accept=".pdf, .doc, .docx"
                onChange={handleFileChange}
                name="resume"
                id="resume"
            />
        </Box>
    </AccordionDetails>
</Accordion> */}


            <Box mt={2}>
                <Button type="submit" variant="contained" color="primary">Guardar</Button>
            </Box>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={errorMessage ? "error" : "success"}>
                    {errorMessage || successMessage || "Candidato añadido exitosamente!"}
                </Alert>
            </Snackbar>
        </form>
    );
};

export default AddCandidate;
