// const User = require('../models/userModel');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');

// async function hashPassword(password){
//     return await bcrypt.hash(password, 10);
// }

// async function validatePassword(plainPassword, hashedPassword){
//     return await bcrypt.compare(plainPassword, hashedPassword);
// }

// exports.signup = async (req, res, next) => {
//     try {
//         const {name, email, phone, password, role} = req.body;
//         const hashedPassword = await hashPassword(password);
//         const newUser = new User({ name, email, phone, password: hashedPassword, role: role && "basic"});
//         const accessToken = jwt.sign({ userId: newUser._id}, process.env.JWT_SECRET, {
//             expiresIn: '1h'
//         });
//         newUser.accessToken = accessToken;
//         await newUser.save();
//         res.status(201).json({
//             message: 'User created successfully',
//             data: newUser,
//             accessToken
//         });
//     } catch (error) {
//         if (!error.statusCode) {
//             error.statusCode = 500;
//         }
//         next(error);
//     }
// }

// exports.login = async (req, res, next) => {
//     try {
//         const {email, password} = req.body;
//         const user = await User.findOne({email});
//         if (!user) return next(new Error('Email does not exist', 404));
//         const validPassword = await validatePassword(password, user.password);
//         if (!validPassword) return next(new Error('Invalid password', 401));
//         const accessToken = jwt.sign({ userId: user._id}, process.env.JWT_SECRET, {
//             expiresIn: '1h'
//         });
//         await User.findByIdAndUpdate(user._id, { accessToken })
//         res.status(200).json({
//             message: 'User logged in successfully',
//             data: {email: user.email, role: user.role },
//             accessToken
//         });
//     } catch (error) {
//         console.log(error)
//         res.status(400).send({ message: 'Invalid email or password', error });
//     }
// }


const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("./../models/userModel")
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const auth = {}

auth.signup = async (req, res) => {
  const data = req.body

  try {
    const passwordHash = await bcrypt.hash(data.password, 10)
    const user = await new User({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: passwordHash
    }).save()

    const token = jwt.sign({ user_id: user._id }, JWT_SECRET_KEY, { expiresIn: 60 * 10 })

    res.status(201).send({
      message: "User created",
      data: {
        token,
        user_id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    })
  } catch (error) {
    res.status(400).send({ message: "User couldn't be created", error })
  }

}

auth.signin = async (req, res) => {
  const data = req.body

  try {
    const user = await User.findOne({ email: data.email })
    if (!user) return res.status(400).send({ message: "Invalid email or password" })
    const isValidPassword = await bcrypt.compare(data.password, user.password)
    if (!isValidPassword) return res.status(400).send({ message: "Invalid email or password" })

    const token = jwt.sign({ user_id: user._id }, JWT_SECRET_KEY)

    res.status(200).send({
      message: "User created",
      data: {
        token,
        user_id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({ message: "Unable to signin", error })
  }

}

module.exports = auth