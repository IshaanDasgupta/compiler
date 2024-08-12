import { execSync } from "child_process";
import { Submission } from "../models/Submission.js";

export const compile_cpp = async (submission_id) => {
    try {
        // console.log("\n\ncompiling_cpp\n\n");
        let submission = await Submission.findById(submission_id);

        // console.log(submission);

        if (!submission) {
            return "problem not found";
        }

        // console.log(submission);

        execSync(
            `echo ${submission.code} | base64 --decode > ./files/${submission_id}.cpp && g++ -o ./files/${submission_id} ./files/${submission_id}.cpp`
        );

        // console.log("\n\n compilation done \n\n");

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

                const encoded_output = execSync(`echo ${output} | base64`)
                    .toString()
                    .trim();

                submission.test_cases[index].test_case.output = encoded_output;

                if (test_case.expected_output) {
                    const testcase_output = execSync(
                        `echo ${test_case.expected_output} | base64 --decode`
                    )
                        .toString()
                        .trim();
                    if (output == testcase_output) {
                        submission.test_cases[index].passed = true;
                        total_score +=
                            submission.test_cases[index].test_case.score;
                    } else {
                        submission.test_cases[index].passed = false;
                    }
                }
            } catch (err) {
                return `internal error in ${index} testcase`;
            }
        });

        execSync(
            `rm ./files/${submission_id} && rm ./files/${submission_id}.cpp && rm ./files/${submission_id}-input.txt`
        );

        // console.log("\n\n removed files \n\n");

        submission.total_score = total_score;
        submission.status = "submitted";
        submission.result = "AC";
        // console.log(submission);

        await Submission.findByIdAndUpdate(submission_id, submission);

        console.log("done");

        return;
    } catch (err) {
        console.log(err);
        return;
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

        console.log("\n\n code compiled \n\n");

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
                    `echo ${test_case.expected_output} | base64 --decode`
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
