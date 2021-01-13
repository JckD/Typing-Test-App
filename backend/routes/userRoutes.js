const express = require("express");
const { check, validationResult } = require("express-validator");
const UserRoutes = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require('./verifyToken');


let User = require("../schemas/user.model");
const e = require("express");
const { find, findById } = require("../schemas/user.model");

UserRoutes.get('/', async (req, res) => {
    //console.log(req.data);
    User.find(function(err, users){
        if (err) {
            console.log(err);
        } else {
            res.json(users);
           //console.log('/getting')
        }
    });
});


// Get user's profile
// requires auth
UserRoutes.get('/profile', verify , async(req, res) => {
    
    //console.log(req.user._id)
    let  id = req.user._id
    let user = await User.findById(id)

    res.send(user);
})

UserRoutes.get('/:id' , async (req, res) => {
    let id = req.params.id

    try {
        let account = await User.findById(id)
        //console.log(account)
        res.send(account)
    }
    catch (err) {
        console.log(err);
    }
})



// Register a new user route
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


// User login route 

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
            //console.log(account)
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


// Update user info route
UserRoutes.post('/update', verify, async(req, res) => {
        const {
            userName,
            email,
            id,
            password
            
        } = req.body
        //console.log(req.body)
        const salt = await bcrypt.genSalt(10);

        User.findByIdAndUpdate(id,
                            { userName : userName , 
                              userEmai : email,
                              userPassword : await bcrypt.hash(password,salt)
                            },
                            function(err, result) {
                                if (err) {
                                    res.send(err);
                                } else {
                                    res.send(result)
                                }
                            }
            );
        }) 


// Update user's highscore route
UserRoutes.post('/updateHS', verify , async(req, res) => {
    await User.findByIdAndUpdate(
        { _id : req.body._id}, 
        { personalBestWPM : req.body.personalBestWPM,
          personalBestAcc : req.body.personalBestAcc
},
          function(err, user) {
        if (err) {
            res.send(err)
        } else {
            res.send(user)
        }
    })
})


// Push to users latest scores arrays
UserRoutes.post('/updateScores', verify , async(req, res) => {
    // get the user obj
    let user  = await User.find({ _id : req.body._id})
    // check if latest scores is >= 20
    // if it is pop the first score in the array
    // push new score on the aray
    if (user != undefined && user[0].latestWPMScores.length >= 20) {
        try {
            await User.findOneAndUpdate(
                { _id: req.body._id},
                { $pop: { 'latestWPMScores': -1 , 'latestAccScores' : -1 } }
            )
        } catch (e) {
            console.log(e)
        }
    }
    
    try {
        await User.findOneAndUpdate(
            { _id : req.body._id},
            { $push: { 'latestWPMScores' : [req.body.wpm] ,'latestAccScores' : [req.body.acc] }},
        )
        res.send('scores')
    } catch (e) {
        console.log(e)
    }
    
})

// Add quote to list of user's added qoutes
UserRoutes.post('/addQuote', verify , async(req, res) => {
    try {
        await User.updateOne(
            { _id: req.body.userId},
            { $push: { 'quotesAdded' : [req.body.quoteId]}}
        )
    } catch (e) {
        res.send({message : "Error adding quote to user's quotes"})
    }
})

// Delete user route
UserRoutes.post('/delete',verify , async (req, res) => {

    try {
        await User.findOneAndDelete({ 'userName' : req.body.userName})

        res.send({message : 'account deleted'})
    } catch (err) {
        res.send({message : "Error deleting account"});
    }

})

module.exports = UserRoutes;