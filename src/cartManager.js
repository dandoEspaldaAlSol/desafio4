import fs from 'fs'

class CartManager {
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

    getCarts() {
        return new Promise((resolve, reject) => {
          fs.readFile(this.#path, 'utf8', (err, data) => {
            if (err) {
              if (err.code === 'ENOENT') {
                
                resolve([])
              } else {
                reject(err)
              }
            } else {
              const carts = JSON.parse(data);
              resolve(carts)
            }
          })
        })
      }
      
      saveCarts(carts) {
        return new Promise((resolve, reject) => {
          const data = JSON.stringify(carts, null, 2)
          fs.writeFile(this.#path, data, 'utf8', err => {
            if (err) {
              reject(err)
            } else {
              resolve()
            }
          })
        })
      }
      
      async addCart(newCart) {
        const carts = await this.getCarts()
        carts.push(newCart)
        await this.saveCarts(carts)
      }

    async generateCartId() {
        const carts = await this.getCarts()
        const maxId = carts.reduce((max, cart) => Math.max(max, cart.id), 0)
        return maxId + 1
      }

}

export { CartManager }
