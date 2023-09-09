import users from '../models/User.js'
import mailerService from '../services/mailerService.js'
import templateController from '../controllers/templateController.js'
import passport from 'passport';
import 'dotenv/config';


const generateReferralCode = async () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const codeLength = 6; // You can adjust the length of the referral code

  let code;
  let codeExists = true;

  while (codeExists) {
    // Generate a random code
    code = Array.from({ length: codeLength }, () => characters[Math.floor(Math.random() * characters.length)]).join('');

    // Check if the code already exists in the database
    const existingUser = await users.findOne({ referralCode: code });

    if (!existingUser) {
      codeExists = false;
    }
  }

  return code;
};

class usersController {
  static getProfile = (req, res) => {
    const id = req.params.id

    users
      .findById(id)
      .populate('name', 'points')
      .exec((err, users) => {
        if (err) {
          res
            .status(400)
            .send({ message: `${err.message} - Invalid user id.` })
        } else {
          res.json({ User: users.name, Points: users.points });
        }
      })
  }

  static signUp = async (req, res) => {
    let user = new users(req.body);
    const uniqueReferralCode = await generateReferralCode();
    user.referralCode = uniqueReferralCode;
    const userres = await user.save();
    try {
      req.params.type = "signup";
      const type = req.params.type;
      let template = {};
      const templateResult = await templateController.getTemplate(type);
      console.log("templateResult", templateResult); // You can use templateResult here 
      const personalization = [
        {
          email: 'anujaahire84@gmail.com',
          data: {
            name: 'Vimalraj Kumar',
            account_name: 'Vimalraj Kumar',
            support_email: 'vimalrajk89@live.com'
          },
        }];
      const emailParams = {
        personalization: personalization,
        recipientEmail: 'anujaahire84@gmail.com',
        recipientName: 'Anuja ahire',
        senderEmail: templateResult.senderEmail,
        senderName: templateResult.senderName,
        templateId: templateResult.templateId,
        subject: templateResult.subject
      };


      const sendMail = await mailerService.signUpEmailTemplate(emailParams);
      console.log("Registred successfully");
      res.json(userres);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }   

  }


  static signUpWithReferalCode = async (req, res) => {
    const referByCode = req.params.code; // Extract referral code from URL parameter
    const userData = req.body; // User data from request body
    // Add the referral code to the user data
    userData.referralCode = referByCode;
    const uniqueReferralCode = await generateReferralCode();
    userData.referralCode = uniqueReferralCode;
    // search and get inverter id
    const user = await users.findOne({ 'referralCode': referByCode });
    // console.log(user);return false;

    if (!user) {
      console.log("not found"); return false;
      // res.status(404).send({ message: 'User not found for the provided referral code.' });
    } else {
      userData.referredBy = user._id;
      let id = user._id;
      const updatedUser = await users.findByIdAndUpdate(id, { $set: { 'role': 'inverter' } });
    }


    const newuser = new users(userData); // Create a new User instance
    newuser.save((err) => {
      if (err) {
        res.status(500).send({ message: err.message });
      } else {
        res.status(201).send(newuser.toJSON());
      }
    });
  }


  static login = (req, res, next) => {
    console.log("login");

    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed.' });
      }
      res.json({ message: 'User Login successfully' });

    })(req, res, next); // Call the passport.authenticate middleware
  };


  static getUserProfile = (req, res) => {
    res.json({ message: 'User profile.' });
  };


  static approveUser = async (req, res) => {
    const id = req.params.id;

    try {
      const updatedUser = await users.findByIdAndUpdate(id, { $set: { 'referralStatus': 'approved' } });

      if (!updatedUser) {
        res.status(404).send({ message: 'User not found.' });
        return;
      }

      const referredBy = updatedUser.referredBy;

      // Calculate points for the referrer
      const referredUsers = await users.find({ 'referredBy': referredBy, 'referralStatus': 'approved' });
      const points = referredUsers.length * 10;

      // Update points of the referrer
      await users.findByIdAndUpdate(referredBy, { $set: { 'points': points } });

      res.status(200).send({ message: 'User approved successfully and points added.' });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
}

export default usersController