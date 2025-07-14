const mongoose= require('mongoose');
const Schema = mongoose.Schema;

// Define the schema 
const userSchema = new Schema({
    name:{type:String},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    isActive:{type:Boolean, default:true},
    role:{type:String, enum:['admin', 'teacher', 'parent'], required:true},
    teacher:{type:Schema.Types.ObjectId, ref:'Teacher',default:null},
    parent:{type:Schema.Types.ObjectId, ref:'Parent',default:null},
       
},{timestamps:true})

// teacher schema
const teacherSchema = new Schema({
    name:{type:String, required:true},
    email:{type:String,  },
    phone:{type:String},
    subject:{type:String}
}, {timestamps:true});

// parent schema
const parentSchema = new Schema({
    name:{type:String, required:true},
    email:{type:String},
    phone:{type:String, required:true},
    nationalId:{type:String, required:true, unique:true},
    address:{type:String},
    
}, {timestamps:true});

// classroom schema
const classroomSchema = new Schema({
    name:{type:String, required:true},
    gradeLevel:{type:String},
    classYear:{type:Date},
    teacher:{type:Schema.Types.ObjectId, ref:'Teacher', default:null},
    students:[{type:Schema.Types.ObjectId, ref:'Student'}]
}, {timestamps:true});

// student schema
const studentSchema = new Schema({
    name:{type:String, required:true},
    dateOfBirth:{type:Date, required:true},
    gender:{type:String},
    photo:{type:String},
    addmissionNumber:{type:String, required:true, unique:true},
    classroom:{type:mongoose.Schema.Types.ObjectId, ref:'Classroom', required:true},
    parent:{type:mongoose.Schema.Types.ObjectId, ref:'Parent'}
}, {timestamps:true});

// Assignment schema
const assignmentSchema = new Schema({
    title:{type:String, required:true},
    description:{type:String},
    dueDate:{type:Date, required:true},
    classroom:{type:mongoose.Schema.Types.ObjectId, ref:'Classroom', required:true},
    postedBy:{type:mongoose.Schema.Types.ObjectId, ref:'Teacher', required:true},
    
},{timestamps:true});

// prepare for export
const User = mongoose.model('User', userSchema);
const Teacher = mongoose.model('Teacher', teacherSchema);
const Parent = mongoose.model('Parent', parentSchema);
const Classroom = mongoose.model('Classroom', classroomSchema);
const Student = mongoose.model('Student', studentSchema);
const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = {User, Teacher, Parent, Classroom, Student, Assignment};