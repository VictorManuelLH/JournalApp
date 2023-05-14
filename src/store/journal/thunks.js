import { collection, deleteDoc, doc, setDoc } from 'firebase/firestore/lite'
import { FireBaseDB } from '../../firebase/config'
import { addNewEmptyNote, deleteNoteById, savingNewNote, setActiveNote, setPhotosToActiveNote, setSaving, updateNote } from './journalSlice'
import { fileUpload } from '../../helper'

export const startNewNote = () => {

    return async( dispatch, getState ) => {
        
        dispatch( savingNewNote() )

        const { uid } = getState().auth
        
        // uid
        const newNote = {
            title: "",
            body: "",
            imageUrls: [],
            date: new Date().getTime()
        };

        const newDoc = doc( collection( FireBaseDB, `${ uid }/journal/notes` ) )
        await setDoc( newDoc, newNote )

        newNote.id = newDoc.id

        // dispatch
        dispatch( addNewEmptyNote( newNote ) )
        dispatch( setActiveNote( newNote ) )

    }

}

export const startSaveNote = () => {
    return async( dispatch, getState ) => {

        dispatch( setSaving() )

        const { uid } = getState().auth
        const { active:note } = getState().journal

        const noteToFireStore = { ...note }
        delete noteToFireStore.id

        const docRef = doc( FireBaseDB, `${ uid }/journal/notes/${ note.id }` )
        await setDoc( docRef, noteToFireStore, { merge: true } )

        dispatch( updateNote( note ) )

    }
}

export const startUploadFiles = ( files = [] ) => {
    return async( dispatch ) => {
        dispatch( setSaving() )

        // await fileUpload( files[0] )

        const fileUploadPromises = []

        for (const file of files) {
            fileUploadPromises.push( fileUpload( file ) )
        }

        const photoUrls = await Promise.all( fileUploadPromises )
        dispatch( setPhotosToActiveNote( photoUrls ) )

    }
}

export const startDeletingNote = () => {
    return async( dispatch, getState ) => {

        const { uid } = getState().auth
        const { active: note } = getState().journal

        const docRef = doc( FireBaseDB, `${ uid }/journal/notes/${ note.id }` )
        const respuesta = await deleteDoc( docRef )

        dispatch( deleteNoteById( note.id ) )

    }
}