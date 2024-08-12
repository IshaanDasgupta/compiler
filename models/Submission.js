import mongoose from "mongoose";

export const submission_schema = new mongoose.Schema(
    {
        problem_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem",
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        code: { type: String, required: true },
        language: {
            type: String,
            enum: ["cpp", "python", "java", "js"],
            required: true,
        },
        time_taken: { type: Number },
        memory_taken: { type: Number },
        result: { type: String, enum: ["AC", "WA", "TLE", "MLE", "RTE"] },
        status: {
            type: String,
            enum: ["pending", "submitted"],
            required: true,
        },
        type: {
            type: String,
            enum: ["run", "submit"],
            required: true,
        },
        test_cases: [
            {
                test_case: {
                    input: { type: String, required: true },
                    expected_output: { type: String },
                    output: { type: String, required: true },
                    is_hidden: { type: Boolean },
                    score: { type: Number },
                },
                passed: { type: Boolean },
            },
        ],
        total_score: { type: Number },
    },
    {
        timestamps: { createdAt: "addedAt" },
    }
);

export const Submission = mongoose.model("Submission", submission_schema);
