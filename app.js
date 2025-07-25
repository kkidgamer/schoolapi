// Entry file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

// middlewares
const app = express();
app.use(express.json());
app.use(cors());

// static files accessibility
app.use('/uploads', express.static('uploads'));

// routes
const userAuth = require('./routes/loginRoute');
app.use('/api/user/Auth', userAuth);

// classroom routes
const classroomRoutes = require('./routes/classroomRoute');
app.use('/api/classroom', classroomRoutes);

// teacher routes
const teacherRoutes = require('./routes/teacherRoute');
app.use('/api/teacher', teacherRoutes)

// assignemt routes
const assignmentRoutes= require('./routes/assignemntRoute')
app.use('/api/assignment', assignmentRoutes)

// parent routes
const parentRoutes = require('./routes/parentRoute');
app.use('/api/parent', parentRoutes);

// student routes
const studentRoutes = require('./routes/studentRoute');
app.use('/api/student', studentRoutes);

// admin routes
const adminRoutes = require('./routes/adminRoute');
app.use('/api/admin', adminRoutes);
// connect to the database
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log('Connected to MongoDB'))
.catch((err) => console.log("MongoDB connection error:", err));

const PORT=3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});