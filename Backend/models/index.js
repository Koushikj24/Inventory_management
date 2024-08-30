const mongoose = require("mongoose");
const uri = "mongodb+srv://Joy2612:Joy%402612@cluster0.s9huflr.mongodb.net/inventory_management";


function main() {
    mongoose.connect(uri).then(() => {
        console.log("Succesfull")
    
    }).catch((err) => {
        console.log("Error: ", err)
    })
}

module.exports = { main };