import { IconButton } from "@mui/material"
import { JournalLayout } from "../layout/JournalLayout"
import { NoteView, NothingSelectedView } from "../views"
import { AddOutlined } from "@mui/icons-material"

export const JournalPage = () => {
    return (
        <JournalLayout>
            {/* <Typography>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus ab molestiae quas, ipsum optio libero repellat dolores commodi necessitatibus quos, rerum, accusantium consequuntur eveniet blanditiis nihil quis vitae perferendis? Blanditiis?</Typography> */}
            {/* <NothingSelectedView /> */}
            <NoteView />
            <IconButton 
                size="large"
                sx={{ color: 'white',
                    backgroundColor: 'error.main', 
                    ':hover': { backgroundColor: 'error.main', 
                        opacity: 0.9 }, 
                        position: 'fixed', 
                        right: 50, 
                        bottom: 50 }}>
                <AddOutlined sx={{ fontSize: 30 }} />
            </IconButton>
        </JournalLayout>
    )
}
