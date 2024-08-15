import { useState } from 'react';
import { ImageList, ImageListItem, Dialog, DialogContent, IconButton, Button, useMediaQuery } from "@mui/material";
import { Close as CloseIcon, Delete as DeleteIcon } from "@mui/icons-material";

export const ImageGallery = ({ images, onImageDelete }) => {
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    
    const isMobile = useMediaQuery('(max-width:600px)');

    const handleClickOpen = (image) => {
        setSelectedImage(image);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = () => {
        onImageDelete(selectedImage);
        handleClose();
    };

    return (
        <>
            <ImageList 
                sx={{ width: '100%', height: isMobile ? 'auto' : 900 }} 
                cols={isMobile ? 2 : 3} 
                rowHeight={isMobile ? 120 : 164}
            >
                {images.map((image) => (
                    <ImageListItem key={image}>
                        <img
                            src={`${image}?w=${isMobile ? 120 : 164}&h=${isMobile ? 120 : 164}&fit=crop&auto=format`}
                            srcSet={`${image}?w=${isMobile ? 120 : 164}&h=${isMobile ? 120 : 164}&fit=crop&auto=format&dpr=2 2x`}
                            alt='Imagen de la nota'
                            loading="lazy"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleClickOpen(image)}
                        />
                    </ImageListItem>
                ))}
            </ImageList>

            {/* Modal */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
            >
                <DialogContent sx={{ position: 'relative' }}>
                    <IconButton
                        onClick={handleClose}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <img
                        src={selectedImage}
                        alt="Imagen de la nota"
                        style={{ width: '100%' }}
                    />
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                        sx={{ mt: 2 }}
                        startIcon={<DeleteIcon />}
                    >
                        Eliminar Imagen
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
};
