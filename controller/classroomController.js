const express = require('express')
const {Classroom, Teacher}= require('../model/SchoolDb')

// Add class

exports.addClassroom = async (req, res) => {
    try {
        // receive data from the client
        const newClassroom = req.body
        
        const savedClassroom = new Classroom(newClassroom)
        await savedClassroom.save()
        res.json(savedClassroom)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// fetching all classrooms
exports.getAllClassrooms = async (req, res) => {
    try {
        const classrooms = await Classroom.find()
        .populate('teacher', 'name email phone') 
        .populate('students', 'name date addmissionNumber')
        res.json(classrooms)
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
}

// get a single classroom by ID
exports.getClassroomById = async (req, res) => {

    try {
        
        const classroom = await Classroom.findById(req.params.id)
        .populate('teacher', 'name email phone') 
        .populate('students', 'name date addmissionNumber')
        
        if (!classroom) {
            return res.status(404).json({message: 'Classroom not found'})
        }
        
        res.json(classroom)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
// Update a classroom
exports.updateClassroom = async (req, res) => {
    try {
        const classroomId = req.params.id
        const updatedData = req.body
        
        const updatedClassroom = await Classroom.findByIdAndUpdate(classroomId, updatedData, {new: true})
        if (!updatedClassroom) {
            return res.status(404).json({message: 'Classroom not found'})
        }
        
        res.json(updatedClassroom)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
// Delete a classroom
exports.deleteClassroom = async (req, res) => {
    try {
        const classroomId = req.params.id
        
        const deletedClassroom = await Classroom.findByIdAndDelete(classroomId)
        if (!deletedClassroom) {
            return res.status(404).json({message: 'Classroom not found'})
        }
        
        res.json({message: 'Classroom deleted successfully'})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}