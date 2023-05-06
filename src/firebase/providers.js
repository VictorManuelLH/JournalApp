import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { FireBaseAuth } from "./config";

const googleProvider = new GoogleAuthProvider()

googleProvider.setCustomParameters({
    prompt: 'select_account'
})

export const singInGoogle = async() => {
    try {
        const result = await signInWithPopup( FireBaseAuth, googleProvider )
        // const credentials = GoogleAuthProvider.credentialFromResult( result )
        const { displayName, email, photoURL, uid } = result.user
        
        return{
            ok: true,
            displayName, email, photoURL, uid
        }
        
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        return {
            ok: false,
            errorMessage,
        }
    }
}

export const registerUserWithEmailAndPassword = async({ email, password, displayName }) => {

    try {
        
        const respuesta = await createUserWithEmailAndPassword( FireBaseAuth, email, password )
        const { uid, photoURL } = respuesta.user

        await updateProfile( FireBaseAuth.currentUser, { displayName } )

        return{
            ok: true, 
            uid, photoURL, email, displayName
        }

    } catch (error) {
        return { ok: false, errorMessage: error.message }
    }

}

export const loginWithEmailAndPassword = async({ email, password }) => {

    try {
        
        const resultado = await signInWithEmailAndPassword( FireBaseAuth, email, password )
        const { displayName, photoURL, uid } = resultado.user
        
        return{
            ok: true,
            displayName, email, photoURL, uid
        }

    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message
        return {
            ok: false,
            errorMessage,
        }
    }

}

export const logoutFirebase = async() => {

    return await FireBaseAuth.signOut()

}