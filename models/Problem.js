import mongoose from "mongoose";

const problem_schema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    input_format: { type: String },
    output_format: { type: String },
    constraints: [{ type: String }],
    testcases: [
        {
            input: { type: String, required: true },
            is_hidden: { type: Boolean },
            expected_output: { type: String },
            explanation: { type: String },
            score: { type: Number },
        },
    ],
    time_limit: { type: Number },
    memory_limit: { type: Number },
    is_public: { type: Boolean },
    wrong_submissions: { type: Number, default: 0 },
    correct_submissions: { type: Number, default: 0 },
    creator_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: { type: Number, default: 0 },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        required: true,
    },
    tags: [{ type: String }],
});

export const Problem = mongoose.model("Problem", problem_schema);
