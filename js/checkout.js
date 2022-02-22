import {
    guardarLocal,
    darFormatoMoneda } from '../js/funciones.js'

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

//FUNCIÓN MONTO TOTAL PRODUCTOS EN CARRITO */
const montoTotalProductos = () => {
  let total = 0
  if (shopCartItems.length != 0) {
      shopCartItems.forEach(item => {
          total += item.precio * item.cantidad //  Se suman los montos en cada iteracion en el carrito.
      })
      total = darFormatoMoneda(total, 0)
      return total
  } else 
    { total = darFormatoMoneda(total, 0)
      return total
    }
}

//FUNCIÓN TOTAL A PAGAR EN 3 CUOTAS */
const total3Cuotas = (dato) => {
  let total = 0
  if (shopCartItems.length != 0) {
      shopCartItems.forEach(item => {
          total += item.precio * item.cantidad //  Se suman los montos en cada iteracion en el carrito.
      })
      total = total / 3
      total = darFormatoMoneda(total, 0)
      return total // Se retorna el total con formato de moneda.
  }else{
      total = darFormatoMoneda(total, 0)
      return total
  }
}

// FUNCIÓN TOTAL A PAGAR EN 6 CUOTAS 
const total6Cuotas = (dato) => {
  let total = 0
  if (shopCartItems.length != 0) {
      shopCartItems.forEach(item => {
          total += item.precio * item.cantidad //  Se suman los montos en cada iteracion en el carrito.
      })
      total = (total / 6) * 1.15
      total = darFormatoMoneda(total, 0)
      return total // Se retorna el total con formato de moneda.
  }else{
      total = darFormatoMoneda(total, 0)
      return total
  }
}

  
  // FUNCIÓN DE INGRESO PRODUCTO SELECCIONADO AL CARRITO
  
  export const ingresoCarrito = (item) => {
    let products
    const itemExistsInCart = shopCartItems.some(product => product.id === item.id) // Revisar si el item ya fue agregado al carrito.
    if (itemExistsInCart) {
        products = shopCartItems.map(product => { // Se recorre el array de productos para actualizar la cantidad.
            if (product.id === item.id) {
                product.cantidad++
                return product // Devuelve el item con el parametro cantidad modificada.
            } else {
                return product // Devuelve le item con el parametro cantidad sin modificar.
            }
        })
        shopCartItems = [...products] // Se actualiza el array de productos.
    } else {
          item.cantidad = 1
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


// FUNCION PARA BORRAR EL CARRITO AL CLICKEAR EN "COMPRAR"
const checkBorradoTotal = () => {
  const radioInputClickCkeck = document.querySelectorAll('.paymentP') // Se seleccionan los radio inputs
  const btnDeleteTotal = document.querySelector('#deleteAll') //Se selecciona la parte del DOM que tiene el boton Comprar
  
  radioInputClickCkeck.forEach(btn => {
      btn.addEventListener('click', (e) => {
          e.stopPropagation()   
          if (e) {      
              $("#deleteAll").fadeIn(1500)
              
          }else{btnDeleteTotal.style.display="none"} 
      }) 
  })

  //Animacion al dar click en Comprar
  $("#deleteAll").click((e) => { 
      $('body').prepend('<div id="popup2"> COMPRA EXITOSA! <br>Nos contactaremos con ud. para coordinar el pago </div>')
      $('#popup2')
      .fadeIn(2500)
        .delay(1200)
        .fadeOut(1500, function(){$(this).remove()})
      shopCartItems = []
      localStorage.setItem('shopCartItems', JSON.stringify(shopCartItems))
      renderizarCarrito()
  })
}
  
  // MAQUETAR CARRITO ////
const renderizarCarrito = () => {
    const cartContainer = document.querySelector('.carrito') //Se selecciona el carrito
    const divOrderCheckout = document.querySelector('#ordercheckout') //Se selecciona el div del menu de pago

    cartContainer.innerHTML = "" // Se limpia el contenido del DOM.
    divOrderCheckout.innerHTML = "" // Se limpia el contenido del DOM.

    const carroVacio = document.querySelector('#carro-vacio')
    if (shopCartItems.length === 0) { // Se muestra un alerta si el carrito esta vacio.
      carroVacio.innerHTML = `Tu carrito esta vacío, comienza agregando productos. <a href="./store.html">Ir a tienda ></a>`
      divOrderCheckout.innerHTML = "" //Se oculta el menú de pago
       
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

      // Se imprime el menú de pago
    divOrderCheckout.innerHTML= `
    <div>
        <div class="col-xs-12 col-sm-8">

            <div class="h3"><strong>FORMA DE PAGO</strong></div><br>
            <div class="input-radio" id="pago-efectivo">
                <input type="radio" class="paymentP" name="payment" id="payment-1">
                <label for="payment-1">
                    Contado
                </label>
                <div class="caption" id="divContado">
                </div>
            </div>
            <div class="input-radio" id="pago-3Cuotas">
                <input type="radio" class="paymentP" name="payment" id="payment-2">
                <label for="payment-2">
                    3 Cuotas (Sin Interés)
                </label>
                <div class="caption" id="div3C">
                </div>
            </div>
            <div class="input-radio" id="pago-6Cuotas">
                <input type="radio" class="paymentP" name="payment" id="payment-3">
                <label for="payment-3">
                    6 Cuotas (15% de Interés)
                </label>
                <div class="caption" id="div6C">
                </div>
            </div>
        </div>
        <div class="col-xs-12 col-sm-4">
          <hr class="offset-md">
              <div id="divBtnPlaceOrder">
              <a style="none" href="#"><button type="button" style="display: none;" class="btn btn-primary pull-right" id="deleteAll">Confirmar compra</button> </a>
              </div>
          <hr class="offset-md">
        </div>
    </div> 
    
    `
    checkBorradoTotal() 
    const totalContado = document.querySelector('#divContado')
    totalContado.innerHTML = `<h4>El monto total a pagar es de ${montoTotalProductos()}</h4>`
    const total3C = document.querySelector('#div3C')
    total3C.innerHTML = `<h4>Deberá abonar 3 cuotas de ${total3Cuotas()}</h4>`
    const total6C = document.querySelector('#div6C')
    total6C.innerHTML = `<h4>Deberá abonar 6 cuotas de ${total6Cuotas()}</h4>`
   
   
  }
  borrarItem()
  cambiarCantidad()
}

//INICIAMOS EL CARRITO
renderizarCarrito()

