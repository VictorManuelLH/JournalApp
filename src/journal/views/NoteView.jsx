import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { DeleteOutline, QuestionAnswerOutlined, SaveOutlined, UploadOutlined, Close, EmojiSymbols } from "@mui/icons-material";
import { Button, Grid, IconButton, TextField, Typography, Drawer, Box, List, ListItem, ListItemText } from "@mui/material";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.js';
import { ImageGallery } from "../components";
import { useForm } from "../../hooks/useForm";
import { setActiveNote, startDeletingNote, startQuestion, startSaveNote, startUploadFiles } from "../../store/journal";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarToday } from '@mui/icons-material';

export const NoteView = () => {
    const dispatch = useDispatch();
    const { active: note, messageSaved, isSaving, openAIResponse } = useSelector(state => state.journal);
    const { body, title, date, onInputChange, formState } = useForm(note);
    const dateString = useMemo(() => format(new Date(date), 'dd MMMM yyyy, h:mm a', { locale: es }), [date]);
    const fileInputRef = useRef();

    const [symbols, setSymbols] = useState(['√', '^', 'π']);
    const [newSymbol, setNewSymbol] = useState('');
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [isSymbolDrawerOpen, setSymbolDrawerOpen] = useState(false);
    const [questionText, setQuestionText] = useState('');
    const [conversation, setConversation] = useState(note?.conversation || []);

    const { uid, displayName } = useSelector(state => state.auth);
    const authorizedUser = 'Pf8KqeZ1wiRlzE2NWfsKB6sv1YK2';

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

    useEffect(() => {
        const storedSymbols = localStorage.getItem('symbols');
        if (storedSymbols) {
            setSymbols(JSON.parse(storedSymbols));
        }
    }, []);

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

    const handleAddSymbol = () => {
        if (newSymbol.trim() !== '') {
            const updatedSymbols = [...symbols, newSymbol];
            setSymbols(updatedSymbols);
            localStorage.setItem('symbols', JSON.stringify(updatedSymbols));
            setNewSymbol('');
        }
    };

    const handleCopySymbol = (symbol) => {
        navigator.clipboard.writeText(symbol);
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
                {uid === authorizedUser && (
                    <Button disabled={isSaving} onClick={onOpenDrawer} color="primary" sx={{ padding: 2 }}>
                        <QuestionAnswerOutlined sx={{ fontSize: 30, mr: 1 }} />
                        Preguntar
                    </Button>
                )}
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
            <Drawer
                anchor="left"
                open={isDrawerOpen}
                onClose={onCloseDrawer}
                sx={{ 
                    width: '400px',
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: '400px',
                        overflowY: 'hidden',
                    },
                }}
            >
                <Grid container direction="column" sx={{ width: '100%', height: '100%', p: 2 }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">
                            Pregunta Aquí
                        </Typography>
                        <IconButton onClick={onCloseDrawer}>
                            <Close />
                        </IconButton>
                    </Grid>
                    <Grid container alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs>
                            <TextField 
                                fullWidth
                                placeholder="Haz una pregunta..."
                                value={questionText}
                                onChange={(e) => setQuestionText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && onInputQuestion()}
                            />
                        </Grid>
                        <Grid item>
                            <Button onClick={onInputQuestion} color="primary">
                                Enviar
                            </Button>
                        </Grid>
                    </Grid>
                    <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                        {conversation.map((msg, index) => (
                            <Box key={index} sx={{ mb: 2 }}>
                                <Typography variant="body2" color="textSecondary">
                                    {msg.role === 'user' ? 'Tú:' : 'AI:'}
                                </Typography>
                                <Typography variant="body1">
                                    {msg.content}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Grid>
            </Drawer>

            {/* Drawer para Símbolos */}
            <Drawer
                anchor="right"
                open={isSymbolDrawerOpen}
                onClose={onCloseSymbolDrawer}
                sx={{ 
                    width: '250px',
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: '250px',
                        overflowY: 'hidden',
                    },
                }}
            >
                <Grid container direction="column" sx={{ width: '100%', height: '100%', p: 2 }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">
                            Símbolos
                        </Typography>
                        <IconButton onClick={onCloseSymbolDrawer}>
                            <Close />
                        </IconButton>
                    </Grid>
                    <Grid container alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs>
                            <TextField 
                                fullWidth
                                placeholder="Agregar símbolo..."
                                value={newSymbol}
                                onChange={(e) => setNewSymbol(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddSymbol()}
                            />
                        </Grid>
                        <Grid item>
                            <Button onClick={handleAddSymbol} color="primary">
                                Agregar
                            </Button>
                        </Grid>
                    </Grid>
                    <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                        <List>
                            {symbols.map((symbol, index) => (
                                <ListItem button key={index} onClick={() => handleCopySymbol(symbol)}>
                                    <ListItemText primary={symbol} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Grid>
            </Drawer>
        </Grid>
    );
};
