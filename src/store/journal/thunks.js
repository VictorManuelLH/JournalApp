import { collection, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore/lite';
import { FireBaseDB } from '../../firebase/config';
import { addNewEmptyNote, deleteNoteById, startSaving, setOpenAIResponse, setActiveNote, setPhotosToActiveNote, updateNote, togglePinNote, clearConversation } from './journalSlice';
import { fileUpload } from '../../helper';
import axios from 'axios';

export const startNewNote = () => {
    return async (dispatch, getState) => {
        dispatch(startSaving());

        const { uid } = getState().auth;

        const newNote = {
            title: "Nueva nota",
            body: "",
            imageUrls: [],
            conversation: [],
            isPinned: false,
            newField: "",
            date: new Date().getTime(),
        };

        try {
            const newDoc = doc(collection(FireBaseDB, `${uid}/journal/notes`));

            await setDoc(newDoc, newNote);
            newNote.id = newDoc.id;

            dispatch(addNewEmptyNote(newNote));
            dispatch(setActiveNote(newNote));
        } catch (error) {
            console.error("Error al crear nueva nota:", error);
        }
    };
};


export const togglePinNoteFirebase = (id, isPinned) => {
    return async (dispatch, getState) => {
        dispatch(startSaving());

        const { uid } = getState().auth;
        const { notes } = getState().journal;
        const note = notes.find(note => note.id === id);

        const noteRef = doc(FireBaseDB, `${uid}/journal/notes/${id}`);
        
        await updateDoc(noteRef, {
            isPinned: !isPinned
        });

        dispatch(updateNote({
            id: id,
            isPinned: !isPinned,
            title: note.title,
            body: note.body,
            conversation: note.conversation || [],
            newField: note.newField,
            date: new Date().getTime(),
        }));
    };
};

export const startSaveNote = () => {
    return async (dispatch, getState) => {
        dispatch(startSaving());

        const { uid } = getState().auth;
        const { active: note } = getState().journal;

        const noteToFireStore = { 
            ...note, 
            conversation: note.conversation || [],
            newField: note.newField || ""
        };

        delete noteToFireStore.id;

        const docRef = doc(FireBaseDB, `${uid}/journal/notes/${note.id}`);

        await setDoc(docRef, noteToFireStore, { merge: true });

        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const updatedNotes = notes.map(n => (n.id === note.id ? { ...note, conversation: note.conversation || [], newField: note.newField || "" } : n));
        localStorage.setItem('notes', JSON.stringify(updatedNotes));

        dispatch(updateNote({
            id: note.id,
            ...noteToFireStore
        }));
    };
};

export const startUploadFiles = (files = []) => {
    return async (dispatch) => {
        dispatch(startSaving());

        const fileUploadPromises = [];

        for (const file of files) {
            fileUploadPromises.push(fileUpload(file));
        }

        const photoUrls = await Promise.all(fileUploadPromises);
        dispatch(setPhotosToActiveNote(photoUrls));
    };
};

export const startQuestion = (promptText) => {
    return async (dispatch) => {
        dispatch(startSaving());

        try {
            const apiKey = import.meta.env.VITE_APIKEYOPENIA;


            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4-turbo',
                    messages: [
                        { role: 'system', content: 'Eres un asistente útil que ayuda a un estudiante de universidad y es desarrollador de software, dame el resultado y explicame paso a paso el proceso sin desenvolverte tanto' },
                        { role: 'user', content: promptText }
                    ],
                    max_tokens: 300,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                }
            );

            const answer = response.data.choices[0].message.content.trim();

            dispatch(setOpenAIResponse(answer));

        } catch (error) {
            console.error('Error al obtener respuesta de OpenAI:', error);
        }
    };
};

export const startCleanConversation = () => {
    return async (dispatch, getState) => {
        const { uid } = getState().auth;
        const { active: note } = getState().journal;

        if (!note) return;

        dispatch(clearConversation());

        const noteRef = doc(FireBaseDB, `${uid}/journal/notes/${note.id}`);

        await updateDoc(noteRef, {
            conversation: []
        });

        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const updatedNotes = notes.map(n => (n.id === note.id ? { ...n, conversation: [] } : n));
        localStorage.setItem('notes', JSON.stringify(updatedNotes));

        dispatch(updateNote({
            ...note,
            conversation: []
        }));
    };
};


export const startDeletingNote = () => {
    return async (dispatch, getState) => {
        const { uid } = getState().auth;
        const { active: note } = getState().journal;

        const docRef = doc(FireBaseDB, `${uid}/journal/notes/${note.id}`);

        const respuesta = await deleteDoc(docRef);

        dispatch(deleteNoteById(note.id));
    };
};
