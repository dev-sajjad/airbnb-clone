const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://airbnbuser:airbnbuser@cluster0.ozga6sm.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function dbConnect() {
  try {
    await client.connect();
    console.log("Database connection established");
  } catch (error) {
    console.log(error.message);
  }
}
dbConnect();

const listsCollection = client.db("airbnb").collection("lists");

app.get("/", async (req, res) => {
  try {
    const query = {};
    const cursor = listsCollection.find(query);
    const lists = await cursor.toArray();
    res.send({
      success: true,
      message: "Successfully got lists from Database.",
      data: lists,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});


// filter data based on search parameters
// app.get("/search", async (req, res) => {
//   try {
//     const { startDate, endDate, location, guestCounts } = req.query;

//     // Build your query filter based on the user's input
//     const query = {
//       $and: [
//         { "list.availability.startDate": { $lte: startDate } },
//         { "list.availability.endDate": { $gte: endDate } },
//         {
//           $or: [
//             { "list.location.region": location },
//             { "list.location.city": location },
//             { "list.location.country": location },
//           ],
//         },
//         { "list.placeCapacity.adults": { $gte: guestCounts.adults } },
//         { "list.placeCapacity.children": { $gte: guestCounts.children } },
//         { "list.placeCapacity.infants": { $gte: guestCounts.infants } },
//       ],
//     };

//     const cursor = listsCollection.find(query);
//     const lists = await cursor.toArray();
//     res.send({
//       success: true,
//       message: "Successfully got filtered lists from Database.",
//       data: lists,
//     });
//   } catch (error) {
//     res.send({
//       success: false,
//       error: error.message,
//     });
//   }
// });

// listening port
app.listen(port, () => {
  console.log(`Server connected to ${port}`);
});

module.exports = app;