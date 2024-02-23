import mongoose, { mongo } from "mongoose";

const connectToDatabase = async () => {
  try {
    const connection = await mongoose.connect(
      "mongodb+srv://<username>:<password>@cluster0.sawub6j.mongodb.net/to-do-app?retryWrites=true&w=majority"
    );
    if (connection) {
      console.log("MongoDB connected successfully");
    }
  } catch (error) {
    console.log("Error in connectToDatabase: ", error);
    throw error;
  }
};

export default connectToDatabase;
