const UserSchema = require("../models/UserModel")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.signup = async (req, res) => {
    const {name, email, password} = req.body

    try {
        const existingUser = await UserSchema.findOne({ email })
        if(existingUser) {
            return res.status(400).json({message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        
        const user = await UserSchema.create({
            name,
            email,
            password: hashedPassword
        })

        const token = jwt.sign(
            { id: user._id },  // Changed from userId to id for consistency
            process.env.JWT_SECRET,  // Changed from hardcoded value to env variable
            { expiresIn: '1d' }
        )

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserSchema.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
};