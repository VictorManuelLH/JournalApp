import React, { useEffect, useRef } from 'react';
import { Box, Button, Drawer, Grid, IconButton, TextField, Typography } from '@mui/material';
import { Close, CopyAll, Delete } from '@mui/icons-material';
import { useSelector } from 'react-redux';

import hljs from 'highlight.js/lib/core';

import 'highlight.js/styles/atom-one-dark.css';

export const DrawerPreguntas = ({ isDrawerOpen, onCloseDrawer, questionText, setQuestionText, onInputQuestion, conversation, onClearConversation }) => {
    const { displayName } = useSelector(state => state.auth);
    const conversationEndRef = useRef(null);

    const scrollToBottom = () => {
        conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation]);

    useEffect(() => {
        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            hljs.highlightElement(block);
        });
    }, [conversation]);

    useEffect(() => {
        window.MathJax = {
            tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
            svg: { fontCache: 'global' }
        };

        const script = document.createElement('script');
        script.src = '/es5/tex-mml-chtml.js';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.MathJax.typesetPromise().then(() => {
                console.log('MathJax cargado y procesado');
            });
        };

        return () => {
            document.head.removeChild(script);
        };
    }, [conversation]);

    const supportedLanguages = [
        'c', 'cpp', 'csharp', 'java', 'javascript', 'python', 'php', 'ruby', 'go', 'swift',
        'kotlin', 'dart', 'typescript', 'rust', 'scala', 'haskell', 'perl', 'lua',
        'sql', 'r', 'matlab', 'julia', 'sas', 'stata', 'verilog', 'vhdl', 'ada', 'fortran',
        'cobol', 'pascal', 'prolog', 'lisp', 'html', 'css', 'html5', 'css3', 'jquery', 'angular',
        'jsx', 'vue', 'ember', 'objective-c', 'nosql', 'asn', 'unityscript', 'fsharp',
        'bash', 'zsh', 'sh', 'powershell', 'tcl', 'ocaml', 'racket', 'elixir', 'erlang',
        'scheme', 'groovy', 'crystal', 'nim', 'vbscript', 'forth', 'd', 'solidity', 'vala',
        'smalltalk', 'actionscript', 'pony', 'sass', 'less', 'backbone.js', 'svelte', 
        'alpine.js', 'pug', 'jade', 'markdown', 'xml', 'yaml', 'toml', 'json', 'ini',
        'graphql', 'cypher', 'rpg', 'abap', 'vimscript', 'hlsl', 'glsl', 'shaderlab',
        'assembly', 'vhdl', 'systemverilog', 'coq', 'agda'
    ];
    
    const onCopyText = (content) => {
        navigator.clipboard.writeText(content).then(() =>{
            console.log('Texto copiado');
        }).catch( err => {
            console.log('Volver a cargar');
        } )
    };
    

    return (
        <Drawer
            anchor="left"
            open={isDrawerOpen}
            onClose={onCloseDrawer}
            sx={{ 
                width: { xs: '100%', sm: '75%', md: '65%', lg: '800px' },
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: { xs: '100%', sm: '75%', md: '65%', lg: '800px' },
                    overflowY: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <Grid container direction="column" sx={{ flexGrow: 1, p: 2 }}>
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
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                onInputQuestion();
                            }
                        }}
                        multiline
                        maxRows={4}
                        variant="outlined"
                    />
                </Grid>

                    <Grid item>
                        <Button onClick={onInputQuestion} color="primary">Enviar</Button>
                    </Grid>
                </Grid>
                
                {/* Contenedor con scroll para la conversación */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: { xs: 'calc(100vh - 200px)', md: 'calc(100vh - 200px)' } }}>
    {conversation.map((msg, index) => {
        const containsCodeBlock = supportedLanguages.some(lang => msg.content.includes(`\`\`\`${lang}`));

        return (
            <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                    {msg.role === 'user' ? `${displayName}:` : 'AI:'}
                </Typography>
                {containsCodeBlock ? (
                    <pre>
                        <IconButton onClick={() => onCopyText(msg.content)}>
                            <CopyAll />
                        </IconButton>

                        <code>
                            {msg.content}
                        </code>
                    </pre>
                ) : (
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {msg.content}
                    </Typography>
                )}
            </Box>
        );
    })}
    <div ref={conversationEndRef} />
</Box>

                
                <Button
                    startIcon={<Delete />}
                    variant="contained"
                    color="secondary"
                    onClick={onClearConversation}
                    sx={{ mt: 'auto', mb: 2 }}
                >
                    Limpiar Conversación
                </Button>
            </Grid>
        </Drawer>
    );
};