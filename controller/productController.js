import slugify from "slugify";
import productModel from "../model/productModel.js";
import fs from "fs";
import categoryModel from "../model/categoryModel.js";

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !description:
        return res.status(500).send({ error: "description is required" });
      case !price:
        return res.status(500).send({ error: "price is required" });
      case !category:
        return res.status(500).send({ error: "category is required" });
      case !quantity:
        return res.status(500).send({ error: "quantity s required" });
      case !photo && photo.size > 100000:
        return res
          .status(500)
          .send({ error: "photo  is required and should be less than 1mb" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.ContentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "PRoduct created successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creation of Products",
    });
  }
};

//gett all prodcts
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate('category')
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
      console.log(products)
    res.status(200).send({
      success: true,
      countTotal: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting products",
    });
  }
};

//get single products
export const getSingleProductController = async (req, res) => {
  try {
    const products = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate('category');
    console.log("fetched product:", products);
    
 return res.status(200).send({
      success: true,
      message: "Single PROdut",
      products,
    });
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error while GETTING single product",
    });
  }
  
};

//get product photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.ContentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while GETTING single product",
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !description:
        return res.status(500).send({ error: "description is required" });
      case !price:
        return res.status(500).send({ error: "price is required" });
      case !category:
        return res.status(500).send({ error: "category is required" });
      case !quantity:
        return res.status(500).send({ error: "quantity s required" });
      case !photo && photo.size > 100000:
        return res
          .status(500)
          .send({ error: "photo  is required and should be less than 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.id,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.ContentType = photo.type;
    }
    console.log(products)
    await products.save();
    res.status(201).send({
      success: true,
      message: "PRoduct created successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creation of Products",
    });
  }
};
//fiilters
export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in filtering",
    });
  }
};

//loading product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in product count",
    });
  }
};

//product list base on  page
export const productPageController = async (req, res) => {
  try {
    const perPage = 2;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
      res.status(200).send({
        success:true,
        products,

      })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in product page",
    });
  }
};


//search product
export const searchProductController= async(req,res) =>{
  try {
    const {keyword}  = req.params
    const results = await productModel.find({
      $or: [
        {name:{$regex:keyword, $options:"i"}},
        {description:{$regex:keyword, $options:"i"}}
      ]
    }).select('-photo')
   res.json(results)

    
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:"Erro r in search"
    })
  }
}


//related product controller
export const relatedProductController = async(req,res) =>{
  try {
    const {pid,cid} = req.params
    const products = await productModel.find({
      category:cid,
      _id:{$ne: pid}

    }).select('-photo').limit(3).populate('category')
    res.status(200).send({
      success:true,
       products,
    })
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:"Error while getting related product"

    })
  };




}

  //get product by category

export const productCategoryController =  async(req,res) =>{
  try {
    const category = await categoryModel.findOne({slug:req.params.slug})
    const product = await productModel.find({category}).populate('category')
    res.status(200).send({
      success:true,
      category,
      product,

    })
    
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success:false,
      error,
      message:"Error while getting product"
    })
  }

}
