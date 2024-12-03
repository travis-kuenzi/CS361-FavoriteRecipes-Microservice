import mongoose from "mongoose";

const Schema = mongoose.Schema;

let FavoriteSchema = new Schema({
    recipe: { type: String, required: true},
    user: { type: Schema.Types.ObjectId, ref: "User"},
});

export default mongoose.model('Favorite', FavoriteSchema);