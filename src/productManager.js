import fs from 'fs'

class ProductManager {
    #path
    constructor(path) {
        this.#path = path
        if (!fs.existsSync(this.#path)) {
            fs.promises.writeFile(this.#path, JSON.stringify([]));
        }
    }

    read = () => {
        if (fs.existsSync(this.#path)) {
            return fs.promises.readFile(this.#path, 'utf-8').then(r => JSON.parse(r))
        } else return []
    }
    
    updateProduct = async (productoUpdate) => {
        let productos = await this.getProducts();
        
        let productoModificado = productos.find(prod => prod.id == productoUpdate.id);
        productoModificado.title = (productoUpdate.title != null)? productoUpdate.title : productoModificado.title;
        productoModificado.description = (productoUpdate.description != null)? productoUpdate.description : productoModificado.description;
        productoModificado.price = (productoUpdate.price != null)? productoUpdate.price : productoModificado.price;
        productoModificado.thumbnail = (productoUpdate.thumbnail != null)? productoUpdate.thumbnail : productoModificado.thumbnail;
        productoModificado.code = (productoUpdate.code != null)? productoUpdate.code : productoModificado.code;
        productoModificado.stock = (productoUpdate.stock != null)? productoUpdate.stock : productoModificado.stock

        await fs.promises.writeFile(this.#path, JSON.stringify(productos));
    }
    
    
    addProduct = async (title, description, price, thumbnail, code, stock) => {
        if (await this.codeEstaRepetido(code)){
            console.log("codigo repetido")
            return
        }

        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            id: await this.getNextID() 
        };
    

        const list = await this.getProducts();
        list.push(product);
    
        
        await fs.promises.writeFile(this.#path, JSON.stringify(list));
    }

    codeEstaRepetido = async (code) => {
        let list = await this.getProducts();
        let resultado = list.find(product => product.code == code)
        if (resultado == undefined){
            return false
        }else{
            return true
        }
    }

    getNextID = async () => {
        const list = await this.getProducts();
        const count = list.length;

        if (count > 0) {
            return list[count - 1].id + 1;
        } else {
            return 1;
        }
    }

    getProductById = async (id) => {
        const list = await this.getProducts()
        const resultado = list.find(product => product.id === id)
        if (resultado === undefined) {
            return "Producto no encontrado"
        } else {
            return resultado
        }
    }


    
    deleteProduct = async (id) => {
        const list = await this.getProducts()
        const index = list.findIndex(product => product.id === id)
    
        if (index !== -1) {
            list.splice(index, 1) 
    
            await fs.promises.writeFile(this.#path, JSON.stringify(list))
    
            console.log(' producto eliminado')
        } else {
            console.log('No se encontró un producto')
        }
    }


    getProducts = async () => {
        try {
            // Leer contenido del archivo
            const data = await this.read()
            // const dataObj = JSON.parse(data) // Convertimos de string a objeto

            return data;
        } catch (error) {
            // Si no existe el archivo, retornamos una lista vacia
            console.log('No se encontro el archivo, se devuelve vacio')
            return []
        }
    }

}

async function run() {

    //const manager = new ProductManager('products.json')
   

}


run()

export  {ProductManager} 
    
  