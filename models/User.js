import mongoose from "mongoose";

const user_schema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    description: { type: String },
    password: { type: String, required: true },
    submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Submission" }],
    solved_problems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }],
});

export const User = mongoose.model("User", user_schema);
