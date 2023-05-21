import { collection, deleteDoc, getDocs } from "firebase/firestore/lite"
import { addNewEmptyNote, savingNewNote, setActiveNote } from "../../../store/journal/journalSlice"
import { startNewNote } from "../../../store/journal/thunks"
import { FireBaseDB } from "../../../firebase/config"

describe('Pruebas en journalThunks', () => {

    const dispatch = jest.fn()
    const getState = jest.fn()
    beforeEach( () => jest.clearAllMocks())

    test('startNewNote debe de crear una nueva nota en blaco', async() => {

        const uid = 'TEST-UID'
        getState.mockReturnValue({ auth: { uid: uid } })
        await startNewNote()( dispatch, getState )

        expect( dispatch ).toHaveBeenCalledWith( savingNewNote() )
        // expect( dispatch ).toHaveBeenCalledWith( addNewEmptyNote({ 
        //     body: '',
        //     title: '',
        //     // id: expect.any( String ),
        //     // date: expect.any( Number ),
        // }) )
        // expect( dispatch ).toHaveBeenCalledWith( setActiveNote({ 
        //     body: '',
        //     title: '',
        //     id: expect.any( String ),
        //     date: expect.any( Number )
        // }) )

        //Borrar de firebase
        const collectionRef = collection( FireBaseDB, `${ uid }/journal/notes`)
        const docs = await getDocs( collectionRef )

        const deletePromises = []
        docs.forEach( doc => deletePromises.push( deleteDoc( doc.ref ) ) )
        await Promise.all( deletePromises )

    })

})