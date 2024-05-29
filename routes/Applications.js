import express from 'express';
import { getAllApplications, createApplications, getSingleApplications, updateApplications, deleteApplications } from '../controllers/ApplicationsConroller.js';
const router = express.Router();

const Applications = app => {
    app.route('/Applications')
        .get(getAllApplications)
        .post(createApplications)
    app.route('/Applications/:id')
        .get(getSingleApplications)
        .put(updateApplications)
        .delete(deleteApplications);
}
export default Applications