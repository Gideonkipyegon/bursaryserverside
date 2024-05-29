import sql from "mssql";
import config from "../db/config.js";

// GET ALL  BURSARY
export const getAllBursaries = async(req, res) => {
    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request().query("SELECT * FROM  Bursaries");
        res.json(result.recordset);
    } catch (error) {
        res.status(201).json(error.message);
    } finally {
        sql.close();
    }
};

//CREATE BURSARY
export const createBursary = async(req, res) => {
    try {
        const { BursaryID, Name, Description, EligibilityCriteria, Amount, Deadline } = req.body;
        let pool = await sql.connect(config.sql);
        await pool
            .request()
            .input("BursaryID", sql.Int, BursaryID)
            .input("Name", sql.VarChar, Name)
            .input("Description", sql.VarChar, Description)
            .input("EligibilityCriteria", sql.VarChar, EligibilityCriteria)
            .input("Amount", sql.VarChar, Amount)
            .input("Deadline", sql.VarChar, Deadline)
            .query(
                "INSERT INTO Bursaries(BursaryID,Name,Description,EligibilityCriteria,Amount, Deadline) VALUES (@BursaryID,@Name,@Description,@EligibilityCriteria,@Amount,@Deadline)"
            );
        res.status(200).json(" You are registered successfully");
    } catch (error) {
        res.status(201).json(error.message);
    } finally {
        sql.close();
    }
};

//GET BURSARY BY ID
export const getSingleBursary = async(req, res) => {
    try {
        const { id } = req.params;
        let pool = await sql.connect(config.sql);
        const result = await pool
            .request()
            .input("id", sql.VarChar, id)
            .query(`SELECT * FROM Bursaries WHERE  BursaryID = @id`);
        res.status(200).json(result.recordset[0]);
    } catch (error) {
        res.status(201).json(error.message);
    } finally {
        sql.close();
    }
};

//UPDATE BURSARY
export const updateBursaries = async(req, res) => {
    try {
        const { id } = req.params;
        const { BursaryID, Name, Description, EligibilityCriteria, Amount, Deadline } = req.body;
        let pool = await sql.connect(config.sql);
        await pool
            .request()
            .input("id", sql.VarChar, id)
            .input("BursaryID", sql.VarChar, BursaryID)
            .input("Name", sql.VarChar, Name)
            .input("Description ", sql.VarChar, Description)
            .input("EligibilityCriteria", sql.VarChar, EligibilityCriteria)
            .input("Amount", sql.VarChar, Amount)
            .input("Deadline", sql.VarChar, Deadline)
            .query(
                `UPDATE Bursaries SET  BursaryID=@ BursaryID, Name = @Name, Description= @Description,EligibilityCriteria = @EligibilityCriteria,Amount=@Amount,Deadline=@Deadline WHERE BursaryID = @id`
            );
        res.status(200).json("Bursary updated successfully");
    } catch (error) {
        res.status(500).json(error.message);
    } finally {
        sql.close();
    }
};

//DELETE BURSARY
export const deleteBursaries = async(req, res) => {
    try {
        const { id } = req.params;
        let pool = await sql.connect(config.sql);
        await pool
            .request()
            .input("id", sql.VarChar, id)
            .query(`DELETE FROM Bursaries WHERE BursaryID = @id`);
        res.status(200).json("deleted successfully");
    } catch (error) {
        res.status(500).json(error.message);
    } finally {}
}; {
    sql.close();
};