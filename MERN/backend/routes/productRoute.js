import express from "express";
import { updateProduct } from "../controllers/productController.js";
import { getProducts } from "../controllers/productController.js";
import { postProduct } from "../controllers/productController.js";
import { deleteProduct } from "../controllers/productController.js";

const router = express.Router();

router.post("/", postProduct);

router.delete("/:id", deleteProduct);

router.put("/:id",updateProduct);


router.get("/", getProducts);

export default router;