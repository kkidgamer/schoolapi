// database
const {Student,Classroom,Parent}= require('../model/SchoolDb')
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// file location folder/directory
const upload= multer({dest: 'upload/'});
exports.uploadStudentPhoto= upload.single('photo');
exports.addStudent = async (req, res) => {
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    try {
        const {name,dateOfBirth,gender,addmissionNumber,classroom,parentNationalId} = req.body;
         // Check if parent exists by nationalId
        const existingParent = await Parent.findOne({ nationalId: parentNationalId });
        if (!existingParent) {
            return res.status(404).json({ message: 'Parent not found' });
        }

        // Check if student exists
        const existingStudent = await Student.findOne({ addmissionNumber });
        if (existingStudent) {
            // If a file was uploaded, clean it up to avoid saving unnecessary files
            if (req.file) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (fileError) {
                    console.error('Error deleting temporary file:', fileError.message);
                }
            }
            return res.status(400).json({ message: 'Student with this admission number already exists' });
        }

        // Check if classroom exists
        const existingClassroom = await Classroom.findById(classroom);
        if (!existingClassroom) {
            //വ
            // If a file was uploaded, clean it up
            if (req.file) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (fileError) {
                    console.error('Error deleting temporary file:', fileError.message);
                }
            }
            return res.status(404).json({ message: 'Classroom not found' });
        }


        // prepare the upload file 
        let photo=null;
        if (req.file) {
            const ext = path.extname(req.file.originalname);
            const filename = Date.now() + ext;
            const newPath = path.join('upload', filename);
            fs.renameSync(req.file.path, newPath);
            photo = newPath.replace(/\\/g, '/');

        }
        // create the student
        const newStudent = new Student({
            name,
            dateOfBirth,
            gender,
            addmissionNumber,
            classroom: existingClassroom._id,
            parent: existingParent._id,
            photo
        });
        await newStudent.save();

        // add the student to the classroom using $addToSet to avoid duplicates
        await Classroom.findByIdAndUpdate(
            existingClassroom._id,
            { $addToSet: { students: newStudent._id } },
            { new: true }
        );
        res.status(201).json({ message: 'Student added successfully', student: newStudent });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
// get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find()
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// get student by id
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('classroom', 'name').populate('parent', 'name');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// update student 

exports.updateStudent = async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// delete student
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        // Delete the student document
        await Student.findByIdAndDelete(req.params.id);
        // If the student has a photo, delete it from the filesystem
        if (student.photo) {
            const photoPath = path.join(__dirname, '..', student.photo);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }
        }
        
        // Remove the student from the classroom
        await Classroom.findByIdAndUpdate(
            student.classroom,
            { $pull: { students: student._id } },
            { new: true }
        );
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
