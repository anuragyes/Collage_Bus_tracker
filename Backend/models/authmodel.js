import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(

    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        }


    },
    { timestamps: true }
)

const client = mongoose.model("Client", ClientSchema);
export default client;
