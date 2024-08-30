import React from 'react';
import { Drawer, TextField, Button, Grid, List, ListItem, ListItemText, IconButton, Typography, Box } from '@mui/material';
import { Close, Delete } from '@mui/icons-material';
import { useSymbols } from '../../hooks/useSymbols';

export const DrawerSymbols = ({ isSymbolDrawerOpen, onCloseSymbolDrawer }) => {
    const { symbols, newSymbol, setNewSymbol, handleAddSymbol, handleCopySymbol, handleDeleteSymbol } = useSymbols();

    return (
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
                    <Typography variant="h6">Símbolos</Typography>
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
                            <ListItem key={index}>
                                <ListItemText 
                                    primary={symbol} 
                                    onClick={() => handleCopySymbol(symbol)} 
                                    sx={{ cursor: 'pointer' }}
                                />
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteSymbol(index)}>
                                    <Delete />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Grid>
        </Drawer>
    );
};
