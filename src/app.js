import ProductManager from "./productManager/productManager.js";

async function run() {
    const manager = new ProductManager("carrito.json")
    console.log(await manager.addProduct(1, "Maximo", "20 años", 300, "N/T", 35));
    console.log(await manager.getProducts());
    console.log(await manager.getProductById(3));
    console.log(await manager.updateProduct({
        id: 4,
        title: "Raul",
        description: "20 años",
        price: 300,
        thumbnail: "N/T",
        code: 35
        }
    ));
    /* console.log(await manager.deleteProduct(2)); */
}

run()