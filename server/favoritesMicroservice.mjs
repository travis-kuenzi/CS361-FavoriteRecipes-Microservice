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

    console.log(`userID: ${data.userID}, recipeID: ${data.recipeID}\n`);

    if (data.userID && data.recipeID ) {
        const exists = await Favorite.findOne({ userID: data.userID, recipeID: data.recipeID });
        if (exists) {
            return res.json({
                message: "Already in favorites!"
            });
        }

        const newFavorite = new Favorite({
            userID: data.userID,
            recipeID: data.recipeID,
            recipeImage: data.recipeImage,
            recipeTitle: data.recipeTitle,
            recipeServings: data.recipeServings,
            recipeReadyInMinutes: data.recipeReadyInMinutes
        })
        await newFavorite.save();
        return res.json({
            message: "Successfully added to favorites!"
        })
    } else {
        return res.json({
            message: "Invalid Input!"
        })
    }
});

app.post("/removeFavorite/:favoriteID", async (req, res) => {
    console.log("Running removeFavorite...");
    
    const favoriteID = req.params.favoriteID;

    console.log(`Got favoriteID: ${favoriteID}`);

    try {
        const result = await Favorite.deleteOne({ _id: favoriteID });

        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Favorite successfully removed." });
        } else {
            res.status(404).json({ errorMessage: "Favorite not found for the given user and recipe ID." });
        }
    } catch (error) {
        console.error("Error removing favorite:", error);
        res.status(500).json({ errorMessage: "An error occurred while removing the favorite." });
    }
});


app.get("/favorites/:userID", async (req, res) => {
    const { userID } = req.params;

    try {
        // Find all favorite items for the specified userID
        const results = await Favorite.find({ userID: userID });

        // Check if any favorites were found
        if (results.length > 0) {
            return res.json({
                success: true,
                message: `Found ${results.length} favorite(s) for userID ${userID}.`,
                data: results
            });
        } else {
            return res.json({
                success: true,
                message: `No favorites found for userID ${userID}.`
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