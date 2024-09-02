import { useState } from "react";
import { Drawer, Box, Toolbar, Typography, Divider, List, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector } from "react-redux";
import { SideBarItem } from "./";

export const SideBar = ({ drawerWidth = 240 }) => {
    const { displayName } = useSelector(state => state.auth);
    const { notes } = useSelector(state => state.journal);

    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const sortedNotes = [...notes].sort((a, b) => b.isPinned - a.isPinned);

    const drawerContent = (
        <>
            <Toolbar>
                <Typography variant="h6" noWrap component="div">{displayName}</Typography>
            </Toolbar>
            <Divider />
            <List>
                {sortedNotes.map(note => (
                    <SideBarItem 
                        key={note.id} 
                        {...note} 
                        onCloseSidebar={() => setMobileOpen(false)}
                    />
                ))}
            </List>
        </>
    );

    return (
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: { xs: 'block', sm: 'none' }, position: 'fixed', top: 16, left: 16, zIndex: 1300 }}
            >
                <MenuIcon />
            </IconButton>

            {/* Drawer para pantallas grandes */}
            <Drawer
                variant="permanent"
                open
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Drawer desplegable para móviles */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                }}
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};
