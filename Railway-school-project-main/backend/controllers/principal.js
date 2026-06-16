

const { User } = require('../models');

// Fetch all users waiting for approval
exports.getPendingUsers = async (req, res) => {
    try {
        const pendingUsers = await User.findAll({
            where: { status: 'pending' },
            attributes: ['id', 'email', 'role', 'name', 'createdAt']
        });
        res.status(200).json(pendingUsers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pending users", error: error.message });
    }
};

// Approve or Reject a user
exports.handleUserDecision = async (req, res) => {
    try {
        const { userId, action } = req.body; // action should be 'approved' or 'rejected'
        
        if (!['approved', 'rejected'].includes(action)) {
            return res.status(400).json({ message: "Invalid action" });
        }

        await User.update(
            { status: action },
            { where: { id: userId } }
        );

        res.status(200).json({ message: `User account has been ${action}.` });
    } catch (error) {
        res.status(500).json({ message: "Error processing decision", error: error.message });
    }
};