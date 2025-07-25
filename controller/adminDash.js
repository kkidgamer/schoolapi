const {Student, Classroom, Assignment, Teacher, Parent, User}= require('../model/SchoolDb');

exports.adminDashStats = async (req, res) => {
    try {
        // we run count operation parallel for better performance
        const [totalStudents, totalTeachers, totalClassrooms, totalParents,activeUsers] = 
        await Promise.all([
            Student.countDocuments(),
            Teacher.countDocuments(),
            Classroom.countDocuments(),
            Parent.countDocuments(),
            User.countDocuments({isActive:true})
        ])
        // get the most recently registered students
        const recentStudents = await Student.find()
        .sort({createdAt:-1})
        .limit(5);
        // get the most recently registered teachers
        const recentTeachers = await Teacher.find()
        .sort({createdAt:-1})
        .limit(5);
        
        // return all the stats
        res.status(200).json({
            totalStudents,
            totalTeachers,
            totalClassrooms,
            totalParents,
            activeUsers,
            recentStudents,
            recentTeachers
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}