import { Drawer, Box, Toolbar, Typography, Divider, List, ListItem, ListItemButton, ListItemIcon, Grid, ListItemText } from "@mui/material" 
import { useSelector } from "react-redux"
import { SideBarItem } from "./"

export const SideBar = ({ drawerWidth = 240 }) => {

    const { status, displayName } = useSelector( state => state.auth )
    const { notes } = useSelector( state => state.journal )
    
    const hola = () => {
        return 'kslsal'
    }

    return (
        <Box 
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
            <Drawer
                variant="permanent"
                open
                sx={{ display: { xs: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>

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
