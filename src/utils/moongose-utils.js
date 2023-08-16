/**
 * Función para obtener las opciones de ordenamiento según el parámetro
 * @param {*} sortBy
 * @returns
 */
function getSortOptions(sortBy) {
  switch (sortBy) {
    case 'minprice':
      return { price: 1 } // Ordenar por precio ascendente
    case 'maxprice':
      return { price: -1 } // Ordenar por precio descendente
    case 'az':
      return { name: 1 } // Ordenar alfabéticamente de A a Z
    case 'za':
      return { name: -1 } // Ordenar alfabéticamente de Z a A
    default:
      return { createdAt: -1 } // Ordenar por fecha de creación descendente por defecto
  }
}

module.exports = { getSortOptions }
