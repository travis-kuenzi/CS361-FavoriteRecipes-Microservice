import express from 'express';
import mongoose from 'mongoose';
import { default as Favorite } from "./favoriteModel.mjs";
import { default as credentials } from "./dbCredentials.mjs";

// Connect to MongoDB
const connection_string = credentials.connection_string;
mongoose
    .connect(connection_string, {})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

const app = express();
app.use(express.json());

app.post("/addFavorite", async(req, res) => {
    const { data } = req.body;

    if (data.user && data.recipe ) {
        const newFavorite = new Favorite({
            user: data.user,
            recipe: data.recipe
        })
        await newFavorite.save();
        return res.json({
            message: "successful"
        })
    } else {
        return res.error({
            message: "Error! Failed to add to favorites."
        })
    }
});

app.get("/favorites/:user", async (req, res) => {
    const { user } = req.params;

    try {
        // Find all favorite items for the specified user
        const results = await Favorite.find({ user: user });

        // Check if any favorites were found
        if (results.length > 0) {
            return res.json({
                success: true,
                message: `Found ${results.length} favorite(s) for user ${user}.`,
                data: results
            });
        } else {
            return res.json({
                success: true,
                message: `No favorites found for user ${user}.`
            });
        }
    } catch (err) {
        // Handle any errors during the query
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching favorites.",
            error: err.message
        });
    }
});

// Start the HTTP server
const PORT = 3003;
app.listen(PORT, () => {
  console.log(`HTTP microservice running on http://localhost:${PORT}`);
});