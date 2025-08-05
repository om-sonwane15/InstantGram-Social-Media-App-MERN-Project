const express = require("express");
const verifyToken = require("../middlewares/authMiddleware.js");
const router = express.Router();
const Address = require("../models/addressModel.js");
//post address
router.post("/", verifyToken, async (req, res) => {
    try{
        const { state, city, pincode, streetNo, houseNo, label, isDefault } = req.body;
        const userId = req.user.id;
        const finalLabel = label && label.trim() !== "" ? label : "home";//default home
        const addressCount = await Address.countDocuments({userId});
        if(addressCount >= 3){
            return res.status(400).json({message: "You can only have 3 addresses saved- (home, work, other)"});
        }
        const duplicateLabel = await Address.findOne({userId, label: finalLabel});
        if(duplicateLabel){
            return res.status(400).json({message: `You already have an address for '${finalLabel}', Please choose a different address type`});
        }
        if(isDefault){
            await Address.updateMany({userId}, {isDefault: false});
        }
        const address = new Address({userId,state,city,pincode,streetNo,houseNo,label: finalLabel,isDefault: isDefault || false});
        await address.save();
        res.status(201).json({message:"Address added successfully", address});
    }catch(err){
        res.status(500).json({message: err.message});
    }
});
//get users address
router.get("/", verifyToken, async (req, res)=>{
    try{
        const userId = req.user.id;
        const addresses = await Address.find({userId}).sort({isDefault: -1});
        if (addresses.length === 0){
            return res.status(404).json({message: "No address found for this user"});
        }
        res.json({message: "Addresses fetched successfully",addresses: addresses});
    }catch(err){
        res.status(500).json({ message: err.message });
    }
});
//update user address through label(type)
router.put("/:label", verifyToken, async (req, res) =>{
    try{
        const userId = req.user.id;
        const label = req.params.label;
        const {state, city, pincode, streetNo, houseNo, isDefault} = req.body;
        const existingAddress = await Address.findOne({userId, label});
        if (!existingAddress){
            return res.status(404).json({message: `Address type'${label}' not found`});
        }
        const isSame = existingAddress.state === state && existingAddress.city === city && 
        existingAddress.pincode === pincode && existingAddress.streetNo === streetNo &&
            existingAddress.houseNo === houseNo && existingAddress.isDefault === (isDefault || false);
        if (isSame){
            return res.status(400).json({message: "Address not updated because no changes were made"});
        }
        if (isDefault){
            await Address.updateMany({ userId }, { isDefault: false });
        }
        const updatedAddress = await Address.findOneAndUpdate({userId, label},
            {state, city, pincode, streetNo, houseNo, isDefault: isDefault || false},{new: true});
        res.json({ message: "Address updated successfully", address: updatedAddress });
    }catch(err){
        res.status(500).json({ message: err.message });
    }
});
//delete user address through label(type)
router.delete("/:label", verifyToken, async (req, res) =>{
    try{
        const userId = req.user.id;
        const label = req.params.label;
        const deletedAddress = await Address.findOneAndDelete({userId, label});
        if (!deletedAddress){
            return res.status(404).json({message: `No address of '${label}' found to delete`});
        }
        res.json({message:`'${label}' address deleted successfully`,deletedAddress});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;