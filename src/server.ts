import mongoose from "mongoose";
import { app } from "./app";
import config from "./config";

(async function main() {
  let server;

  if (!config.mongodbUri) {
    console.error("MONGODB_URI is not defined in the environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(config.mongodbUri).then(() => {
      console.log("Connected to MongoDB successfully");
    });
    server = app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
})();
