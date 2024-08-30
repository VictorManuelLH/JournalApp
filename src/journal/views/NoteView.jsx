import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { DeleteOutline, QuestionAnswerOutlined, SaveOutlined, UploadOutlined, EmojiSymbols } from "@mui/icons-material";
import { Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.js';
import { ImageGallery, DrawerPreguntas, DrawerSymbols } from "../components";
import { useForm } from "../../hooks/useForm";
import { setActiveNote, startCleanConversation, startDeletingNote, startQuestion, startSaveNote, startUploadFiles } from "../../store/journal";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarToday } from '@mui/icons-material';

export const NoteView = () => {
    const dispatch = useDispatch();
    const { active: note, messageSaved, isSaving, openAIResponse } = useSelector(state => state.journal);
    const { body, title, date, onInputChange, formState } = useForm(note);
    const dateString = useMemo(() => format(new Date(date), 'dd MMMM yyyy, h:mm a', { locale: es }), [date]);
    const fileInputRef = useRef();

    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [isSymbolDrawerOpen, setSymbolDrawerOpen] = useState(false);
    const [questionText, setQuestionText] = useState('');
    const [conversation, setConversation] = useState(note?.conversation || []);

    useEffect(() => {
        dispatch(setActiveNote(formState));
        if (messageSaved.length > 0) {
            Swal.fire('Nota actualizada', messageSaved, 'success');
        }
    }, [formState, messageSaved, dispatch]);

    useEffect(() => {
        if (openAIResponse) {
            const updatedConversation = [...conversation, { role: 'assistant', content: openAIResponse }];
            setConversation(updatedConversation);
            dispatch(setActiveNote({
                ...note,
                conversation: updatedConversation
            }));
        }
    }, [openAIResponse]);

    useEffect(() => {
        if (note) {
            setConversation(note.conversation || []);
        }
    }, [note]);
    
    useEffect(() => {
        if (note) {
            localStorage.setItem('activeNote', JSON.stringify(note));
        }
    }, [note]);    

    const onSaveNote = () => {
        dispatch(startSaveNote());
    };

    const onOpenDrawer = () => setDrawerOpen(true);
    const onCloseDrawer = () => setDrawerOpen(false);
    const onOpenSymbolDrawer = () => setSymbolDrawerOpen(true);
    const onCloseSymbolDrawer = () => setSymbolDrawerOpen(false);

    const onFileInputChange = ({ target }) => {
        if (target.files.length === 0) return;
        dispatch(startUploadFiles(target.files));
    };

    const onInputQuestion = () => {
        if (questionText.trim().length === 0) return;
    
        const updatedConversation = [...conversation, { role: 'user', content: questionText }];
        setConversation(updatedConversation);
    
        const updatedNote = {
            ...note,
            conversation: updatedConversation
        };
    
        dispatch(setActiveNote(updatedNote));
        dispatch(startQuestion(questionText));

        setQuestionText('');
    };
    
    const onDelete = () => {
        dispatch(startDeletingNote());
    };

    const handleImageDelete = (image) => {
        const updatedImages = note.imageUrls.filter(img => img !== image);
        dispatch(setActiveNote({ ...note, imageUrls: updatedImages }));
    };

    const onClearConversation = () => {
        dispatch(startCleanConversation());
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
                <Button disabled={isSaving} onClick={onOpenSymbolDrawer} color="primary" sx={{ padding: 2 }}>
                    <EmojiSymbols sx={{ fontSize: 30, mr: 1 }} />
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

            {/* Drawer para Preguntas */}
            <DrawerPreguntas 
                isDrawerOpen={isDrawerOpen}
                onCloseDrawer={onCloseDrawer}
                questionText={questionText} 
                setQuestionText={setQuestionText} 
                onInputQuestion={onInputQuestion} 
                conversation={conversation}
                onClearConversation={onClearConversation}
            />

            {/* Drawer para Símbolos */}
            <DrawerSymbols 
                isSymbolDrawerOpen={isSymbolDrawerOpen} 
                onCloseSymbolDrawer={onCloseSymbolDrawer} 
            />
        </Grid>
    );
};
