import mongoose from "mongoose";
import dotenv from "dotenv";
import amqp from "amqplib/callback_api.js";
import {
    compile_cpp,
    compile_cpp_playground,
} from "./controllers/compilationController.js";
import { Submission } from "./models/Submission.js";
import { Playground_Submission } from "./models/Playground_Submission.js";

dotenv.config();

const compile = async (submission_id, type) => {
    console.log(submission_id, type);
    if (type === "problem_submission") {
        const submission = await Submission.findById(submission_id);
        if (!submission) {
            console.log("invalid submission");
            return;
        }

        if (submission.language === "cpp") {
            compile_cpp(submission);
            return;
        }

        console.log(`language ${submission.language}  not supported`);
        return;
    }

    const playground_submission = await Playground_Submission.findById(
        submission_id
    );

    if (!playground_submission) {
        console.log("invalid playground submission");
        return;
    }

    if (playground_submission.language === "cpp") {
        compile_cpp_playground(playground_submission);
        return;
    }

    console.log(`language ${playground_submission.language}  not supported`);
    return;
};

const connectToMongoDB = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to mongoDB database");
    } catch (err) {
        throw err;
    }
};

const connectToRabbitMQ = async () => {
    try {
        amqp.connect(process.env.RABBIT_MQ_URI, function (error, connection) {
            if (error) {
                throw error;
            }

            connection.createChannel(function (error, channel) {
                if (error) {
                    throw error;
                }

                var queue = "submission_requests";

                channel.assertQueue(queue, {
                    durable: false,
                });

                console.log("waiting for messages...");

                channel.consume(
                    queue,
                    function (msg) {
                        const submission_data = JSON.parse(
                            msg.content.toString()
                        );

                        compile(
                            submission_data.submission_id,
                            submission_data.type
                        );
                    },
                    {
                        noAck: true,
                    }
                );
            });
        });
        console.log("Connected to rabbitMQ");
    } catch (err) {
        throw err;
    }
};

connectToMongoDB();
connectToRabbitMQ();
