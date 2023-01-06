import fs from 'fs'

const fileToArray = async (path) => {
    try {
        return JSON.parse(await fs.promises.readFile(path))
    } catch (error) {
        console.log("Error en fileToArray: ", error);
    }
}

const arrayToFile = async (path, array) => {
    try {
        return JSON.stringify(await fs.promises.writeFile(path, JSON.stringify(array)))
    } catch (error) {
        console.log("Error en arrayToFile: ", error);
    }
}

const createNewFile = async (path) => {
    try {
        await fs.promises.writeFile(path, "[]")
    } catch (error) {
        console.log("error: en createNewFile", error);
    }
}


const fileCheck = async (path) => {
    const stats = await fs.existsSync(path)
    if (stats === false) {
        console.log(`Se creo el archivo ${path}`);
        await createNewFile(path)
    }
}

const validateFields = async (id, title, description, price, thumbnail, code) => {
    try {
        if ((title == undefined || title == "") || (description == undefined || description == "") || (price == undefined || price == "") || (thumbnail == undefined || thumbnail == "") || (code == undefined)) {
            throw new Error("ERROR AL AGREGAR PRODUCTO: TODOS LOS CAMPOS SON OBLIGATORIOS")
        } else {
            return true;
        }
    } catch (error) {
        throw error
    }
}

const idExist = async (path, id) => {
    try {
        const array = await fileToArray(path)
        const result = array.findIndex(e => e.id == id)
        return result ? true : false
    } catch (error) {
        throw error
    }
}


class ProductManager {
    constructor(path) {
        this.path = path
        this.format = 'utf-8'
    }

    async getProducts() {
        try {
            await fileCheck(this.path);
            return fileToArray(this.path);
        } catch (error) {
            throw error
        }
    }

    addProduct = async (id, title, description, price, thumbnail, code) => {
        try {
            await fileCheck(this.path)
            let array = await fileToArray(this.path)
            let length = array.length
            let index = 0
            if (length === 0) {
                index = 1;
            } else {
                index = array[length - 1].id + 1;
            }

            let producto = {
                id: index,
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code
            }

            array.push(producto)
            await arrayToFile(this.path, array)

            return producto
        } catch (error) {
            throw error;
        }
    }

    getProductById = async (id) => {
        try {
            await fileCheck(this.path);
            let array = await fileToArray(this.path);
            array = array.filter((x) => {
                return x.id === id;
            })

            if (array.length === 0) throw new Error("no se encontro el objeto")
            else return array

        } catch (error) {
            throw error
        }
    }

    updateProduct = async (obj) => {
        try {
            await fileCheck(this.path);
            let array = await fileToArray(this.path);
            let index = array?.findIndex((x) => x.id === obj.id);
            if (index === -1) throw new Error("No se encuentra el mensaje")
            else {
                array[index] = array.push(obj);
                await arrayToFile(this.path, array)
                return obj
            }
        } catch (error) {
            throw error
        }
    }

    async deleteProduct(id) {
        try {
            await fileCheck(this.path);
            let array = await fileToArray(this.path);
            let result = await idExist(this.path, id)
            if (result === false) {
                throw new Error("El id especificado no existe")
            } else {
                const result = array.findIndex(e => e.id == id)
                array.splice(result, 1)
                await arrayToFile(this.path, array)
            }
            return `Se elimino el archivo con el id : ${id}`
        } catch (error) {
            throw error
        }
    }

}

async function run() {
    createNewFile("carrito.json")
}

export default ProductManager;
