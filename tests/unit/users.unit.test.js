const mongoose = require('mongoose');
const User = require('../../src/models/user');
const { validateEmail } = require('../../src/utils/validation');

describe('User Model', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it('should create a user with valid name and email', async () => {
        const user = new User({ name: 'John Doe', email: 'john.doe@example.com' });
        const savedUser = await user.save();
        expect(savedUser._id).toBeDefined();
        expect(savedUser.name).toBe('John Doe');
        expect(savedUser.email).toBe('john.doe@example.com');
    });

    it('should not create a user with duplicate email', async () => {
        const user1 = new User({ name: 'Jane Doe', email: 'jane.doe@example.com' });
        await user1.save();
        const user2 = new User({ name: 'Jane Smith', email: 'jane.doe@example.com' });
        await expect(user2.save()).rejects.toThrow();
    });

    it('should validate email format', () => {
        expect(validateEmail('test@example.com')).toBe(true);
        expect(validateEmail('invalid-email')).toBe(false);
    });

    it('should not create a user without name', async () => {
        const user = new User({ email: 'no.name@example.com' });
        await expect(user.save()).rejects.toThrow();
    });

    it('should not create a user without email', async () => {
        const user = new User({ name: 'No Email' });
        await expect(user.save()).rejects.toThrow();
    });
});