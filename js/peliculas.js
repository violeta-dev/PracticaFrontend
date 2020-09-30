import { templFooter } from '../templates/footer.js'
import { templHeader } from '../templates/header.js'



function main() {
    
    let peliculasPage = 1
    const storeUsers = 'usuarios'
    
    // Nodos del DOM
    
    const btnPeliculas = document.querySelector('#b_load_peliculas')
    const btnprev = document.querySelector('#prev')
    const btnnext = document.querySelector('#next')
   
    if(btnPeliculas) {
        btnPeliculas.addEventListener('click', onClickPeliculas)
        btnprev.addEventListener('click', () => {goToPage(-1)})
        btnnext.addEventListener('click', () => {goToPage(+1)})
    }

   //Footer y header
    const hoy = (new Date()).toLocaleDateString()
    document.querySelector('footer').innerHTML =  templFooter.render(hoy)

    const posicion = window.location.pathname.lastIndexOf('/') + 1
    const page = window.location.pathname.slice(posicion)
    document.querySelector('header').innerHTML = templHeader.render(page) 

    //Accedo a la apikey del usuario en localStorage
    
    let user = JSON.parse(window.localStorage.getItem(storeUsers))
    let clave = user.map (item => item.apikey)
   
  

    
   // Leo de la API las peliculas top rated y las pagino de 20 en 20
    function onClickPeliculas() {
        let url = 'https://api.themoviedb.org/3/movie/top_rated'
        url += '?api_key=' + clave + '&page=' + peliculasPage
        
        if (peliculasPage > 1 ) {
            let url = 'https://api.themoviedb.org/3/movie/top_rated'
            url += '?api_key=' + clave + '&page=' + peliculasPage
        }
        
        if (!clave) {
            return
        }

        fetch(url)
        .then( resp => {
            
            if (resp.status < 200 || resp.status >= 300) {
                throw new Error('HTTP Error ' + resp.status)
            }
            
            return resp.json()
        })
        .then( data => procesaPeliculas(data))
        .catch (error => alert(error.message))
    }

    //proceso als peliculas y las vuelco en la pagina web

    function procesaPeliculas(data) {
        if(!data) {
            return
        }
        console.log(data)
        let html= ''
        data.results.forEach(item => {
            html += `
            <tr>
                <td class= "celda_id">${item.id}</td>
                <td>${item.original_title}</td>
            </tr>`

        })
        document.querySelector('div.peliculas').classList.remove('nodisplay')
        document.querySelector('table.table_peliculas tbody').innerHTML = html 
        document.querySelectorAll('.celda_id').forEach(
            item => item.addEventListener('click', onClickOnePelicula)
        )     
           
    }
    //Función para sacar descripción de la película seleccionada
    function ProcesaDetalles(data){
        console.log(data)
        if(!data) {
            return
        }
        let html= ''
        html += `
        <tr>
            <td class= "celda_id">${data.id}</td>
            <td>${data.original_title}</td>
            <td class=>${data.overview}</td>

        </tr>`

        
        document.querySelector('th.descripcion').classList.remove('nodisplay')
        document.querySelector('table.table_peliculas tbody').innerHTML = html 
    }
    
    // Función para selecionar una pelicula
    function onClickOnePelicula(ev) {
        
        let url = 'https://api.themoviedb.org/3/movie/'
        url += ev.target.innerHTML + '?api_key=' + clave
        console.log(url)
        fetch(url)
          .then(response => response.json())
          .then(data => ProcesaDetalles(data))       
         
    }
    

    //Función para moverme entre páginas
    function goToPage(n) {
        peliculasPage += n
        onClickPeliculas()
        if (peliculasPage > 1) {
            btnprev.classList.remove('ocultar')
        } else {
            btnprev.classList.add('ocultar')
        }


    }


}

document.addEventListener('DOMContentLoaded', main)
