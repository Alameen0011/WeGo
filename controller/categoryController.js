import slugify from "slugify"
import categoryModel from "../model/categoryModel.js"

export const createCategoryController = async(req,res) =>{
    try {
        const {name} =req.body
        if(!name){
            return res.status(401).send({
              message: "name is required"  
            })
        }
        const existingCategory = await categoryModel.findOne({ name })
        if(existingCategory){
             return  res.status(200).send({
                success:true,
                message:"catogery already exists"
            })
        }
        const category = await new categoryModel({name, slug:slugify(name)}).save()
        res.status(200).send({
            success:true,
            message:"new category formed",
            category,
        })



        
    } catch (error) {
        console.log(error) 
        res.status(500).send({
            success:false,
            message:"Error in category",
            error,
        })
        
    }

}

//update category

export const updateCategoryController =  async(req,res) =>{
    try {
        const {name} = req.body;
        const {id} = req.params
        const category = await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
        res.status(200).send({
            success:true,
            message:"category updated successfully",
            category,
        });



        
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            messgae:"Error in updation of  category",
            error

        })
        
    }
}


//get all cat

export const categoryController =  async(req,res) =>{
    try {
        const category = await categoryModel.find({})
        res.status(200).send({
            success:true,
            message:"all categories List",
            category,
        })



        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error while getting all categories"
        })
        
    }

}


//single item getting 
export const singleCategoryController = async(req,res) =>{

    try {
     
        const category = await categoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            message:"get single category success ",
            category



        }) 
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error while getting single category"

        })
        
    }
}


//delete item
export const deleteCategoryController = async(req,res) =>{
     try {
        const {id} = req.params
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:"category Deleted successfully"
        }) 
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error while deletion"
        })
        
    }
}


