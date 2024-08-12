import mongoose from "mongoose";
import dotenv from "dotenv";
import amqp from "amqplib/callback_api.js";
import { compile_cpp } from "./controllers/compilationController.js";

dotenv.config();

const connectToMongoDB = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB database");
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

                        console.log(submission_data);

                        if (submission_data.language == "cpp") {
                            compile_cpp(submission_data.submission_id);
                        }
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
