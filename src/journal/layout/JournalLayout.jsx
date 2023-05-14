import { Box } from "@mui/system"
import { Navbar, SideBar } from "../components"
import { Toolbar } from "@mui/material"
import { useState } from "react";

const drawerWidth = 240

export const JournalLayout = ({ children }) => {

    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => {
            setMobileOpen(!mobileOpen);
        }

    return (
        <Box sx={{ display: 'flex' }} className="animate__animated animate__fadeIn animate__faster" >

            <Navbar drawerWidth={drawerWidth} setOpen={handleDrawerToggle} />

            <SideBar drawerWidth={drawerWidth} openSidebar={mobileOpen} setOpen={handleDrawerToggle} />

            <Box 
                component="main" 
                sx={{ flexGrow: 1, p: 3 }} >

                <Toolbar />

                { children }

            </Box>

        </Box>
    )
}
