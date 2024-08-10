import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import compilationRoutes from "./routes/compilationRoutes.js";
import cors from "cors";
import amqp from "amqplib/callback_api.js";

const app = express();
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

                console.log(
                    " [*] Waiting for messages in %s. To exit press CTRL+C",
                    queue
                );

                channel.consume(
                    queue,
                    function (msg) {
                        console.log(
                            "submission_id : %s",
                            msg.content.toString()
                        );

                        const submission_data = JSON.parse(
                            msg.content.toString()
                        );

                        console.log(submission_data);
                        console.log(submission_data.type);
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

app.use(express.json());
app.use(cors());

app.use("/api/compilation", compilationRoutes);

app.use((err, req, res, next) => {
    const errStatus = err.status || 500;
    const errMessage = err.message || "something went worng!";
    return res.status(errStatus).json({
        sucess: false,
        status: errStatus,
        message: errMessage,
        stack: err.stack,
    });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
    connectToMongoDB();
    connectToRabbitMQ();
    console.log(`server running on port : ${port}`);
});
