import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { ListItem, ListItemButton, ListItemIcon, Grid, ListItemText, IconButton } from "@mui/material";
import { TurnedInNot, TurnedIn } from "@mui/icons-material";
import { setActiveNote } from "../../store/journal/journalSlice";
import { togglePinNoteFirebase } from "../../store/journal/thunks";

export const SideBarItem = ({ title, body, id, date, imageUrls = [], isPinned, conversation = [], onCloseSidebar }) => {

    const dispatch = useDispatch();

    const activeNote = () => {
        dispatch(setActiveNote({ title, body, id, date, imageUrls, conversation, isPinned }));
        
        if (onCloseSidebar) {
            onCloseSidebar();
        }
    };

    const handleTogglePin = () => {
        dispatch(togglePinNoteFirebase(id, isPinned));
    };

    const newTitle = useMemo(() => {
        return title?.length > 17 ? title.substring(0, 17) + "..." : title;
    }, [title]);

    const newBody = useMemo(() => {
        return body?.length > 17 ? body.substring(0, 17) + "..." : body;
    }, [body]);

    return (
        <ListItem disablePadding>
            <ListItemButton onClick={activeNote}>
                <ListItemIcon>
                    <IconButton onClick={handleTogglePin}>
                        {isPinned ? <TurnedIn style={{ color: "gold" }} /> : <TurnedInNot />}
                    </IconButton>
                </ListItemIcon>
                <Grid container>
                    <ListItemText primary={newTitle} />
                    <ListItemText secondary={newBody} />
                </Grid>
            </ListItemButton>
        </ListItem>
    );
};
