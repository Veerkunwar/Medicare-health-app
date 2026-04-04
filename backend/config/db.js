import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://veerkunwarsingh19296_db_user:Anshu123@cluster0.skvljz7.mongodb.net/MediCare2")
    .then( () => {
        console.log("DB CONNECTED");
        
    })
}