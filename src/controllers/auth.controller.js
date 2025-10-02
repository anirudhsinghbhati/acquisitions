import logger from '../config/logger.js';
import { signupSchema } from '../validations/auth.validation.js';
import { formatValidateError } from '../utils/format.js';
import { createUser } from '../services/auth.service.js';
import jwttoken from '../utils/jwt.js';
import { cookieStore } from '../utils/cookies.js';

export const signup = async (req, res , next) => {
    try {
        // Placeholder logic for user signup
        const validationResult = signupSchema.safeParse(req.body);
        if(!validationResult.success) {
            return res.status(400).json({ 
                error: 'Validation failed' , 
                details: formatValidateError(validationResult.error)
             });
        }
        const { name, email, password, role } = validationResult.data;

        const user = await createUser({ name, email, password, role });

        const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role });

        cookieStore.set(res, 'token', token);

        logger.info('User Registration successfully: $(email)');
        res.status(201).json({ message: 'User registered successfully',
            user: { id: user.id, name: user.name, email: user.email, role: user.role}
         });
    } catch (error) {
        logger.error('Error during signup:', error);
        if(error.message === 'User with this email already exists') {
            return res.status(409).json({ error: 'Email already exist' });
        }
        next(error);
    }
};