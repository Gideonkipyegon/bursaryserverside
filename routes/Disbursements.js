import express from 'express';
import { getAllDisbursements, createDisbursement, getSingleDisbursement, updateDisbursements, deleteDisbursement } from '../controllers/DisbursementsController.js';
const router = express.Router();

const Disbursements = app => {
    app.route('/Disbursements')
        .get(getAllDisbursements)
        .post(createDisbursement)
    app.route('/Disbursements/:id')
        .get(getSingleDisbursement)
        .put(updateDisbursements)
        .delete(deleteDisbursement);
}
export default Disbursements