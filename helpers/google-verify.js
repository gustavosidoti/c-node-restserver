const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client( process.env.GOOGLE_CLIENT_ID );

const googleVerify = async( idToken = '') => { // recibimos el token

  const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  
  const { name: nombre,  //desestructuramos del objeto de google esos valores y los reenombramos para que coincida
                        // con nuestro modelo, porque así lo definimos nosotros y no como lo trae google.
          picture: img,
          email: correo
        }= ticket.getPayload();
  
  return {nombre, img, correo };

}

module.exports = {
    googleVerify
}