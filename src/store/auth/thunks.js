import { loginWithEmailAndPassword, logoutFirebase, registerUserWithEmailAndPassword, singInGoogle } from "../../firebase/providers"
import { checkingCredentiales, login, logout } from "./authSlice"

export const checkingAuthentication = ( email, password ) => {
    return async( dispatch ) => {
        dispatch( checkingCredentiales() )
    }
}

export const startGoogleSingIn = () => {
    return async( dispatch ) => {
        dispatch( checkingCredentiales() )
        const result = await singInGoogle()
        if( !result.ok ) return dispatch( logout( result.errorMessage ) )
        dispatch( login( result ) )
    }
}

export const startCreatingUserWithEmailPassword = ({ email, password, displayName }) => {

    return async( dispatch ) => {

        dispatch( checkingCredentiales() )
        const { ok, uid, photoURL, errorMessage } = await registerUserWithEmailAndPassword({ email, password, displayName })
        if( !ok ) return dispatch( logout( {errorMessage} ) )
        dispatch( login({ uid, displayName, email, photoURL }) )
        
    }
    
}

export const startLoginWithEmailAndPassword = ({ email, password }) => {
    return async( dispatch ) => {
        
        dispatch( checkingCredentiales() )
        const { ok, uid, photoURL, errorMessage } = await loginWithEmailAndPassword({ email, password })
        if( !ok ) return dispatch( logout( {errorMessage} ) )
        dispatch( login({ email, password }) )
    }

}

export const startLogout = () => {
    return async( dispatch ) => {
        await logoutFirebase()
        dispatch( logout() )
    }
}