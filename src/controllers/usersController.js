const User = require('../models/user');

exports.createUser = async (req, res) => {
    const { name, email } = req.body;
    try {
        const user = new User({ name, email });
        await user.save();
        res.status(201).json({ user });
    } catch (error) {
        console.error('Error creating user:', error);
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Email already exists' });
        }
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
};

exports.getUsers = async (req, res) => {
    const { page = 1, limit = 10, q, sort } = req.query;
    const query = q ? { name: { $regex: q, $options: 'i' } } : {};
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort ? { [sort]: 1 } : {}
    };
    try {
        const result = await User.paginate(query, options);
        res.status(200).json({ users: result.docs, totalPages: result.totalPages, currentPage: result.page });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const user = await User.findByIdAndUpdate(id, { name, email }, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

exports.getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const lastWeekUsers = await User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } });
        const byDomain = await User.aggregate([
            { $group: { _id: { $substr: ['$email', { $add: [{ $indexOfBytes: ['$email', '@'] }, 1] }, -1] }, count: { $sum: 1 } } },
            { $project: { domain: '$_id', count: 1, _id: 0 } }
        ]);
        const domainStats = byDomain.reduce((acc, { domain, count }) => ({ ...acc, [domain]: count }), {});
        res.status(200).json({ totalUsers, lastWeekUsers, byDomain: domainStats });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};