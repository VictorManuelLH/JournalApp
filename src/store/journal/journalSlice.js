import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isSaving: false,
    messageSaved: '',
    notes: JSON.parse(localStorage.getItem('notes')) || [],
    active: null,
    symbols: ['√','π']
};

export const journalSlice = createSlice({
    name: 'journal',
    initialState,
    reducers: {
        startSaving: (state) => {
            state.isSaving = true;
        },
        addSymbol: (state, action) => {
            state.symbols.push(action.payload);
        },
        setOpenAIResponse(state, action) {
            state.isSaving = false;
            state.openAIResponse = action.payload;
          },
        addNewEmptyNote: (state, action) => {
            state.notes.push(action.payload);
            state.isSaving = false;
            localStorage.setItem('notes', JSON.stringify(state.notes));
        },
        setActiveNote: (state, action) => {
            state.active = action.payload;
            state.messageSaved = '';
       
            if (!state.active.conversation) {
                state.active.conversation = [];
            }
       
            const noteIndex = state.notes.findIndex(note => note.id === state.active.id);
            if (noteIndex !== -1) {
                state.notes[noteIndex] = state.active;
            }
       
            localStorage.setItem('notes', JSON.stringify(state.notes));
        },               
            
        setNotes: (state, action) => {
            state.notes = action.payload;
            localStorage.setItem('notes', JSON.stringify(state.notes));
        },
        updateNote: (state, action) => {
            state.isSaving = false;
            state.notes = state.notes.map(note => {
                if (note.id === action.payload.id) {
                    return action.payload;
                }
                return note;
            });
            localStorage.setItem('notes', JSON.stringify(state.notes));
            state.messageSaved = `${action.payload.title}, actualizada correctamente`;
        },
        togglePinNote: (state, action) => {
            const noteIndex = state.notes.findIndex(note => note.id === action.payload);
            if (noteIndex !== -1) {
                state.notes[noteIndex].isPinned = !state.notes[noteIndex].isPinned;
                localStorage.setItem('notes', JSON.stringify(state.notes));
            }
        },        
        setPhotosToActiveNote: (state, action) => {
            state.isSaving = false;
            if (state.active) {
                state.active.imageUrls = [...state.active.imageUrls, ...action.payload];
            }
        },
        clearNotesLogout: (state) => {
            state.isSaving = false;
            state.messageSaved = '';
            state.notes = [];
            state.active = null;
            localStorage.removeItem('notes');
        },
        deleteNoteById: (state, action) => {
            state.active = null;
            state.notes = state.notes.filter(note => note.id !== action.payload);
            localStorage.setItem('notes', JSON.stringify(state.notes));
        },
        clearConversation: (state) => {
            state.isSaving = false;
            if (state.active) {
                state.active.conversation = [];
            }
        }
    }
});

export const {
    addNewEmptyNote,
    setActiveNote,
    setNotes,
    startSaving,
    setOpenAIResponse,
    updateNote,
    setPhotosToActiveNote,
    clearNotesLogout,
    deleteNoteById,
    togglePinNote,
    addSymbol,
    clearConversation
} = journalSlice.actions;
