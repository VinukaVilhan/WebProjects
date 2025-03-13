import mongoose from "mongoose";
import Product from "../models/productModel.js";

export const getProducts = async(req,res)=> {
    try {
        const products = await Product.find({});
        res.status(200).json({success:true, message:"Products Found"});
    } catch (error) {
        console.error("Error Finding products", error.message);
        res.status(400).json({success:false, message:"Products not Found"});
    }
};

export const postProduct = async (req, res) => {
    const { name, price, image } = req.body;

    if (!name || !price || !image) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    const newProduct = new Product({
        name,
        price,
        image
    });

    try {
        await newProduct.save();
        res.status(200).json({ success: true, data: newProduct });
    } catch (error) {
        console.error("Error creating product", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const deleteProduct = async (req,res) =>{
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id))
    {
        return res.status(404).json({success:false, message: "Invalid product ID"});
    }

    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({success:true, message:"Product deleted"});
    } catch (error) {
        console.error("Error deleting product", error.message);
        res.status(400).json({success:false, message:"Product not deleted"});
        
    }
};


export const updateProduct =  async (req, res) => {
    const { id } = req.params;
    const productData = req.body;

    try {
        const updated = await Product.findByIdAndUpdate(id, productData, { new: true });
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
}