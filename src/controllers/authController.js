import users from '../models/User.js'
import passport from 'passport';
import bcrypt from 'bcrypt';

class usersController {
static login = passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
});

static register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new users({ username, password: hashedPassword });
        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        res.status(500).json({ error: 'Registration failed.' });
    }
};
}
export default usersController