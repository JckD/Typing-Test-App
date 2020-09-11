const express = require("express");
const { check, validationResult } = require("express-validator");
const UserRoutes = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verify = require('./verifyToken');


let User = require("../schemas/user.model");

UserRoutes.get('/', async (req, res) => {
    console.log(req.data);
    User.find(function(err, notUsers){
        if (err) {
            console.log(err);
        } else {
           // res.json(notUsers);
           console.log('/getting')
        }
    });
});

UserRoutes.get('/:id' , async (req, res) => {
    let id = req.params.id

    try {
        let account = await User.findById(id)
        console.log(account)
        res.send(account)
    }
    catch (err) {
        console.log(err);
    }
})

UserRoutes.post('/register', 
    [
        check("userName", "Please Enter a Valid Username").not().isEmpty(),
        check("userEmail", "Please Enter a Valid Email").isEmail(),
        check("userPassword", "Please enter a valid password").isLength({ min : 6 })
    ],
    async (req, res) => {
       
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            userName,
            userEmail,
            userPassword,
        } = req.body;
        
        try {
            let user = await User.findOne({
                userEmail
            });
            if (user) {
                
                return res.status(400).send('email in use');
            }

            user = new User(
                req.body
            );

            const salt = await bcrypt.genSalt(10);
            user.userPassword = await bcrypt.hash(userPassword, salt);

            await user.save();


        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in saving");
        }
    }  
)

UserRoutes.post(
    "/login",
    [
        check("userName", "please enter a valid username").not().isEmpty(),
        check("userPassword", "please enter a valid password").isLength({ min : 6 }),
    ],

    async (req, res) => {
       
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                errors: errors.array()
            });
        }
        
        const { userName, userPassword } = req.body;
        try {
            let account = await User.findOne({
                userName
            });
            console.log(account)
            if(!account) {
                return res.status(400).json({
                    message: "User Does Not Exist"
                });
            }

            const isMatch = await bcrypt.compare(userPassword, account.userPassword);
            if (!isMatch) {
                return res.status(400).json({
                    message : "Incorrect Password!"
                });
            }
            else {
               
                const token = jwt.sign({_id : account._id}, process.env.SEC)
                res.header('auth-token', token).send(token);
                
                // req.session.account = account;
                // req.session.save();
                // res.send(account)
            }

        } catch (e)  {
            console.error(e);
            res.status(500).json({
                message : "Server Error"
            });
        }
    }
);

UserRoutes.post('/logout',verify , async (req, res) => {

})

module.exports = UserRoutes;