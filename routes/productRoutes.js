import express from 'express';
import { isAdmin, requiredSignIn } from '../middlewares/authMiddleware.js';
import { createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFilterController, productPageController, productPhotoController, relatedProductController, searchProductController, updateProductController } from '../controller/productController.js';
import formidable from 'express-formidable'

const router = express.Router()

//routes
router.post('/create-product',requiredSignIn,isAdmin,formidable(),createProductController)

//update route
router.put('/update-product/:id',requiredSignIn,isAdmin,formidable(),updateProductController)

//get products 
router.get('/get-product',getProductController);

//single product
router.get('/get-product/:slug',getSingleProductController);

//get photo
router.get('/product-photo/:pid',productPhotoController)

//delete product
router.delete('/product/:pid', deleteProductController)

//initials finished

//filter prooduct 
router.post('/product-filters',productFilterController)

//count product on loading things
router.get('/product-count',productCountController)

//product per page 
router.get('/product-list/:page',productPageController)

//search product find 
router.get('/search/:keyword',searchProductController)

//similar product 
router.get('/related-product/:pid/:cid',relatedProductController)

//category wise product
router.get('/product-category/:slug',productCategoryController)


export default router

