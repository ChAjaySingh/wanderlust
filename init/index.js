const mongoose = require("mongoose");
const initData = require("./data.js"); //importing the data
const Listing = require("../models/listing.js"); //importing the model

main()
  .then((res) => console.log("Connected to DB"))
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

// initialize db with sample data
const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((listing) => ({
    ...listing,
    owner: "6831718800182d089ec2b1e8",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initalized");
};

initDB();
