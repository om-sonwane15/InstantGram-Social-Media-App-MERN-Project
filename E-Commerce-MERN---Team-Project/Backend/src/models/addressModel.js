const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId,ref: "User"},
    state: {type: String, required: true},
    city: {type: String, required: true},
    pincode: {type: String, required: true},
    streetNo: {type: String, required: true},
    houseNo: {type: String, required: true},
    label: {type: String, enum: ['home', 'work', 'other'], default: 'home'},
    isDefault: {type: Boolean, default: false},
},{timestamps: true
});
module.exports = mongoose.model("Address", addressSchema);