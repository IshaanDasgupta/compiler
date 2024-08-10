import mongoose from "mongoose";

export const TestCaseSchema = new mongoose.Schema({
    input: { type: String },
    expected_output: { type: String },
    isHidden: { type: Boolean },
    score: { type: Number },
});

const SubmissionSchema = new mongoose.Schema({
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
    submission_timestamp: { type: Date, required: true },
    code: { type: String, required: true },
    language: {
        type: String,
        enum: ["cpp", "python", "java", "js"],
        required: true,
    },
    time_taken: { type: Number },
    memory_taken: { type: Number },
    result: { type: String, enum: ["AC", "WA", "TLE", "MLE", "RTE"] },
    status: { type: String, enum: ["pending", "submitted"], required: true },
    type: { type: String, enum: ["run", "submit"], required: true },
    test_cases: [{ test_case: TestCaseSchema, passed: { type: Boolean } }],
    total_score: { type: Number },
});

export const Submission = mongoose.model("Submission", SubmissionSchema);
