import users from '../models/User.js'
import passport from 'passport';
// import bcrypt from 'bcrypt';


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
  // static listarLivros = (req, res) => {
  //   livros
  //     .find()
  //     .populate('autor')
  //     .exec((err, livros) => {
  //       res.status(200).json(livros)
  //     })
  // }

  // static listarLivroPorID = (req, res) => {
  //   const id = req.params.id

  //   livros
  //     .findById(id)
  //     .populate('autor', 'nome')
  //     .exec((err, livros) => {
  //       if (err) {
  //         res
  //           .status(400)
  //           .send({ message: `${err.message} - Id do livro não localizado.` })
  //       } else {
  //         res.status(200).send(livros)
  //       }
  //     })
  // }

  static signUp = (req, res) => {
    let user = new users(req.body)
    // console.log(user);
    // return false;
    user.save(err => {
      if (err) {
        res
          .status(500)
          .send({ message: `${err.message}` })
      } else {
        res.status(201).send(user.toJSON())
      }
    })
  }

  static signUpWithReferalCode = async (req, res) => {
    const referByCode = req.params.code; // Extract referral code from URL parameter
    const userData = req.body; // User data from request body


    // Add the referral code to the user data
    userData.referralCode = referByCode;
    const uniqueReferralCode = await generateReferralCode();
    userData.referralCode = uniqueReferralCode;
    // search and get inverter id
    const user = await users.findOne({'referralCode': referByCode });
    // console.log(user);return false;

    if (!user) {
      console.log("not found");return false;
        // res.status(404).send({ message: 'User not found for the provided referral code.' });
    } else {
      userData.referredBy = user._id;
      // console.log(userData);return false;
        // res.status(200).send(user.toJSON());
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
    console.log(res); // Log the response object
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next); // Call the passport.authenticate middleware
}

  static getUserProfile = (req, res) => {
    res.json({ message: 'User profile.' });
  };

  // static atualizarLivro = (req, res) => {
  //   const id = req.params.id

  //   livros.findByIdAndUpdate(id, { $set: req.body }, err => {
  //     if (!err) {
  //       res.status(200).send({ message: 'Livro atualizado com sucesso' })
  //     } else {
  //       res.status(500).send({ message: err.message })
  //     }
  //   })
  // }

  
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

  // static excluirLivro = (req, res) => {
  //   const id = req.params.id

  //   livros.findByIdAndDelete(id, err => {
  //     if (!err) {
  //       res.status(200).send({ message: `Livro removido com sucesso` })
  //     } else {
  //       res.status(500).send({ message: `${err.message}` })
  //     }
  //   })
  // }

  // static listarLivroPorEditora = (req, res) => {
  //   const editora = req.query.editora

  //   livros.find({ editora: editora }, {}, (err, livros) => {
  //     res.status(200).send(livros)
  //   })
  // }

  
}

export default usersController

