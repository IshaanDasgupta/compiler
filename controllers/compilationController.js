import { execSync } from "child_process";
import { Submission } from "../models/Submission.js";

export const cppCompilation = async (req, res, next) => {
    try {
        const submission_id = req.body._id;
        let submission = await Submission.findById(submission_id);

        if (!submission) {
            return next(createError(400, "invalid submission"));
        }

        execSync(
            `echo ${submission.code} | base64 --decode > ./files/${submission_id}.cpp && g++ -o ./files/${submission_id} ./files/${submission_id}.cpp`
        );

        let total_score = 0;
        submission.test_cases.forEach((data, index) => {
            try {
                const test_case = data.test_case;
                execSync(
                    `echo ${test_case.input} | base64 --decode > ./files/${submission_id}-input.txt `
                );
                const output = execSync(
                    `./files/${submission_id} < ./files/${submission_id}-input.txt`
                )
                    .toString()
                    .trim();

                const testcase_output = execSync(
                    `echo ${test_case.output} | base64 --decode`
                )
                    .toString()
                    .trim();

                if (output == testcase_output) {
                    submission.test_cases[index].passed = true;
                    total_score += submission.test_cases[index].score;
                } else {
                    submission.test_cases[index].passed = false;
                }
            } catch (err) {
                return next(
                    createError(
                        500,
                        `${index} test case failed with message ${err.toString()} `
                    )
                );
            }
        });

        execSync(
            `rm ./files/${submission_id} && rm ./files/${submission_id}.cpp && rm ./files/${submission_id}-input.txt`
        );

        submission.total_score = total_score;
        await Submission.findByIdAndUpdate(submission_id, submission);

        res.status(200).send("Hello");
    } catch (err) {
        next(err);
    }
};

export const javaCompilation = async (req, res, next) => {
    try {
        const submission_id = req.body._id;
        let submission = await Submission.findById(submission_id);

        if (!submission) {
            return next(createError(400, "invalid submission"));
        }
        execSync(
            `echo ${submission.code} | base64 --decode > ./files/${submission_id}.java && javac ./files/${submission_id}.java`
        );

        submission.test_cases.forEach((data, index) => {
            try {
                const test_case = data.test_case;
                execSync(
                    `echo ${test_case.input} | base64 --decode > ./files/${submission_id}-input.txt `
                );
                const output = execSync(
                    `java ./files/${submission_id} < ./files/${submission_id}-input.txt`
                )
                    .toString()
                    .trim();

                const testcase_output = execSync(
                    `echo ${test_case.output} | base64 --decode`
                )
                    .toString()
                    .trim();

                if (output == testcase_output) {
                    submission.test_cases[index].passed = true;
                    total_score += submission.test_cases[index].score;
                } else {
                    submission.test_cases[index].passed = false;
                }
            } catch (err) {
                return next(
                    createError(
                        500,
                        `${index} test case failed with message ${err.toString()} `
                    )
                );
            }
        });

        execSync(
            `rm ./files/${submission_id}.class && rm ./files/${submission_id}.java && rm ./files/${submission_id}-input.txt`
        );

        submission.total_score = total_score;
        await Submission.findByIdAndUpdate(submission_id, submission);

        res.status(200).send("Hello");
    } catch (err) {
        next(err);
    }
};

export const pythonCompilation = async (req, res, next) => {
    try {
        const submission_id = req.body._id;
        let submission = await Submission.findById(submission_id);

        if (!submission) {
            return next(createError(400, "invalid submission"));
        }

        execSync(
            `echo ${submission.code} | base64 --decode > ./files/${submission_id}.py`
        );

        submission.test_cases.forEach((data, index) => {
            try {
                const test_case = data.test_case;

                execSync(
                    `echo ${test_case.input} | base64 --decode > ./files/${submission_id}-input.txt `
                );
                const output = execSync(
                    `./files/${submission_id}.py < ./files/${submission_id}-input.txt`
                )
                    .toString()
                    .trim();

                const testcase_output = execSync(
                    `echo ${test_case.output} | base64 --decode`
                )
                    .toString()
                    .trim();

                if (output == testcase_output) {
                    submission.test_cases[index].passed = true;
                    total_score += submission.test_cases[index].score;
                } else {
                    submission.test_cases[index].passed = false;
                }
            } catch (err) {
                return next(
                    createError(
                        500,
                        `${index} test case failed with message ${err.toString()} `
                    )
                );
            }
        });

        execSync(
            `rm ./files/${submission_id}.py && rm ./files/${submission_id}-input.txt`
        );

        submission.total_score = total_score;
        await Submission.findByIdAndUpdate(submission_id, submission);

        res.status(200).send("Hello");
    } catch (err) {
        next(err);
    }
};
