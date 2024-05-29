import express from 'express';
import { getAllBursaries, createBursary, getSingleBursary, updateBursaries, deleteBursaries } from '../controllers/BursariesController.js';
const router = express.Router();

const Bursaries = app => {
    app.route('/Bursaries')
        .get(getAllBursaries)
        .post(createBursary)
    app.route('/Bursaries/:id')
        .get(getSingleBursary)
        .put(updateBursaries)
        .delete(deleteBursaries);
}
export default Bursaries