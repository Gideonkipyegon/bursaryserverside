import sql from "mssql";
import config from "../db/config.js";

// GET ALL  STUDENT
export const getAllStudents = async(req, res) => {
    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request().query("SELECT * FROM Students");
        res.json(result.recordset);
    } catch (error) {
        res.status(201).json(error.message);
    } finally {
        sql.close();
    }
};

//CREATE  STUDENT
export const createStudent = async(req, res) => {
    try {
        const { Name, Email, Phone, Address, Password } = req.body;
        let pool = await sql.connect(config.sql);
        await pool
            .request()
            .input("Name", sql.VarChar, Name)
            .input("Email", sql.VarChar, Email)
            .input("Phone", sql.VarChar, Phone)
            .input("Address", sql.VarChar, Address)
            .input("Password", sql.VarChar, Password)
            .query(
                "INSERT INTO Students( Name,Email, Phone,Address,Password) VALUES (@Name,@Email,@Phone,@Address,@Password )"
            );
        res.status(200).json("added successfully");
    } catch (error) {
        res.status(201).json(error.message);
    } finally {
        sql.close();
    }
};

//GET  STUDENT BY ID
export const getSingleStudent = async(req, res) => {
    try {
        const { id } = req.params;
        let pool = await sql.connect(config.sql);
        const result = await pool
            .request()
            .input("id", sql.VarChar, id)
            .query(`SELECT * FROM Students WHERE StudentID = @id`);
        res.status(200).json(result.recordset[0]);
    } catch (error) {
        res.status(201).json(error.message);
    } finally {
        sql.close();
    }
};

//UPDATE  STUDENT
export const updateStudents = async(req, res) => {
    try {
        const { id } = req.params;
        const { StudentID, Name, Email, Phone, Address, Password } = req.body;
        let pool = await sql.connect(config.sql);
        await pool
            .request()
            .input("id", sql.VarChar, id)
            .input("StudentID", sql.Int, StudentID)
            .input("Name", sql.VarChar, Name)
            .input("Email", sql.VarChar, Email)
            .input("Phone", sql.VarChar, Phone)
            .input("Address", sql.VarChar, Address)
            .input("Password", sql.VarChar, Password)
            .query(
                `UPDATE Students SET StudentID=@StudentID, Name = @Name, Email = @Email,Phone = @Phone,Address=@Address,Password=@Password WHERE StudentID = @id`
            );
        res.status(200).json("updated successfully");
    } catch (error) {
        res.status(500).json(error.message);
    } finally {
        sql.close();
    }
};

//DELETE  STUDENT
export const deleteStudent = async(req, res) => {
    try {
        const { id } = req.params;
        let pool = await sql.connect(config.sql);
        await pool
            .request()
            .input("id", sql.VarChar, id)
            .query(`DELETE FROM Students WHERE StudentID = @id`);
        res.status(200).json("deleted successfully");
    } catch (error) {
        res.status(500).json(error.message);
    } finally {}
}; {
    sql.close();
};