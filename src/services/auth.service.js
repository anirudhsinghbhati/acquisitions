import logger from '../config/logger.js';
import bcrypt from 'bcryptjs';
import { db, sql } from '../config/database.js';
import { users } from '../models/user.model.js';
import { eq } from 'drizzle-orm';


export const hashPassword = async (password) => {
    // Placeholder for password hashing logic
    try {
        // Simulate hashing
        return await bcrypt.hash(password, 10);
    } catch (error) {
        logger.error('Error hashing password:', error);
        throw new Error('Password hashing failed');
    }
};
export const createUser = async ({ name, email, password, role = 'user'}) => {
    try {
        const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (existingUser.length > 0) {
            throw new Error('User with this email already exists');
        }
        const password_hash = await hashPassword(password);
        const newUser = await db
            .insert(users).values({
                name, 
                email, 
                password: password_hash, 
                role
            })
            .returning({id: users.id, name: users.name, email: users.email, role: users.role, created_at: users.created_at});
        logger.info(`User ${newUser[0].email} created successfully`);
        return newUser[0];
    }
    catch (error) {
        logger.error('Error creating user:', error);
        throw error;
    }
};




