const {Parent,User}= require('../model/SchoolDb')
const bcrypt = require('bcrypt')
// Add parent
exports.addParent=async (req,res) => {
    try {
        // destructure variable to check if the parent already exists
        const {email,nationalId,name}=req.body
        // check using email
        const existingParentEmail = await User.findOne({email})
        if (existingParentEmail) {
            return res.status(400).json({message:"Email already exists"})
        }
        // check using nationalId
        const existingParentNationalId = await Parent.findOne({nationalId})
        if (existingParentNationalId) {
            return res.status(400).json({message:"National ID already exists"})
        }
        // create a new parent
        const newParent = new Parent(req.body)
        const savedParent = await newParent.save()

        // create a new user for the parent
        const defaultPassword = 'password1234'
        const hashedPassword = await bcrypt.hash(defaultPassword, 10)
        const newUser = new User({
            name,email,
            password:hashedPassword,
            role:'parent',
            parent:savedParent._id
        })
        await newUser.save() 


        res.status(201).json(savedParent,{message:"Parent and user account added successfully"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// Get all parents
exports.getAllParents=async (req,res) => {
    try {
        const parents = await Parent.find()
        
        res.status(200).json(parents)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// update parent by admin
exports.updateParent=async(req,res)=> {
    try {
        const updateParent= await Parent.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}

        )
        if (!updateParent) {
            return res.status(404).json({message:"Parent not found"})
        }
        res.status(200).json(updateParent)
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
}

// Delete parent by admin
exports.deleteParent=async(req,res)=> {
    try {
        const deletedParent = await Parent.findByIdAndDelete(req.params.id)
        if (!deletedParent) {
            return res.status(404).json({message:"Parent not found"})
        }
        // Also delete the user associated with the parent
        await User.findOneAndDelete({parent:deletedParent._id})
        res.status(200).json({message:"Parent deleted successfully"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}