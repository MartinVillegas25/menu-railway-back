const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const mailClave = require('../templateEmail/recuperarClave');
const confirmar = require('../templateEmail/mailConfirmar');
const confirmarPlanEmail = require('../templateEmail/confirmarPlanEmail');
const nuevoValoresEmail = require('../templateEmail/nuevoplanEmail');
const cancelarSuscripcion = require('../templateEmail/CancerlarPlan');


// const createTrans = ()=>{
//   // const transport = nodemailer.createTransport({
//   //   host: "sandbox.smtp.mailtrap.io",
//   //     port: 2525,
//   //     auth: {
//   //       user: "f7df9a1b3863b3",
//   //       pass: "e1f8a83e3b91c1"
//   //     }
//   // })
//   const transport = nodemailer.createTransport(
//     nodemailerSendgrid({
//       apikey: process.env.API_KEY,
//     })
//   )

//   return transport;
// }

// const sendMail = async (user) =>{
//   const transporter = createTrans();
//   const info = await transporter.sendMail({
//     from : 'test@test.com',
//     to:user,
//     subject: "Restaura tu contraseña",
//     html :mailClave,
//   })

//   console.log("mensaje enviado", info.messageId);
//   return

// }

let transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY
  }
})
function sendEmail (correo){
  
      transporter.sendMail({
        from: "martinvillegas90@hotmail.com", // verified sender email
        to: correo, // recipient email
        subject: "Recupera tu password", // Subject line
        text: "Equipo de Si Mesero", // plain text body
        html: mailClave, // html body
      }, function(error, info){
        if (error) {
          console.log(error);
        } else {
          
          console.log('Email sent: ' + info.response);
        }
      });

}

function confirmarPago(correo){
    transporter.sendMail({
      from: "martinvillegas90@hotmail.com", // verified sender email
      to: correo, // recipient email
      subject: "Confirmacion de suscripcion", // Subject line
      text: "Equipo de Si Mesero", // plain text body
      html: confirmar, // html body
    }, function(error, info){
      if (error) {
        console.log(error);
      } else {
        
        console.log('Email sent: ' + info.response);
      }
    });
}
function confirmarPlan(correo){
  transporter.sendMail({
    from: "martinvillegas90@hotmail.com", // verified sender email
    to: correo, // recipient email
    subject: "Confirmacion cambio de plan", // Subject line
    text: "Equipo de Si Mesero", // plain text body
    html: confirmarPlanEmail, // html body
  }, function(error, info){
    if (error) {
      console.log(error);
    } else {
      
      console.log('Email sent: ' + info.response);
    }
  });
}

function nuevoValoresCorreo(correo, standard, premium){
  transporter.sendMail({
    from: "martinvillegas90@hotmail.com", // verified sender email
    to: correo, // recipient email
    subject: "Nuevos Valores de Suscripcion", // Subject line
    text: "Equipo de Si Mesero", // plain text body
    html: nuevoValoresEmail(standard, premium), // html body
  }, function(error, info){
    if (error) {
      console.log(error);
    } else {
      
      console.log('Email sent: ' + info.response);
    }
  });
}

function cancelarsuscripcion(correo){
  transporter.sendMail({
    from: "martinvillegas90@hotmail.com", // verified sender email
    to: "contacto@simesero.com", // recipient email
    subject: "Cancelacion de suscripcion", // Subject line
    text: correo + "quiere cancelar la suscripcion", // plain text body
    html: cancelarSuscripcion(correo), // html body
  }, function(error, info){
    if (error) {
      console.log(error);
    } else {
      
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = {
  sendEmail,
  confirmarPago,
  confirmarPlan,
  nuevoValoresCorreo,
  cancelarsuscripcion
}




  // exports.sendMail = (user) => sendMail(user);


  





