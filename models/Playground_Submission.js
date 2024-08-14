import mongoose from "mongoose";

export const playground_submission_schema = new mongoose.Schema(
    {
        code: { type: String, required: true },
        language: {
            type: String,
            enum: ["cpp", "python", "java", "js"],
            required: true,
        },
        time_taken: { type: Number },
        memory_taken: { type: Number },
        status: {
            type: String,
            enum: ["pending", "submitted"],
            required: true,
        },

        input: { type: String, required: true },
        output: { type: String },
        error: { type: String },
    },
    {
        timestamps: { createdAt: "addedAt" },
    }
);

export const Playground_Submission = mongoose.model(
    "Playground_Submission",
    playground_submission_schema
);
