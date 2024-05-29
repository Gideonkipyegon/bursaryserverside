import express from 'express';
import { getAllStudents, createStudent, getSingleStudent, updateStudents, deleteStudent } from '../controllers/StudentsController.js';
import { register, login } from '../controllers/userController.js';
const router = express.Router();

const Students = app => {
    app.route('/Students')
        .get(getAllStudents)
        .post(createStudent)
    app.route('/Students/:id')
        .get(getSingleStudent)
        .put(updateStudents)
        .delete(deleteStudent);
    //auth routes
    app.route('/auth/register')
        .post(register);
    app.route('/auth/login')
        .post(login);
}
export default Students