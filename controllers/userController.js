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

export const login = async (req, res) => {
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

        // Debugging log to check the result from SQL query
        console.log('SQL Query Result:', result);

        if (result.recordset.length === 0) {
            console.log('No user found with the given name:', Name);
            return res.status(401).json({ error: 'Authentication failed. Wrong credentials' });
        }

        const user = result.recordset[0];

        // Ensure the user object and password field exist
        if (!user || !user.Password) {
            console.log('User or password field is missing:', user);
            return res.status(401).json({ error: 'Authentication failed. Wrong credentials' });
        }

        // Debugging logs to check password values
        console.log('Plain text password:', Password);
        console.log('Hashed password from database:', user.Password);

        const passwordMatch = await bcrypt.compare(Password, user.Password);

        if (!passwordMatch) {
            console.log('Passwords do not match');
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
            id: user.StudentsID,
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
