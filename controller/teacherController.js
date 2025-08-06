const {Teacher,User, Classroom,Assignment}= require('../model/SchoolDb')
const bcrypt = require('bcrypt');
// Add teacher
exports.addTeacher = async (req, res) => {
    // check if teacher already exists
    try {
        const { email } = req.body;
         const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const existEmail = await Teacher.findOne({ email });
        if (existEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        // create the teacher
        const newTeacher = new Teacher(req.body);
        await newTeacher.save();

        // create a corresponding user document
        // default password for the user
        const defaultPassword = 'teacher1234';
        const password= await bcrypt.hash(defaultPassword, 10);
        const newUser = new User({
            name: newTeacher.name,
            email: newTeacher.email,
            password,
            role: 'teacher',
            teacher: newTeacher._id
        });
        await newUser.save();
        res.status(201).json({message:"Teacher registered successfully",teacher:newTeacher});

    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
}

// Get all teachers
exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.json(teachers);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// Get a single teacher by ID
exports.getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res.status(404).json({message: 'Teacher not found'});
        }
        res.json(teacher);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
// Update a teacher
exports.updateTeacher = async (req,res) => {
    try {
        
        const updatedData = req.body
       
        
        if(req.user.role=="teacher" && req.user.userId!==req.params.id){
            res.status(403).json({message:"Unauthorized access"})
        }
        if(updatedData.password && req.user.role =="admin"){
            return res.status(403).json({message:"Access denied"})
        }
        if(updatedData.role && req.user.role !=="admin"){
            return res.status(403).json({message:"Access denied"})
        }
        if(updatedData.password){
            // Hash the new password
            const hashedPassword = await bcrypt.hash(updatedData.password, 10);
            updatedData.password = hashedPassword;

        }
        // Update the user document
        const updatedUser= await User.findByIdAndUpdate(req.params.id, updatedData, {new: true});
        if (!updatedUser) {
            return res.status(404).json({message: 'User not found'});
        }
        const updatedTeacher = await Teacher.findByIdAndUpdate(existUser.teacher, req.body, {new: true});
        if (!updatedTeacher) {
            return res.status(404).json({message: 'Teacher not found'});
        }
        res.json({message: 'Teacher updated successfully', teacher: updatedTeacher});
    }catch (error) {
        res.status(500).json({message:error.message})
    }         
    }

// Delete a user
exports.deleteTeacher = async (req,res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res.status(404).json({message: 'Teacher not found'});
        }
        // Delete the user document
        const deletedUser = await User.findOneAndDelete({teacher: teacher._id});
        if (!deletedUser) {
            return res.status(404).json({message: 'User not found'});
        }
        // Delete the teacher document
        await Teacher.findByIdAndDelete(req.params.id);
        res.json({message: 'Teacher deleted successfully'});
        await Classroom.updateMany(
            { teacher: teacher._id },
            { $set: { teacher: null } }
        );
       
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
}

exports.getMyClasses= async (req, res) => {
    try {
        // Check if the user is a teacher
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied' });
        }
        // Find the teacher by ID
        const user = await User.findById(req.user.userId).populate('teacher');
        if (!user || !user.teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        // Find all classrooms where the teacher is assigned
        const classrooms = await Classroom.find({ teacher: user.teacher._id }).populate('students');
        res.status(200).json(classrooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getMyAssignments=async (req,res) => {
    try {
        const userId= req.user.userId;
        const user = await User.findById(userId).populate('teacher');
        const assignments = await Assignment.find({postedBy: user.teacher._id})
        .populate('classroom','name gradeLevel classYear')
        .populate('postedBy')
        res.status(200).json(assignments)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

