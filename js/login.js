import { templFooter } from '../templates/footer.js'
import { templHeader } from '../templates/header.js'


function main() {
    

    const storeUsers = 'usuarios'

    // Nodos del DOM
    const btnLog =  document.querySelector('#b_acceder')
 
     
    if(btnLog) {
        btnLog.addEventListener('click', onClickLog)
    }
    
  
    //cargo el footer 
    const hoy = (new Date()).toLocaleDateString()
    document.querySelector('footer').innerHTML =  templFooter.render(hoy)

    //cargo el header y le paso la pagina actual
    const posicion = window.location.pathname.lastIndexOf('/') + 1
    const page = window.location.pathname.slice(posicion)
    document.querySelector('header').innerHTML = templHeader.render(page)
     

    //Función de Login
    function onClickLog () {
        const formLogin = document.querySelector('#f_login')


        // hago un get de los usuarios en localstorage
        const users = window.localStorage.getItem(storeUsers) ?
        JSON.parse(window.localStorage.getItem(storeUsers)) : []
        const inputs = [...formLogin.querySelectorAll('input')]   
        // Chequeo si el usuario existe
        let findUser = users.find( item => item.user.toUpperCase() == inputs[0].value.toUpperCase())
        if (!findUser) {
            console.log('Datos incorrectos')
            let errorMsg= 'Datos incorrectos'
            formLogin.querySelector('p').innerHTML = errorMsg
        } else  if (findUser.passwd !== inputs[1].value) {
            let errorMsg= 'Datos incorrectos'
            console.log('Datos incorrectos')
            formLogin.querySelector('p').innerHTML = errorMsg
        } else {
            console.log('Usuario y password correctos')
            window.location = 'peliculas.html'  
        }
        
    }


}
document.addEventListener('DOMContentLoaded', main)
