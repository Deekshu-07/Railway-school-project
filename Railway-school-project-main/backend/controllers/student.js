const bcrypt = require('bcrypt');
const { Student } = require('../models');

exports.updatePassword = async (req, res) => {
    try {
        const { admissionNo, newPassword } = req.body;
        
        // 1. Hash the password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // 2. Update the database
        await Student.update(
            { password: hashedPassword },
            { where: { admissionNo: admissionNo } }
        );
        
        res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error updating password", error });
    }
};