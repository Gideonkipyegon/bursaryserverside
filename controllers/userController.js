import sql from 'mssql';
import config from '../db/config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const loginRequired = (req, res, next) => {
    if (req.User) {
        next()
    } else {
        return res.status(401).json({ message: 'Unauthorized user' })
    }
}





export const register = async (req, res) => {
    const { Name, Email, Phone, Address, Password } = req.body;

    // Validate inputs
    if (!Name || !Email || !Phone || !Address || !Password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(Password, 10);

    try {
        // Connect to the database
        const pool = await sql.connect(config.sql);

        // Check if user already exists
        const result = await pool.request()
            .input('Name', sql.VarChar, Name)
            .input('Email', sql.VarChar, Email)
            .query('SELECT * FROM Students WHERE Name=@Name OR Email=@Email');

        const user = result.recordset[0];

        if (user) {
            // User already exists
            return res.status(409).json({ error: 'User already exists' });
        } else {
            // Insert new user
            await pool.request()
                .input('Name', sql.VarChar, Name)
                .input('Email', sql.VarChar, Email)
                .input('Phone', sql.VarChar, Phone)
                .input('Address', sql.VarChar, Address)
                .input('Password', sql.VarChar, hashedPassword)
                .query('INSERT INTO Students(Name, Email, Phone, Address, Password) VALUES (@Name, @Email, @Phone, @Address, @Password)');

            // User created successfully
            return res.status(201).json({ message: "User created successfully" });
        }
    } catch (error) {
        // Error handling
        console.error('Error registering user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        // Close the database connection
        sql.close();
    }
};


export const login = async(req, res) => {
    const { Name, Password } = req.body;

    // Validate user input
    if (!Name || !Password) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    try {
        let pool = await sql.connect(config.sql);
        const result = await pool
            .request()
            .input('Name', sql.VarChar, Name)
            .query('SELECT * FROM Students WHERE Name=@Name');
        const user = result.recordset[0];

        if (!user) {
            return res.status(401).json({ error: 'Authentication failed. Wrong credentials' });
        }

        const passwordMatch = await bcrypt.compare(Password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed. Wrong credentials' });
        }

        const token = jwt.sign({
                Name: user.Name,
                Email: user.Email
            },
            config.jwt_secret, { expiresIn: '1h' } // Token expires in 1 hour
        );

        return res.status(200).json({
            Name: user.Name,
            Email: user.Email,
            id: user.StudentID,
            token: token
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (sql) {
            await sql.close();
        }
    }
};