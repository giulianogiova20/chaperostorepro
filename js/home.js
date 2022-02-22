import {
  darFormatoMoneda
} from '../js/funciones.js'

// REALIZO LECTURA DEL CARRITO
let shopCartItems = JSON.parse(localStorage.getItem('shopCartItems')) || []



  //FUNCIÓN BORRADO INDIVIDUAL DE ITEM
const borrarItem = () => {
    const btnDeleteItem = document.querySelectorAll('a[href="#remove"]') // Se seleccionan todos los botones de borrado sobre la el carrito.
    btnDeleteItem.forEach(btn => {   // Se recorren y se escucha si alguno fue pulsado
        btn.addEventListener('click', (e) => {  // Se escucha el evento click sobre el boton.
            e.stopPropagation() // Se detiene la propagacion del evento.
            let deleteItem = parseInt(btn.id) // Se reconoce el boton pulsado por su numero de id. Coincidente con el código de producto.
            shopCartItems = JSON.parse(localStorage.getItem('shopCartItems')) // Se lee el array almacenado en el localStorage.
            const DeleteItem = shopCartItems.findIndex(item => item.id === deleteItem)
            shopCartItems.splice(DeleteItem, 1) // Se ejecuta el borrado.           
            localStorage.setItem('shopCartItems', JSON.stringify(shopCartItems)) // Se almacena el array con el item borrado. 
            renderizarCarrito() // Se recarga la pagina.  
        })
    })
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
                localStorage.setItem('shopCartItems', JSON.stringify(shopCartItems)) // Se almacena el array con el item borrado.
                renderizarCarrito()// Se verifica si el boton fue pulsado para incrementar o decrementar.
    
            } else if (e.target.classList.contains('btn-restar')) {
                const product = shopCartItems.find(item => item.id === itemChange)
                if (product.cantidad > 1) {
                    product.cantidad-- // Se decrementa la cantidad del producto.
                    localStorage.setItem('shopCartItems', JSON.stringify(shopCartItems)) // Se almacena el array con el item borrado.
                    renderizarCarrito()// Se verifica si el boton fue pulsado para incrementar o decrementar.
                } else { btn.disabled = true }
              }
        }
        )
    })
}
    
const cantidadTotalProductos = () => {
  let cantidadTotal = 0
  if (shopCartItems.length != 0) {
      shopCartItems.forEach(item => {
          cantidadTotal += item.cantidad
      })
      return cantidadTotal // Se retorna el total con formato de moneda.
  }
}

 // MAQUETAR CARRITO ////
const renderizarCarrito = () => {
  const cartContainer = document.querySelector('.carrito')
  const divOrderCheckout = document.querySelector('.checkout')
  const cartQty = document.querySelector('#cartDropdown')
  cartContainer.innerHTML = "" // Se limpia el contenido del DOM.
  divOrderCheckout.innerHTML = "" // Se limpia el contenido del DOM.
  cartQty.innerHTML = ""  // Se limpia el contenido del DOM.

  const carroVacio = document.querySelector('#carro-vacio')
  if (shopCartItems.length === 0) { // Se muestra un alerta si el carrito esta vacio.
    carroVacio.innerHTML = `Tu carrito esta vacío, comienza agregando productos`
    divOrderCheckout.innerHTML = "" //No se muestra el boton de "Ir a Pagar"
    cartQty.innerHTML = `<ion-icon name="cart-outline"></ion-icon>` 

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

  borrarItem()
  cambiarCantidad()
  divOrderCheckout.innerHTML = `          
  <div class="row">
    <div class="col-xs-12 col-sm-12 align-right">
      <a class="btn btn-primary" href="./checkout.html"> Ir a Pagar </a>
    </div>
  </div>
  `
  //Maqueto el boton comprar si hay items en el carrito
  }
}


//INICIAMOS LAS FUNCIONES

renderizarCarrito()
