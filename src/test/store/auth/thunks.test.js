import { loginWithEmailAndPassword, logoutFirebase, singInGoogle } from "../../../firebase/providers"
import { checkingCredentiales, login, logout } from "../../../store/auth/authSlice"
import { checkingAuthentication, startGoogleSingIn, startLoginWithEmailAndPassword, startLogout } from "../../../store/auth/thunks"
import { clearNotesLogout } from "../../../store/journal/journalSlice"
import { demoUser } from "../../fixtures/authFixtures"

jest.mock('../../../firebase/providers')

describe('Pruebas en authThunks', () => {
    
    const dispatch = jest.fn()
    beforeEach(() => jest.clearAllMocks())

    test('Debe de invocar el checkingCredentials', async() => {
        await checkingAuthentication()( dispatch )
        expect( dispatch ).toHaveBeenCalledWith( checkingCredentiales() )
    })
    
    test('startGoogleSingIn debe llamar checkingCredentials y login', async() => {
        const loginData = { ok: true, ...demoUser }

        await singInGoogle.mockResolvedValue( loginData )
        await startGoogleSingIn()( dispatch )

        expect( dispatch ).toHaveBeenCalledWith( checkingCredentiales() )
        expect( dispatch ).toHaveBeenCalledWith( login( loginData ) )
    })
    
    test('startGoogleSingIn debe llamar checkingCredentials y logout - Error', async() => {
        const loginData = { ok: false, errorMessage: 'Un error en google' }

        await singInGoogle.mockResolvedValue( loginData )
        await startGoogleSingIn()( dispatch )

        expect( dispatch ).toHaveBeenCalledWith( checkingCredentiales() )
        expect( dispatch ).toHaveBeenCalledWith( logout( loginData.errorMessage ) )
    })

    // test('startCreatingUserWithEmailPassword debe llamar checkingCredentials y login', async() => {
    //     const loginData = { ok: true, ...demoUser }
    //     const formData = { email: demoUser.email, password: '123456' }

    //     await loginWithEmailAndPassword.mockResolvedValue( loginData )
    //     await startLoginWithEmailAndPassword( formData )( dispatch )

    //     expect( dispatch ).toHaveBeenCalledWith( checkingCredentiales() )
    //     expect( dispatch ).toHaveBeenCalledWith( login( loginData ) )
    // })
    
    test('startLogout debe llamar logoutFirebase, clearNotes y logout', async() => {
        await startLogout()( dispatch )

        expect( logoutFirebase ).toHaveBeenCalled()
        expect( dispatch ).toHaveBeenCalledWith( clearNotesLogout() )
        expect( dispatch ).toHaveBeenCalledWith( logout() )
    })

})