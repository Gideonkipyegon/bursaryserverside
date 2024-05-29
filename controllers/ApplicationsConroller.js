import sql from "mssql";
import config from "../db/config.js";

// GET ALL  APPLICATIONS
export const getAllApplications = async(req, res) => {
    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request().query("SELECT * FROM Applications");
        res.json(result.recordset);
    } catch (error) {
        res.status(201).json(error.message);
    } finally {
        sql.close();
    }
};

//CREATE  APPLICATION
export const createApplications = async(req, res) => {
    try {
        const { ApplicationID, StudentID, BursaryID, DateApplied, Status } = req.body;
        let pool = await sql.connect(config.sql);
        await pool
            .request()
            .input("ApplicationID", sql.Int, ApplicationID)
            .input("StudentID", sql.VarChar, StudentID)
            .input("BursaryID", sql.VarChar, BursaryID)
            .input(" DateApplied", sql.VarChar, DateApplied)
            .input("Status", sql.VarChar, Status)
            .query(
                "INSERT INTO Applications(ApplicationID,StudentID,BursaryID,DateApplied, Status) VALUES (@ApplicationID,@StudentID,@BursaryID,@DateApplied,@Status )"
            );
        res.status(200).json("added successfully");
    } catch (error) {
        res.status(201).json(error.message);
    } finally {
        sql.close();
    }
};

//GET  APPLICATION BY ID
export const getSingleApplications = async(req, res) => {
    try {
        const { id } = req.params;
        let pool = await sql.connect(config.sql);
        const result = await pool
            .request()
            .input("id", sql.VarChar, id)
            .query(`SELECT * FROM Applications WHERE ApplicationID = @id`);
        res.status(200).json(result.recordset[0]);
    } catch (error) {
        res.status(201).json(error.message);
    } finally {
        sql.close();
    }
};

//UPDATE  APPLICATIONS
export const updateApplications = async(req, res) => {
    try {
        const { id } = req.params;
        const { ApplicationID, StudentID, BursaryID, DateApplied, Status } = req.body;
        let pool = await sql.connect(config.sql);
        await pool
            .request()
            .input("id", sql.VarChar, id)
            .input("ApplicationID", sql.VarChar, ApplicationID)
            .input("StudentID", sql.VarChar, StudentID)
            .input("BursaryID", sql.VarChar, BursaryID)
            .input("DateApplied", sql.VarChar, DateApplied)
            .input("Status", sql.VarChar, Status)
            .query(
                `UPDATE Alerts SET ApplicationID=@ApplicationID, StudentID = @StudentID, BursaryID = @BursaryID,DateApplied = @DateApplied,Status=@Status WHERE ApplicationID = @id`
            );
        res.status(200).json("updated successfully");
    } catch (error) {
        res.status(500).json(error.message);
    } finally {
        sql.close();
    }
};

//DELETE  ALERTS
export const deleteApplications = async(req, res) => {
    try {
        const { id } = req.params;
        let pool = await sql.connect(config.sql);
        await pool
            .request()
            .input("id", sql.VarChar, id)
            .query(`DELETE FROM Applications WHERE ApplicationID = @id`);
        res.status(200).json("deleted successfully");
    } catch (error) {
        res.status(500).json(error.message);
    } finally {}
}; {
    sql.close();
};