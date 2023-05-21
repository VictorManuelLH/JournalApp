// En caso de necesitar la implementación del FetchAPI
import 'whatwg-fetch'; // <-- yarn add whatwg-fetch
import 'setimmediate';
import { getEnviroments } from './src/helper/getEnviroments';


require('dotenv').config({
    path: '.env.test'
})

jest.mock('./src/helper/getEnviroments', () => ({
    getEnviroments: () => ({ ...process.env })
}))