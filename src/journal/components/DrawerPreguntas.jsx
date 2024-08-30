import React, { useEffect, useRef } from 'react';
import { Box, Button, Drawer, Grid, IconButton, TextField, Typography } from '@mui/material';
import { Close, Delete } from '@mui/icons-material';
import { useSelector } from 'react-redux';

export const DrawerPreguntas = ({ isDrawerOpen, onCloseDrawer, questionText, setQuestionText, onInputQuestion, conversation, onClearConversation }) => {
    const { displayName } = useSelector(state => state.auth);

    const conversationEndRef = useRef(null);

    const scrollToBottom = () => {
        conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation]);

    return (
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
                    <Typography variant="h6">Pregunta Aquí</Typography>
                    <IconButton onClick={onCloseDrawer}><Close /></IconButton>
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
                        <Button onClick={onInputQuestion} color="primary">Enviar</Button>
                    </Grid>
                </Grid>
                
                {/* Contenedor con scroll para la conversación */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                    {conversation.map((msg, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <Typography variant="body2" color="textSecondary">
                                {msg.role === 'user' ? `${displayName}:` : 'AI:'}
                            </Typography>
                            <Typography variant="body1">
                                {msg.content}
                            </Typography>
                        </Box>
                    ))}
                    <div ref={conversationEndRef} />
                </Box>
                
                <Button
                    startIcon={<Delete />}
                    variant="contained"
                    color="secondary"
                    onClick={onClearConversation}
                    sx={{ mt: 2 }}
                >
                    Limpiar Conversación
                </Button>
            </Grid>
        </Drawer>
    );
};
