import { v2 as cloudinary } from 'cloudinary'
import { fileUpload } from "../../helper/fileUpload"

cloudinary.config({
    cloud_name: 'dhifdqnya',
    api_key: '948273631641263',
    api_secret: 'P1QJYTLL19jDL1ekEti2eYxdknE',
    secure: true
})

describe('Pruebas en fileUpload', () => {

    test('Debe de subir el archivo correctamente a cloudinary', async() => {
        
        const imageUrl = 'https://image.shutterstock.com/image-photo/mountains-under-mist-morning-amazing-260nw-1725825019.jpg'
        const respuesta = await fetch( imageUrl )
        const blob = await respuesta.blob()
        const file = new File( [ blob ], 'foto.jpg' )

        const url = await fileUpload( file )
        expect( typeof url ).toBe('string')

        const segements = url.split('/')
        const imageId = segements[ segements.length -1 ].replace('.jpg', '')

        const cloudRespuesta = await cloudinary.api.delete_resources([ 'journal/' + imageId ],{
            resource_type: 'image'
        })

        console.log(cloudRespuesta)

    })
    test('Debe de retornar null', async() => {
        
        const file = new File( [], 'foto.jpg' )

        const url = await fileUpload( file )
        expect( url ).toBe(null)

    })

})