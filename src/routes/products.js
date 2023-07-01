import {Router} from 'express'
import {ProductManager} from '../productManager.js'

const productManager = new ProductManager('products.json')
const router = Router()

const products =[]

router.get('/', (req, res)=>{
  res.send({products})
})

router.get('/', async (req, res) => {
  const products = await productManager.getProducts()
  const limit = req.query.limit
 
  if (limit) {
      const limitValue = parseInt(limit)
  if (!isNaN(limitValue)) {
        const limitedProducts = products.slice(0, limitValue)
       
        return res.json(limitedProducts)
      }
    }
 
   res.json(products)
}
)

router.get('/:id', async (req, res) => {
  const products = await productManager.getProducts()
  const sentById = req.params.id

  if (sentById) {
    const userFiltered = products.filter(u => u.id.toString().toLowerCase() === sentById.toLowerCase())
    return res.json(userFiltered)
  }

  res.json(products)
  }
)


router.post('/', async (req, res) => {
    const { title, description, price, thumbnail, code, stock, id } = req.body
    
    await productManager.addProduct(title, description, price, thumbnail, code, stock, id)
    
    res.status(201).json({ status: 'success', message: 'product created' })
  }
)


router.delete('/:id', async (req, res) => {
  const productId = req.params.id
  
  await productManager.deleteProduct(productId)
  
  res.json({ status: 'success', message: 'producto eliminado' })
  }
)

router.put('/:id', async (req, res) => {
  const productId = req.params.id
  const { title, description, price, thumbnail, code, stock } = req.body;

  await productManager.updateProduct(productId, {
    title,
    description,
    price,
    thumbnail,
    code,
    stock
  })

  res.json({ status: 'success', message: 'producto actualizado' })
  }
)


export default router