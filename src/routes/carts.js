import { Router } from 'express'
import { CartManager } from '../cartManager.js'

const cartManager = new CartManager('carts.json')
const router = Router()



router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid
  const carts = await cartManager.getCarts()

  const cart = carts.find(cart => cart.id === cartId)
  if (!cart) {
    return res.status(404).json({ status: 'error', message: 'carrito no encontrado' })
  }

  const products = cart.products
  res.json({ status: 'success', products })
  }
)



router.post('/', async (req, res) => {
  const { products } = req.body

  const cartId = cartManager.generateCartId()
  const newCart = {
    id: cartId,
    products: products || []
  }

  await cartManager.addCart(newCart)

  res.status(201).json({ status: 'success', message: 'carrito creado', cart: newCart }) 
  }
)

router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid
  const productId = req.params.pid
  const carts = await cartManager.getCarts()

  const cart = carts.find(cart => cart.id === cartId)
  if (!cart) {
    return res.status(404).json({ status: 'error', message: 'cart not found' })
  }

  const existingProduct = cart.products.find(product => product.product === productId)
  if (existingProduct) {
    existingProduct.quantity++
  } else {
    const newProduct = { product: productId, quantity: 1 }
    cart.products.push(newProduct)
  }

  await cartManager.saveCarts(carts)

  res.json({ status: 'success', message: 'producto añadido al carrito' })
  }
)




export default router