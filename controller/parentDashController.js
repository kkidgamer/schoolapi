const {User,Parent,Classroom,Assignment,Teacher, Student} = require('../model/SchoolDb');

// Get the children of the logged-in parent
exports.parentDash= async (req, res) => {
    try {
        // Get the logged-in parent ID
        const userId = req.user.userId;
        const user = await User.findById(userId).populate('parent');

        // Extract the parent ID
        const parent = user.parent

        // Find all children associated with the parent
        const children = await Student.find({ parent: parent._id })
            .populate('classroom')
            res.status(200).json(children);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

// get student assignments
exports.getMyClassAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ classroom: req.params.id})
            .populate('postedBy')
            .sort({dueDate: -1});
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({message:error.message});
        
    }
}
