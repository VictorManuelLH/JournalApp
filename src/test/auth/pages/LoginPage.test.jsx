import { fireEvent, render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { MemoryRouter } from "react-router-dom"

import { LoginPage } from "../../../auth/pages/LoginPage"
import { authSlice } from "../../../store/auth"
import { startGoogleSingIn } from "../../../store/auth/thunks"
import { notAuthenticatedState } from "../../fixtures/authFixtures"

const mockStartGoogleSingIn = jest.fn()
const mockStartLoginWithEmailPassword = jest.fn()

jest.mock('../../../store/auth/thunks', () => ({
    startGoogleSingIn: () => mockStartGoogleSingIn,
    startLoginWithEmailPassword: ({ email, password }) => {
        return () => mockStartLoginWithEmailPassword({ email, password })
    },
}))

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => (fn) => fn(),
}))

const store = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState:{
        auth: notAuthenticatedState
    }
})

describe('Pruebas en el <LoginPage/>', () => {

    beforeEach( () => jest.clearAllMocks() )

    test('debe de mostrar el componente correctamente', () => {
        render(
            <Provider store={ store }>
                <MemoryRouter>
                    <LoginPage/>
                </MemoryRouter>
            </Provider>
        )

        expect( screen.getAllByText('Login').length ).toBeGreaterThanOrEqual(1)
    })

    test('Boton de google debe llamar el startGoogleSingIn', () => {
        render(
            <Provider store={ store }>
                <MemoryRouter>
                    <LoginPage/>
                </MemoryRouter>
            </Provider>
        )

        const btnGoogle = screen.getByLabelText('google-btn')
        fireEvent.click( btnGoogle )

        expect( mockStartGoogleSingIn ).toHaveBeenCalled()
    })
    
    // test('Submit debe llamar el startLoginWithEmailAndPassword', () => {
    //     const email = 'victor@gmail.com'
    //     const password = '123456'

    //     render(
    //         <Provider store={ store }>
    //             <MemoryRouter>
    //                 <LoginPage/>
    //             </MemoryRouter>
    //         </Provider>
    //     )

    //     const emailField = screen.getByRole('textbox', { name: 'Correo' })
    //     fireEvent.change( emailField, { target: { name: 'email', value: email } } )
        
    //     const passwordField = screen.getByTestId('password')
    //     fireEvent.change( passwordField, { target: { name: 'email', value: password } } )

    //     const loginForm = screen.getByLabelText('submit-form')
    //     fireEvent.submit( loginForm )
        
    //     expect( mockStartLoginWithEmailPassword ).toHaveBeenCalledWith({
    //         email,
    //         password
    //     })
    // })

})