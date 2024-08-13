import { execSync } from "child_process";
import { Submission } from "../models/Submission.js";
import { Playground_Submission } from "../models/Playground_Submission.js";

export const compile_cpp = async (submission) => {
    try {
        const submission_id = submission._id;

        try {
            execSync(
                `echo ${submission.code} | base64 --decode > ./files/${submission_id}.cpp && g++ -o ./files/${submission_id} ./files/${submission_id}.cpp`
            );
        } catch (err) {
            submission.status = "failed";
            submission.error = err.toString();
            await Submission.findByIdAndUpdate(submission_id, submission);

            return;
        }

        let total_score = 0;
        let ac = true;
        submission.test_cases.forEach(async (data, index) => {
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

                const testcase_output = execSync(
                    `echo ${test_case.expected_output} | base64 --decode`
                )
                    .toString()
                    .trim();
                if (output == testcase_output) {
                    submission.test_cases[index].passed = true;
                    total_score += submission.test_cases[index].test_case.score;
                } else {
                    submission.test_cases[index].passed = false;
                    ac = false;
                }
            } catch (err) {
                submission.status = "failed";
                submission.error = err.toString();
                await Submission.findByIdAndUpdate(submission_id, submission);

                return;
            }
        });

        execSync(
            `rm ./files/${submission_id} && rm ./files/${submission_id}.cpp && rm ./files/${submission_id}-input.txt`
        );

        submission.total_score = total_score;
        submission.status = "submitted";
        submission.result = ac === true ? "AC" : "WA";
        await Submission.findByIdAndUpdate(submission_id, submission);

        console.log(`executed submission with id ${submission_id}`);
        return;
    } catch (err) {
        console.log(err);
        return;
    }
};

export const compile_cpp_playground = async (playground_submission) => {
    try {
        const submission_id = playground_submission._id;

        try {
            execSync(
                `echo ${playground_submission.code} | base64 --decode > ./files/${submission_id}.cpp && g++ -o ./files/${submission_id} ./files/${submission_id}.cpp`
            );
        } catch (err) {
            playground_submission.status = "failed";
            playground_submission.error = err.toString();
            await Playground_Submission.findByIdAndUpdate(
                submission_id,
                playground_submission
            );

            return;
        }

        try {
            execSync(
                `echo ${playground_submission.input} | base64 --decode > ./files/${submission_id}-input.txt `
            );

            const output = execSync(
                `./files/${submission_id} < ./files/${submission_id}-input.txt`
            )
                .toString()
                .trim();

            const encoded_output = execSync(`echo ${output} | base64`)
                .toString()
                .trim();

            playground_submission.output = encoded_output;
        } catch (err) {
            playground_submission.status = "failed";
            playground_submission.error = err.toString();
            await Playground_Submission.findByIdAndUpdate(
                submission_id,
                playground_submission
            );

            return;
        }

        playground_submission.status = "submitted";

        await Playground_Submission.findByIdAndUpdate(
            submission_id,
            playground_submission
        );

        console.log(`executed playground submission with id ${submission_id}`);

        return;
    } catch (err) {
        console.log(err);
        return;
    }
};

// export const javaCompilation = async (req, res, next) => {
//     try {
//         const submission_id = req.body._id;
//         let submission = await Submission.findById(submission_id);

//         if (!submission) {
//             return next(createError(400, "invalid submission"));
//         }
//         execSync(
//             `echo ${submission.code} | base64 --decode > ./files/${submission_id}.java && javac ./files/${submission_id}.java`
//         );

//         console.log("\n\n code compiled \n\n");

//         submission.test_cases.forEach((data, index) => {
//             try {
//                 const test_case = data.test_case;

//                 execSync(
//                     `echo ${test_case.input} | base64 --decode > ./files/${submission_id}-input.txt `
//                 );
//                 const output = execSync(
//                     `java ./files/${submission_id} < ./files/${submission_id}-input.txt`
//                 )
//                     .toString()
//                     .trim();

//                 const testcase_output = execSync(
//                     `echo ${test_case.expected_output} | base64 --decode`
//                 )
//                     .toString()
//                     .trim();

//                 if (output == testcase_output) {
//                     submission.test_cases[index].passed = true;
//                     total_score += submission.test_cases[index].score;
//                 } else {
//                     submission.test_cases[index].passed = false;
//                 }
//             } catch (err) {
//                 return next(
//                     createError(
//                         500,
//                         `${index} test case failed with message ${err.toString()} `
//                     )
//                 );
//             }
//         });

//         execSync(
//             `rm ./files/${submission_id}.class && rm ./files/${submission_id}.java && rm ./files/${submission_id}-input.txt`
//         );

//         submission.total_score = total_score;
//         await Submission.findByIdAndUpdate(submission_id, submission);

//         res.status(200).send("Hello");
//     } catch (err) {
//         next(err);
//     }
// };

// export const pythonCompilation = async (req, res, next) => {
//     try {
//         const submission_id = req.body._id;
//         let submission = await Submission.findById(submission_id);

//         if (!submission) {
//             return next(createError(400, "invalid submission"));
//         }

//         execSync(
//             `echo ${submission.code} | base64 --decode > ./files/${submission_id}.py`
//         );

//         submission.test_cases.forEach((data, index) => {
//             try {
//                 const test_case = data.test_case;

//                 execSync(
//                     `echo ${test_case.input} | base64 --decode > ./files/${submission_id}-input.txt `
//                 );
//                 const output = execSync(
//                     `./files/${submission_id}.py < ./files/${submission_id}-input.txt`
//                 )
//                     .toString()
//                     .trim();

//                 const testcase_output = execSync(
//                     `echo ${test_case.output} | base64 --decode`
//                 )
//                     .toString()
//                     .trim();

//                 if (output == testcase_output) {
//                     submission.test_cases[index].passed = true;
//                     total_score += submission.test_cases[index].score;
//                 } else {
//                     submission.test_cases[index].passed = false;
//                 }
//             } catch (err) {
//                 return next(
//                     createError(
//                         500,
//                         `${index} test case failed with message ${err.toString()} `
//                     )
//                 );
//             }
//         });

//         execSync(
//             `rm ./files/${submission_id}.py && rm ./files/${submission_id}-input.txt`
//         );

//         submission.total_score = total_score;
//         await Submission.findByIdAndUpdate(submission_id, submission);

//         res.status(200).send("Hello");
//     } catch (err) {
//         next(err);
//     }
// };
