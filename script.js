let listaProductos = [
    { id: 6, nombre: "lavarropas", categoria: "electrodomesticos", stock: 4, precio: 500000, rutaImagen: "lavarropa.jpg" },
    { id: 4, nombre: "escobas", categoria: "limpieza", stock: 8, precio: 15000, rutaImagen: "escoba.jpg" },
    { id: 2, nombre: "microondas", categoria: "electrodomesticos", stock: 5, precio: 200000, rutaImagen: "microonda.jpg" },
    { id: 9, nombre: "traposdepisos", categoria: "limpieza", stock: 6, precio: 5000, rutaImagen: "trapodepiso.jpg" },
    { id: 7, nombre: "bibliotecas", categoria: "muebles", stock: 3, precio: 80000, rutaImagen: "biblioteca.jpg" },
    { id: 1, nombre: "mesas", categoria: "muebles", stock: 7, precio: 60000, rutaImagen: "mesa.jpg" },
    { id: 5, nombre: "heladeras", categoria: "electrodomesticos", stock: 4, precio: 700000, rutaImagen: "heladera.jpg" },
]

const obtenerCarritoLS = () => JSON.parse(localStorage.getItem("carrito")) || []

principal(listaProductos)

function principal(productos) {
    renderizarCarrito()

    let botonBuscar = document.getElementById("botonBuscar")
    botonBuscar.addEventListener("click", () => filtrarYRenderizar(productos))

    let inputBusqueda = document.getElementById("inputBusqueda")
    inputBusqueda.addEventListener("keypress", (e) => filtrarYRenderizarEnter(productos, e))

    let botonVerOcultar = document.getElementById("botonVerOcultar")
    botonVerOcultar.addEventListener("click", verOcultar)

    renderizarProductos(productos)

    let botonComprar = document.getElementById("botonComprar")
    botonComprar.addEventListener("click", finalizarCompra)

    let botonesFiltros = document.getElementsByClassName("botonFiltro")
    for (const botonFiltro of botonesFiltros) {
        botonFiltro.addEventListener("click", (e) => filtrarYRenderizarProductosPorCategoria(e, productos))
    }
}

function filtrarYRenderizarProductosPorCategoria(e, productos) {
    let value = e.target.value
    let productosFiltrados = productos.filter(producto => producto.categoria === value)
    renderizarProductos(productosFiltrados.length > 0 ? productosFiltrados : productos)
}

function verOcultar(e) {
    let contenedorCarrito = document.getElementById("contenedorCarrito")
    let contenedorProductos = document.getElementById("contenedorProductos")

    contenedorCarrito.classList.toggle("oculto")
    contenedorProductos.classList.toggle("oculto")

    e.target.innerText = e?.target?.innerText === "VER CARRITO" ? "VER PRODUCTOS" : "VER CARRITO"
}

function finalizarCompra() {
    localStorage.removeItem("carrito")
    renderizarCarrito([])
}

function filtrarYRenderizarEnter(productos, e) {
    e.keyCode === 13 && renderizarProductos(filtrarProductos(productos))
}

function filtrarYRenderizar(productos) {
    let productosFiltrados = filtrarProductos(productos)
    renderizarProductos(productosFiltrados)
}

function filtrarProductos(productos) {
    let inputBusqueda = document.getElementById("inputBusqueda")
    return productos.filter(producto => producto.nombre.includes(inputBusqueda.value) || producto.categoria.includes(inputBusqueda.value))
}

function renderizarProductos(productos) {
    let contenedorProductos = document.getElementById("contenedorProductos")
    contenedorProductos.innerHTML = ""

    productos.forEach(({ nombre, rutaImagen, precio, stock, id }) => {
        let tarjetaProducto = document.createElement("div")

        tarjetaProducto.innerHTML = `
            <h3>${nombre}</h3>
            <img src=./images/${rutaImagen} />
            <h4>Precio: ${precio}</h4>
            <p>Stock: ${stock || "Sin unidades"}</p>
            <button id=botonCarrito${id}>Agregar al carrito</button>
        `

        contenedorProductos.appendChild(tarjetaProducto)
        tarjetaProducto.className= "tarjetaproducto"

        let botonAgregarAlCarrito = document.getElementById("botonCarrito" + id)
        botonAgregarAlCarrito.addEventListener("click", (e) => agregarProductoAlCarrito(e, productos))
    })
}

function agregarProductoAlCarrito(e, productos) {
    let carrito = obtenerCarritoLS()
    let idDelProducto = Number(e.target.id.substring(12))
    let posProductoEnCarrito = carrito.findIndex(producto => producto.id === idDelProducto)
    let productoBuscado = productos.find(producto => producto.id === idDelProducto)

    if (posProductoEnCarrito !== -1) {
        carrito[posProductoEnCarrito].unidades++
        carrito[posProductoEnCarrito].subtotal = carrito[posProductoEnCarrito].precioUnitario * carrito[posProductoEnCarrito].unidades
    } else {
        carrito.push({
            id: productoBuscado.id,
            nombre: productoBuscado.nombre,
            precioUnitario: productoBuscado.precio,
            unidades: 1,
            subtotal: productoBuscado.precio
        })
    }

    localStorage.setItem("carrito", JSON.stringify(carrito))
    renderizarCarrito()
}

function renderizarCarrito() {
    let carrito = obtenerCarritoLS()
    let contenedorCarrito = document.getElementById("contenedorCarrito")
    contenedorCarrito.innerHTML = ""
    carrito.forEach(producto => {
        let tarjetaProductoCarrito = document.createElement("div")
        tarjetaProductoCarrito.className = "tarjetaProductoCarrito"

        tarjetaProductoCarrito.innerHTML = `
            <p>${producto.nombre}</p>
            <p>${producto.precioUnitario}</p>
            <div class=unidades>
                <button id=dec${producto.id}>-</button>
                <p>${producto.unidades}</p>
                <button id=inc${producto.id}>+</button>
            </div>
            <p>${producto.subtotal}</p>
            <button id=eliminar${producto.id}>ELIMINAR</button>
        `
        contenedorCarrito.appendChild(tarjetaProductoCarrito)

        let botonDecUnidad = document.getElementById("dec" + producto.id)
        botonDecUnidad.addEventListener("click", decrementarUnidad)

  

        let botonEliminar = document.getElementById("eliminar" + producto.id)
        botonEliminar.addEventListener("click", eliminarProductoDelCarrito)
    })
}

function decrementarUnidad(e) {
    let carrito = obtenerCarritoLS()
    let id = Number(e.target.id.substring(3))
    let posProdEnCarrito = carrito.findIndex(producto => producto.id === id)

    carrito[posProdEnCarrito].unidades--
    carrito[posProdEnCarrito].subtotal = carrito[posProdEnCarrito].unidades * carrito[posProdEnCarrito].precioUnitario 
    localStorage.setItem("carrito", JSON.stringify(carrito))
    renderizarCarrito()


}

function eliminarProductoDelCarrito(e) {
    let carrito = obtenerCarritoLS()
    let id = Number(e.target.id.substring(8))
    carrito = carrito.filter(producto => producto.id !== id)
    localStorage.setItem("carrito", JSON.stringify(carrito))
    e.target.parentElement.remove()
}