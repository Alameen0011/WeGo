import express from 'express'
import { isAdmin, requiredSignIn } from '../middlewares/authMiddleware.js';
import { categoryController, createCategoryController , deleteCategoryController, singleCategoryController, updateCategoryController } from '../controller/categoryController.js';

const router = express.Router();

//routes
//create category
router.post('/create-category',requiredSignIn,isAdmin, createCategoryController)

// update category
router.put('/update-category/:id',requiredSignIn,isAdmin, updateCategoryController)

//getAll category
router.get('/get-category' , categoryController)

//single category
router.get('/single-category/:slug', singleCategoryController)

//delete category
router.delete('/delete-category/:id', requiredSignIn, isAdmin, deleteCategoryController)


export default router