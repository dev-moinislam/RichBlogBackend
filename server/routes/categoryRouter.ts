import express from 'express'
import categoryCtrl from '../controllers/blogCategoryCtrl'

const router = express.Router()

router.route('/category')
  .get(categoryCtrl.getCategories)
  .post(categoryCtrl.createCategory)

router.route('/category/:id')
  .put(categoryCtrl.updateCategory)
  .delete(categoryCtrl.deleteCategory)




export default router;