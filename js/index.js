import { templFooter } from '../templates/footer.js'
import { templHeader } from '../templates/header.js'


function main() {   
    
    
    
    //cargo el footer 
    const hoy = (new Date()).toLocaleDateString()
    document.querySelector('footer').innerHTML =  templFooter.render(hoy)

    //cargo el header y le paso la pagina actual
    const posicion = window.location.pathname.lastIndexOf('/') + 1
    const page = window.location.pathname.slice(posicion)
    document.querySelector('header').innerHTML = templHeader.render(page)

    
     
    
}
document.addEventListener('DOMContentLoaded', main)
