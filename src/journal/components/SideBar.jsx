import { Drawer, Box, Toolbar, Typography, Divider, List, ListItem, ListItemButton, ListItemIcon, Grid, ListItemText, Button, FormControl, InputLabel, Select, MenuItem, Hidden, CssBaseline, AppBar, IconButton } from "@mui/material" 
import { useSelector } from "react-redux"
import { SideBarItem } from "./"
// import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react"

export const SideBar = ({ drawerWidth = 240 }) => {

    const { status, displayName } = useSelector( state => state.auth )
    const { notes } = useSelector( state => state.journal )

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
            <Drawer
                variant="persistent"
                open
                sx={{ display: { xs: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
                // sx={{ display: { xs: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
                >
                        
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">{ displayName }</Typography>    
                </Toolbar>    
                <Divider />

                <List>
                    {
                        notes.map( note => (
                            <SideBarItem key={ note.id } { ...note } />
                        ))
                    }
                </List>
            </Drawer>
        </Box>
        


    )
}
