import { templFooter } from '../templates/footer.js'
import { templHeader } from '../templates/header.js'


function main() {
    

    const storeUsers = 'usuarios'

    // Nodos del DOM
    
    const btnReg =  document.querySelector('#b_registrar')
    const form = document.querySelector('#f_register')
     
   
    
    if (btnReg) {
        btnReg.addEventListener('click', onClickReg)
    }
    
    //cargo el footer 
    const hoy = (new Date()).toLocaleDateString()
    document.querySelector('footer').innerHTML =  templFooter.render(hoy)

    //cargo el header y le paso la pagina actual
    const posicion = window.location.pathname.lastIndexOf('/') + 1
    const page = window.location.pathname.slice(posicion)
    document.querySelector('header').innerHTML = templHeader.render(page)

    
     // completar el select para nacionalidad y provincias
    const nacionalidad = form.querySelector('select#nacionalidad')
    const provincia = form.querySelector('select#provincia')
    nacionalidad.addEventListener('change', selectManager )
    
 
    const nacionalidades = [
        {id: 'EXT' , nombre: 'Extranjero', provincias: []},
        {id: 'ESP', nombre: 'Español', provincias: ['Madrid', 'Barcelona', 'Gerona', 'Sevilla']}]
   

    setSelect('nacionalidad', nacionalidades)
     

     // Funcion select para nacionalidad y provincias
     function setSelect(id, data) {   
        let html = '<option></option>'
        data.forEach(item => html += `
                <option value="${item.id}">${item.nombre}</option>`)
        form.querySelector('#'+id).innerHTML = html
        return html
    }

    function setSelectString(id, data) {   
        let html = '<option></option>'
        data.forEach(item => html += `
                <option value="${item}">${item}</option>`)
        form.querySelector('#'+id).innerHTML = html
        return html
    }

    //Función manejadora del Select
    function selectManager(){
        const aProvincias = nacionalidad.selectedIndex ? nacionalidades[nacionalidad.selectedIndex-1].provincias : []
        console.log('El control cambio', aProvincias)
        if (aProvincias.length) {
             
            setSelectString('provincia', aProvincias )
            provincia.parentElement.classList.remove('nodisplay')
            if(!provincia.checkValidity()){
                const pError = provincia.parentElement.querySelector('p')
                pError.classList.remove('nodisplay')
                pError.innerHTML='Selecciona Provincia'
                return
            }
            
        } else {
            provincia.parentElement.classList.add('nodisplay')
        }

    }

     


    
    // Función de Registro de usuarios
    function onClickReg ()  {
        const formReg = document.querySelector('#f_register')
        
        // Valido formulario de registro
        if (!validarForm(formReg)) {
            return 
        }

        const data = {}
        const inputs = [...formReg.querySelectorAll('input')]
        const aGenero = [...formReg.querySelectorAll('[name="genero"]')]
        data.genero = aGenero.filter(item => item.checked)[0].value
        const nacionalidad = form.querySelector('select#nacionalidad')
        const provincias = form.querySelector('select#provincia')
        

        data.nacionalidad = nacionalidades[nacionalidad.selectedIndex-1]
        data.provincia = provincias.value


        const condiciones = formReg.querySelector('input#condiciones')
        data.acepto_condiciones = condiciones.checked
        

        // Validación de contraseña
        const password = formReg.querySelector('input#i_passwd') 
        const confpassword = formReg.querySelector('input#i_confpasswd')
        console.log(password.value)
        console.log(confpassword.value)
        if (password.value != confpassword.value){
            const pError = i_confpasswd.parentElement.querySelector('p')
            pError.classList.remove('nodisplay')
            pError.innerHTML='Confirmación de password es distinta'
            return
        }

        
       // Creo el objeto de usuario con los valores del formulario
        const usuario = {
            user : inputs[0].value,
            passwd: inputs[1].value,
            genero : data.genero,
            nacionalidad: data.nacionalidad,
            provincia: data.provincia,
            nombre: inputs[3].value,
            apellido: inputs[4].value,
            movil : inputs[5].value,
            correo : inputs[6].value,
            apikey: inputs[7].value,
            comentarios: inputs[8].value,
            condiciones: data.acepto_condiciones
        }
        //Hay usuarios?
        const users = window.localStorage.getItem(storeUsers) ?
        //Si no hay usuarios, devuelve un array vacío
        JSON.parse(window.localStorage.getItem(storeUsers)) : []
        //Si devuelve usuarios, meto los usuarios nuevos en el array
        users.push(usuario)
        window.localStorage.setItem(storeUsers, JSON.stringify(users))
        inputs.forEach(item => item.value = '')
        window.location = 'index.html'
        
    }  
   

    
    //Función de validación de Formularios
    function validarForm(form) {
        const inputs = [...form.querySelectorAll('input')]
        const data = {}
        const aGenero = [...form.querySelectorAll('[name="genero"]')]
        const condiciones = form.querySelector('input#condiciones') 
        
        const nacionalidad = form.querySelector('select#nacionalidad')
        nacionalidad.addEventListener('change', generoManager )
        const provincia = form.querySelector('select#provincia')
        provincia.addEventListener('change', generoManager )
        aGenero.forEach(item => item.addEventListener('change', generoManager) )
        condiciones.addEventListener('change', generoManager )
        function generoManager (ev) {
            if (ev.type === 'change') {
                if (ev.target.checkValidity) {
                    ev.target.parentElement.querySelector('p')
                        .classList.add('nodisplay')
                }
            }
        }
        if(!aGenero[0].checkValidity()) {
            const pError = aGenero[0].parentElement.querySelector('p')
            pError.classList.remove('nodisplay')
            pError.innerHTML='Selecciona el género al que perteneces'
            return
        }
       
        if(!nacionalidad.checkValidity()) {
            const pError = nacionalidad.parentElement.querySelector('p')
            pError.classList.remove('nodisplay')
            pError.innerHTML='Selecciona Nacionalidad'
            return
        }
        
       
        if(!condiciones.checkValidity()) {
            const pError = condiciones.parentElement.querySelector('p')
            pError.classList.remove('nodisplay')
            pError.innerHTML='Acepta las condiciones'
            return
            
        }


        try {
            inputs.forEach((item) => {
                if(!item.value) {
                    const error = new Error(`Campo ${item.id} invalido`)
                    error.code = item.id
                    throw error
                }
            })
            return true  
        } catch (error) {
            console.log(error.message)
            console.log(error.code)
            let errorMsg
            switch (error.code) {
                case 'i_usuario':
                    errorMsg = 'El usuario es obligatorio'
                    break;
                case 'i_nombre':
                    errorMsg = 'El nombre es obligatorio'
                    break;
                case 'i_apellido':
                    errorMsg = 'El apellido es obligatorio'
                    break;
                case 'i_mobile':
                    errorMsg = 'El movil es obligatorio'
                    break;
                case 'i_apikey':
                    errorMsg = 'El apikey es obligatorio'
                    break;
                case 'i_correo':
                    errorMsg = 'El correo es obligatorio'
                    break;
                case 'i_passwd':
                    errorMsg = 'La password es obligatoria'
                    break;
                case 'i_confpasswd':
                    errorMsg = 'La confirmación de password es obligatoria'
                    break;
                case 'i_comentarios':
                    errorMsg = 'Añadir comentario'
                    break;    
                
            }
            const pStatus = form.querySelector('p')
            pStatus.classList.remove('nodisplay')
            form.querySelector('p').innerHTML = errorMsg
            return false
        }
        
        

    }


}
document.addEventListener('DOMContentLoaded', main)
