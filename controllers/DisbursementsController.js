import sql from "mssql";
import config from "../db/config.js";

// GET ALL  DISBURSEMENTS
export const getAllDisbursements = async(req, res) => {
    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request().query("SELECT * FROM Disbursements");
        res.json(result.recordset);
    } catch (error) {
        res.status(201).json(error.message);
    } finally {
        sql.close();
    }
};

//CREATE DISBURSEMENTS
export const createDisbursement = async(req, res) => {
    try {
        const { DisbursementID, ApplicationID, Amount, DisbursementDate } = req.body;
        let pool = await sql.connect(config.sql);
        await pool
            .request()
            // .input("DisbursementID", sql.Int, DisbursementID)
            .input("ApplicationID", sql.VarChar, ApplicationID)
            .input("Amount", sql.VarChar, Amount)
            .input("DisbursementDate", sql.VarChar, DisbursementDate)
            .query(
                "INSERT INTO Disbursements(ApplicationID,Amount,DisbursementDate) VALUES (@ApplicationID,@Amount,@SpotType)"
            );
        res.status(200).json(" Disbursement created successfully");
    } catch (error) {
        res.status(201).json(error.message);
    } finally {
        sql.close();
    }
};

//GET DISBURSEMENT BY ID
export const getSingleDisbursement = async(req, res) => {
    try {
        const { id } = req.params;
        let pool = await sql.connect(config.sql);
        const result = await pool
            .request()
            .input("id", sql.VarChar, id)
            .query(`SELECT * FROM Disbursements WHERE SpotID = @id`);
        res.status(200).json(result.recordset[0]);
    } catch (error) {
        res.status(201).json(error.message);
    } finally {
        sql.close();
    }
};

//UPDATE DISBURSEMENTS
export const updateDisbursements = async(req, res) => {
    try {
        const { id } = req.params;
        const { DisbursementID, ApplicationID, Amount, DisbursementDate } = req.body;
        let pool = await sql.connect(config.sql);
        await pool
            .request()
            .input("id", sql.VarChar, id)
            .input("DisbursementID", sql.VarChar, DisbursementID)
            .input("ApplicationID", sql.VarChar, ApplicationID)
            .input("Amount", sql.VarChar, Amount)
            .input("DisbursementDate", sql.VarChar, DisbursementDate)
            .query(
                `UPDATE Disbursements SET ApplicationID = @ApplicationID, Amount = @Amount,DisbursementDate = @DisbursementDate WHERE DisbursementID = @id`
            );
        res.status(200).json("Disbursements updated successfully");
    } catch (error) {
        res.status(500).json(error.message);
    } finally {
        sql.close();
    }
};

//DELETE DISBURSEMENTS
export const deleteDisbursement = async(req, res) => {
    try {
        const { id } = req.params;
        let pool = await sql.connect(config.sql);
        await pool
            .request()
            .input("id", sql.VarChar, id)
            .query(`DELETE FROM Disbursements WHERE SpotID = @id`);
        res.status(200).json("Disbursement deleted successfully");
    } catch (error) {
        res.status(500).json(error.message);
    } finally {}
}; {
    sql.close();
};