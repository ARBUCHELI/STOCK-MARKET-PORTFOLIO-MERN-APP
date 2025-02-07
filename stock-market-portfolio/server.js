const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/stocks', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

const db = mongoose.connection;

// Stock schema and model
const stockSchema = new mongoose.Schema({
    company: String,
    description: String,
    initial_price: Number,
    price_2002: Number,
    price_2007: Number,
    symbol: String,
});

const Stock = mongoose.model("Stock", stockSchema);

// Function to insert data from JSON file
const insertStocksFromFile = async () => {
    try {
        const data = fs.readFileSync('stocks.json', 'utf8');
        const stocks = JSON.parse(data);

        // Check if data already exists to avoid duplicates
        const count = await Stock.countDocuments();
        if (count === 0) {
            await Stock.insertMany(stocks);
            console.log("Data inserted successfully");
        } else {
            console.log("Data already exists in the database");
        }
    } catch (error) {
        console.error("Error inserting data:", error);
    }
};

// Insert data when the connection is established
db.once('open', () => {
    console.log("Connected to MongoDB");
    insertStocksFromFile();
});

// API endpoints
app.get("/api/stocks", async (req, res) => {
    try {
        const stocks = await Stock.find();
        res.json(stocks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/api/watchlist", async (req, res) => {
    try {
        const { company, description, initial_price, price_2002, price_2007, symbol } = req.body;
        const stock = new Stock({
            company,
            description,
            initial_price,
            price_2002,
            price_2007,
            symbol,
        });
        await stock.save();
        res.json({ message: "Stock added to watchlist successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE endpoint for removing a stock from the watchlist
app.delete("/api/watchlist/:symbol", async (req, res) => {
    try {
        const { symbol } = req.params;
        console.log("Attempting to delete stock with symbol:", symbol);

        const deletedStock = await Stock.findOneAndDelete({ symbol });

        if (!deletedStock) {
            return res.status(404).json({ error: "Stock not found" });
        }

        res.json({ message: "Stock removed from watchlist successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
