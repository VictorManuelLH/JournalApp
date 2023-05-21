import { authSlice, checkingCredentiales, login, logout } from "../../../store/auth/authSlice"
import { authenticatedState, demoUser, initialState } from "../../fixtures/authFixtures"

describe('Pruebas en el authSlice', () => {
    
    test('Debe de regresar el estado inicial y llamarse "auth"', () => {
        
        expect( authSlice.name ).toBe('auth')
        const state = authSlice.reducer( initialState, {} )
        expect( state ).toEqual( initialState )

    })

    test('Debe realizar la autenticacion', () => {

        
        const state = authSlice.reducer( initialState, login( demoUser ) )
        expect( state ).toEqual({
            status: 'authenticated', // 'checking', 'authenticated'
            uid: demoUser.uid,
            email: demoUser.email,
            displayName: demoUser.displayName,
            photoURL: demoUser.photoURL,
            errorMessage: null
        })

    })

    test('debe de realizar el logout sin argumentos', () => {
        
        const state = authSlice.reducer( authenticatedState, logout() ) 
        
        expect( state.status ).toBe('not-authenticated')

    })
    
    test('Debe de realizar el logout y mostrar un mensaje de error', () => {
        
        const errorMessage = 'Credenciales incorrectas'
        const state = authSlice.reducer( authenticatedState, logout({ errorMessage }) )
        
        expect( state ).toEqual({
            status: 'not-authenticated', // 'checking', 'authenticated'
            uid: null,
            email: null,
            displayName: null,
            photoURL: null,
            errorMessage
        })
        
    })

    test('Debe cambiar el estado a checking', () => {
        
        const state = authSlice.reducer( authenticatedState, checkingCredentiales() )
        expect( state.status ).toBe( 'checking' )

    })

})