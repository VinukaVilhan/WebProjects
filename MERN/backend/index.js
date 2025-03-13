import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';  // Import the connectDB function
import productRoutes from './routes/productRoute.js';

dotenv.config();

const app = express();

const PORT = Process.env.PORT;

// Test route
app.get("/", (req, res) => {
    res.send("server is ready");
});

// middleware (allows to accept JSON data in the req.body)
app.use(express.json());

app.use("/api/products", productRoutes);

// Start the server and connect to the database
app.listen(PORT, async () => {
    await connectDB();  // Call the connectDB function to connect to MongoDB
    console.log("Server started at http://localhost:5000");
});
