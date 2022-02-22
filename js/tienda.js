import {
  darFormatoMoneda,
  guardarLocal,
   } from './funciones.js'


// REALIZO LECTURA DEL CARRITO
let shopCartItems = JSON.parse(localStorage.getItem('shopCartItems')) || []

// TRAIGO MI STOCK
const URLJSON = './data/stock.json'


//FUNCIÓN BORRADO INDIVIDUAL DE ITEM
const borrarItem = () => {
    const btnDeleteItem = document.querySelectorAll('a[href="#remove"]') // Se seleccionan todos los botones de borrado sobre la el carrito.
    btnDeleteItem.forEach(btn => {   // Se recorren y se escucha si alguno fue pulsado
        btn.addEventListener('click', (e) => {  // Se escucha el evento click sobre el boton.
            e.stopPropagation() // Se detiene la propagacion del evento.
            let deleteItem = parseInt(btn.id) // Se reconoce el boton pulsado por su numero de id. Coincidente con el código de producto.
            const btnAdd = document.querySelector(`.btn-agregar[id="${deleteItem}"]`) // Se selecciona el boton de agregar con el mismo código de producto.
            activarDesactivarBtn(btnAdd, true) // Se activa el boton de agregar al quitar el producto del carrito.
            shopCartItems = JSON.parse(localStorage.getItem('shopCartItems')) // Se lee el array almacenado en el localStorage.
            const DeleteItem = shopCartItems.findIndex(item => item.id === deleteItem)
            shopCartItems.splice(DeleteItem, 1) // Se ejecuta el borrado.           
            guardarLocal('shopCartItems', JSON.stringify(shopCartItems)) // Se almacena el array con el item borrado. 
            renderizarCarrito() // Se recarga la pagina. 
        })
    })
  } 


//**FUNCIÓN DE INGRESO PRODUCTO SELECCIONADO AL CARRITO */
const ingresoCarrito = (item) => {
    let products
    const itemExistsInCart = shopCartItems.some(product => product.id === item.id) // Revisar si el item ya fue agregado al carrito.
    if (itemExistsInCart) {
        products = shopCartItems.map(product => { // Se recorre el array de productos para actualizar la cantidad.
            if (product.id === item.id) {
                product.cantidad++  //Si encuentra el producto en el carrito aumenta la cantidad
                return product // Devuelve el item con el parametro cantidad modificada.
            } else {
                return product // Devuelve le item con el parametro cantidad sin modificar.
            }
        })
        shopCartItems = [...products] // Se actualiza el array de productos.
    } else {
          item.cantidad = 1 //Si no existe en el carrito se le coloca cantidad 1
          shopCartItems = [...shopCartItems, item] // Se agrega el item al array de carrito.
    }
    guardarLocal('shopCartItems', JSON.stringify(shopCartItems)) // Se almacena en el localStorage el nuevo objeto-item creado.
    renderizarCarrito() // Se refresca el navegador para que se muestren los cambios.
  }

//FUNCION PARA INCREMENTAR O DECREMENTAR LA CANTIDAD DE ITEMS MEDIANTE BOTONES
const cambiarCantidad = () => {
    const btnQuantity = document.querySelectorAll('.btn-cantidad')
    btnQuantity.forEach(btn => {   // Se recorren y se escucha si alguno fue pulsado
        btn.addEventListener('click', (e) => {  // Se escucha el evento click sobre el boton.
            e.stopPropagation() // Se detiene la propagacion del evento.
            let itemChange = parseInt(btn.id) // Se reconoce el boton pulsado por su numero de id. Coincidente con el código de producto.
            if (e.target.classList.contains('btn-sumar')) { // Se verifica si el boton fue pulsado para incrementar o decrementar.
                shopCartItems = JSON.parse(localStorage.getItem('shopCartItems')) // Se lee el array almacenado en el localStorage.
                const product = shopCartItems.find(item => item.id === itemChange)
                product.cantidad++ // Se incrementa la cantidad del producto.
                guardarLocal('shopCartItems', JSON.stringify(shopCartItems))// Se almacena el array con el item borrado.
                renderizarCarrito()// Se verifica si el boton fue pulsado para incrementar o decrementar.
            } else if (e.target.classList.contains('btn-restar')) {
                const product = shopCartItems.find(item => item.id === itemChange)
                if (product.cantidad > 1) {
                    product.cantidad-- // Se decrementa la cantidad del producto.
                    guardarLocal('shopCartItems', JSON.stringify(shopCartItems)) // Se almacena el array con el item borrado.
                    renderizarCarrito()// Se verifica si el boton fue pulsado para incrementar o decrementar.
                } else { btn.disabled = true }
              }
        }
        )
    })
}
    


// FUNCION PARA MAQUETAR EL CATALOGO
function initCatalog(){
  $.getJSON(URLJSON, function (respuesta, estado) {
    if(estado === "success"){
      let stock = respuesta
      for (const elemento of stock) { //Maqueto cada item que haya en stock
        $('.products').append(
          `<div class="col-sm-6 col-md-4 product" id="prod${elemento.id}">
            <div class="body">
            <a><img src=${elemento.imagen} /></a>

            <div class="content">
              <h1 class="h3">${elemento.nombre}</h1>
              <p class="price">$${elemento.precio}</p>
              <label>${elemento.tipo}</label>
              <div>
              <a class="btn btn-link"><ion-icon name="folder-open-outline"></ion-icon>Detalles</a>
              <button id="${elemento.id}" class="btn btn-primary btn-sm rounded btn-agregar"> <ion-icon name="cart-outline"></ion-icon> Añadir</button>
              </div>
            </div>
          </div>
        </div>`)
      checkeoBotones(elemento) //Funcion que checkea el estado con el que tienen que iniciar los botones al cargar la pagina

      }
      detectarBotones(stock)
    }
  })
}

// FUNCION QUE DETECTA SI ALGUN BOTON DE AGREGAR FUE PULSADO
const detectarBotones = (stock) => {
  const buttons = document.querySelectorAll('.product button')
  buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
          e.stopPropagation()
          activarDesactivarBtn(btn, false)
          const product = stock.find(item => item.id === parseInt(btn.id))

          if (shopCartItems.length === 0 || product.cantidad === undefined) { // Se agrega el producto al carrito.

              product.cantidad = 1
          }
          ingresoCarrito(product) // Se ingresa el producto al carrito.

          //Funcion que hace la animacion de elemento añadido al carrito
          $(`#prod${btn.id}`).prepend('<h4 style="display:none" id="popup"> Producto agregado al carrito! </h4>')
          $('h4')
          .fadeIn(1500)
            .delay(700)
            .fadeOut(1500, function(){$(this).remove()})
      })
  })
}

//FUNCION PARA CHECKEAR SI ALGUN ELEMENTO ESTÁ EN EL CARRITO Y DESHABILITAR EL BOTON AÑADIR
const checkeoBotones = (elemento)=>{
     shopCartItems.map(product => { // Se recorre el array de productos del carrito.
      if(product.id === elemento.id){
      const btnAdd = document.querySelector(`.btn-agregar[id="${elemento.id}"]`) // Se selecciona el boton de agregar con el mismo código de producto.
      activarDesactivarBtn(btnAdd, false) // Se envía el boton a desactivar.
      }    
    })
    }
  
// FUNCION PARA HABILITAR/DESHABILITAR EL BOTON AGREGAR
const activarDesactivarBtn = (btn, activate) => {

  if (activate) {
      btn.disabled = false
      btn.innerHTML = '<ion-icon name="cart-outline"></ion-icon> Añadir'
      btn.className = 'btn btn-primary btn-sm rounded btn-agregar'
  } else {
      btn.disabled = true
      btn.innerHTML = 'Añadido'
      btn.className = 'background-disabled btn btn-primary btn-sm rounded btn-agregar'
  }
}



// FUNCION PARA DIBUJAR LA CANTIDAD DE PRODUCTOS AGREGADOS AL CARRITO
const cantidadTotalProductos = () => {
  let cantidadTotal = 0
  if (shopCartItems.length != 0) {
      shopCartItems.forEach(item => {
          cantidadTotal += item.cantidad
      })
      return cantidadTotal // Se retorna el total.
  }
}

 // MAQUETAR CARRITO ////
const renderizarCarrito = () => {
  const cartContainer = document.querySelector('.carrito')
  const divOrderCheckout = document.querySelector('.checkout')
  const cartQty = document.querySelector('#cartDropdown')
  cartContainer.innerHTML = "" // Se limpia el contenido del DOM.
  divOrderCheckout.innerHTML = "" // Se limpia el contenido del DOM
  cartQty.innerHTML = ""  // Se limpia el contenido del DOM.

  const carroVacio = document.querySelector('#carro-vacio')
  if (shopCartItems.length === 0) { 
    carroVacio.innerHTML = `Tu carrito esta vacío, comienza agregando productos` //Se muestra el mensaje de carro vacio
    divOrderCheckout.innerHTML = "" //No se muestra el boton de "Ir a Pagar"

    cartQty.innerHTML = `<ion-icon name="cart-outline"></ion-icon>` //Se imprime solo el icono del carrito
     
  } else {
    carroVacio.innerHTML = ``// Se oculta el alerta si el carrito no esta vacio.
    shopCartItems.forEach((item) => {
      const { id, nombre, precio, imagen, tipo, cantidad } = item // Se obtienen los datos del product.
      const precioFormateado = darFormatoMoneda(precio, 0) // Se formatea el precio.
      const precioPorCantidad = darFormatoMoneda(precio * cantidad, 0) // Se calcula el precio por cantidad.
      cartContainer.innerHTML += `
      <div class="media">
  
        <div class="media-left">
          <a href="#">
            <img class="media-object" src=${imagen} />
          </a>
        </div>
  
        <div class="media-body">
          <h2 class="h4 media-heading">${nombre}</h2>
          <label>${tipo}</label>
          <p class="price">${cantidad}x ${precioFormateado}</p>
          <p class="price text-red">Subtotal: ${precioPorCantidad}</p>
        </div>
  
        <div class="controls">
          <div class="input-group">
            <span class="input-group-btn">
              <button class="btn btn-default btn-sm btn-cantidad btn-restar" id="${id}" type="button">-</button>
            </span>
  
            <input type="text" class="form-control input-sm btn-cantidad" id="${id}" placeholder="Qty" value="${cantidad}" readonly="">
            
            <span class="input-group-btn">
              <button class="btn btn-default btn-sm btn-cantidad btn-sumar" id="${id}" type="button">+</button>
            </span>
          </div>
          <a href="#remove" id="${id}"><i class="ion-trash-b"></i> Quitar</a>
        </div>
    </div>
    
    `
    })
  //Se renderiza el ícono de carrito con la cantidad actualizada
  cartQty.innerHTML =`<div><p class="cantidad-carrito">${cantidadTotalProductos()}</p><ion-icon name="cart-outline" size="large"></ion-icon></div>`

  //Maqueto el boton comprar si hay items en el carrito
  divOrderCheckout.innerHTML += `          
  <div class="row">
    <div class="col-xs-12 col-sm-12 align-right">
      <a class="btn btn-primary" href="./checkout.html"> Ir a Pagar </a>
    </div>
  </div>
  `
  
  }
  borrarItem()
  cambiarCantidad()
}


//INICIAMOS LAS FUNCIONES
initCatalog()
renderizarCarrito()


            