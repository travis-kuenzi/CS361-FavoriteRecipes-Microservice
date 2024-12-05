import mongoose from "mongoose";

const Schema = mongoose.Schema;

let FavoriteSchema = new Schema({
    recipeID: { type: String, required: true},
    userID: { type: Schema.Types.ObjectId, ref: "User"},
    recipeImage: { type: String},
    recipeTitle: { type: String, required: true},
    recipeServings: { type: String},
    recipeReadyInMinutes: { type: String, required: true},
});

export default mongoose.model('Favorite', FavoriteSchema);