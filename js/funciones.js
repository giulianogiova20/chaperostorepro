//GUARDO OBJETOS EN EL LOCAL STORAGE
export const guardarLocal = (clave, valor) => {localStorage.setItem(clave, valor)} //Funcion Gral. para guardar obj en el LStorage

//**DAR FORMATO DE MONEDA A LOS MONTOS */
export const darFormatoMoneda = (value, tenths) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: tenths,
    }).format(value)
  };
  
