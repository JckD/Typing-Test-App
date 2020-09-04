const express = require("express");
const { check, validationResult } = require("express-validator/check");
const UserRoutes = express.Router();
const bcrypt = require("bcrypt");


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
                return res.status(400).json({
                    message : "That email is alredy in use"
                });
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

module.exports = UserRoutes;