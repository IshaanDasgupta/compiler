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
        contest_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contest",
        },
        code: { type: String, required: true },
        language: {
            type: String,
            enum: ["cpp", "python", "java", "js"],
            required: true,
        },
        time_taken: { type: Number },
        memory_taken: { type: Number },
        throwaway: { type: Boolean },
        result: {
            type: String,
            enum: [
                "AC",
                "WA",
                "Compilation Error",
                "Runtime Error",
                "TLE",
                "MLE",
                "RTE",
            ],
        },
        status: {
            type: String,
            enum: ["pending", "submitted"],
            required: true,
        },
        test_cases: [
            {
                test_case: {
                    input: { type: String, required: true },
                    expected_output: { type: String, required: true },
                    output: { type: String },
                    is_hidden: {
                        type: Boolean,
                        default: false,
                    },
                    score: { type: Number, default: 0 },
                },
                passed: { type: Boolean },
            },
        ],
        total_score: { type: Number },
        error: { type: String },
    },
    {
        timestamps: { createdAt: "addedAt" },
    }
);

export const Submission = mongoose.model("Submission", submission_schema);
