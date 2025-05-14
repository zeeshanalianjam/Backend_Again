
import dotenv from "dotenv"
import connectDB from "./db/database.js"
import {app} from './app.js'



dotenv.config({
    path: "./.env",
})


connectDB().then(() => {
    app.on("ERROR", (error) => {
        console.log("Error in connecting to the database from express", error);
    })
    app.listen(process.env.PORT, () => {
        console.log(`Server is Running at http://localhost:${process.env.PORT}\n`);
        
    })
})
.catch((error) => {
    console.log("Error in DB Connection ", error);
})



// ;(async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`);
//         console.log("Connected to the database");
//         app.on("ERROR", (error) => {
//             console.log("Error in connecting to the database", error);
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`Server is Serve at http://localhost:${process.env.PORT}`);
            
//         })
//     } catch (error) {
//         console.log("Error in connecting to the database", error);
        
//     }
// })()