import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { DeleteOutline, QuestionAnswerOutlined, SaveOutlined, UploadOutlined } from "@mui/icons-material";
import { Button, Grid, IconButton, TextField, Typography, Drawer } from "@mui/material";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.js';
import { ImageGallery } from "../components";
import { useForm } from "../../hooks/useForm";
import { setActiveNote, startDeletingNote, startSaveNote, startUploadFiles } from "../../store/journal";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarToday } from '@mui/icons-material';

export const NoteView = () => {
    const dispatch = useDispatch();
    const { active: note, messageSaved, isSaving } = useSelector(state => state.journal);
    const { body, title, date, onInputChange, formState } = useForm(note);
    const dateString = useMemo(() => format(new Date(date), 'dd MMMM yyyy, h:mm a', { locale: es }), [date]);
    const fileInputRef = useRef();

    const [isDrawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        dispatch(setActiveNote(formState));
        if (messageSaved.length > 0) {
            Swal.fire('Nota actualizada', messageSaved, 'success');
        }
    }, [formState, messageSaved, dispatch]);

    const onSaveNote = () => {
        dispatch(startSaveNote());
    };

    const onOpenDrawer = () => {
        setDrawerOpen(true);
    };

    const onCloseDrawer = () => {
        setDrawerOpen(false);
    };

    const onFileInputChange = ({ target }) => {
        if (target.files.length === 0) return;
        dispatch(startUploadFiles(target.files));
    };

    const onDelete = () => {
        dispatch(startDeletingNote());
    };

    const handleImageDelete = (image) => {
        const updatedImages = note.imageUrls.filter(img => img !== image);
        dispatch(setActiveNote({ ...note, imageUrls: updatedImages }));
    };

    return (
        <Grid className="animate__animated animate__fadeIn animate__faster" container direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Grid item>
                <Typography 
                    fontSize={39} 
                    fontWeight="light" 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: 'text.primary', 
                        backgroundColor: 'background.paper', 
                        borderRadius: 2, 
                        padding: 1, 
                        fontSize: { xs: '1.2rem', sm: '1.5rem' } 
                    }}
                >
                    <CalendarToday sx={{ mr: 1 }} />
                    {dateString}
                </Typography>
            </Grid>
            <Grid item>
                <input 
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={onFileInputChange}
                    style={{ display: 'none' }} 
                />
                <IconButton color="primary" disabled={isSaving} onClick={() => fileInputRef.current.click()}>
                    <UploadOutlined />
                </IconButton>
                <Button disabled={isSaving} onClick={onSaveNote} color="primary" sx={{ padding: 2 }}>
                    <SaveOutlined sx={{ fontSize: 30, mr: 1 }} />
                    Guardar
                </Button>
                <Button disabled={isSaving} onClick={onOpenDrawer} color="primary" sx={{ padding: 2 }}>
                    <QuestionAnswerOutlined sx={{ fontSize: 30, mr: 1 }} />
                    Preguntar
                </Button>
            </Grid>
            
            <Grid container>
                <TextField 
                    type="text"
                    variant="filled"
                    fullWidth
                    placeholder="Ingrese un titulo"
                    label="Titulo"
                    sx={{ border: 'none', nb: 1 }}
                    name="title"
                    value={title}
                    onChange={onInputChange}
                />
                <TextField 
                    type="text"
                    variant="filled"
                    fullWidth
                    multiline
                    placeholder="¿Qué sucedió hoy?"
                    minRows={5}
                    name="body"
                    value={body}
                    onChange={onInputChange}
                />
            </Grid>
            <Grid container justifyContent='end'>
                <Button onClick={onDelete} sx={{ mt: 2 }} color="error">
                    <DeleteOutline />
                    Borrar
                </Button>
            </Grid>
            <ImageGallery images={note.imageUrls} onImageDelete={handleImageDelete} />

            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={onCloseDrawer}
                sx={{ width: { xs: '100%', sm: '500px' } }} // Ajustar ancho
            >
                <Grid container direction="column" sx={{ width: { xs: '100%', sm: '500px' }, p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Pregunta Aquí
                    </Typography>
                    <TextField
                        label="Escribe tu pregunta"
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
            </Drawer>

        </Grid>
    );
};
