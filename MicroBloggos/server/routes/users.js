const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const validateRegisterInput = require('../validation/register')
const validateLoginInput = require('../validation/login')

router.route('/register')
    .post((req, res) => {
        const { isValid, errors } = validateRegisterInput(req.body);

        if (!isValid) {
            return res.status(404).json(errors);
        }

        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    errors.email = 'Email already used !'
                    return res.status(404).json(errors);
                }

                User.findOne({ login: req.body.login })
                    .then(user => {
                        if (user) {
                            errors.login = 'Login already used !'
                            return res.status(404).json(errors);
                        }

                        bcrypt.genSalt(10, function (err, salt) {
                            bcrypt.hash(req.body.password, salt, function(err, hash) {
                                const newUser = new User({
                                    email: req.body.email,
                                    login: req.body.login,
                                    password: hash
                                })

                                newUser.save()
                                    .then(newUser => res.json(newUser))
                                    .catch(err => console.log(err))
                            })                
                        })
                })
            })
    })

router.route('/login')
    .post((req, res) => {
        const { errors, isValid } = validateLoginInput(req.body)

        if (!isValid) {
            return res.status(404).json(errors)
        }

        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    bcrypt.compare(req.body.password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '1d' }, function (err, token) {
                                return res.json({
                                    success: true,
                                    token: token
                                })
                            });
                        }
                        else {
                            errors.password = 'Password is incorrect';
                            return res.status(404).json(errors);
                        }
                    })
                }
                else {
                    errors.email = 'User not found';
                    return res.status(404).json(errors);
                }               
            })
    })

router.route('/')
    .get( passport.authenticate('jwt', { session: false }),(req, res) => {
        res.json({
            _id: req.user._id,
            email: req.user.email,
            login: req.user.login,
            followers: req.user.followers,
            following: req.user.following
        })
    })

router.route('/follow')
    .post(
        passport.authenticate('jwt', { session: false}),
        (req, res) => {
            User.findOneAndUpdate({
                _id: req.user._id
            }, {
                $push: { following: req.body.userId}
            },
            { new: true})
            .then(user => {
                User.findOneAndUpdate({
                    _id: req.body.userId
                }, {
                    $push: { followers: req.user.id }
                }, { new: true })
                .then(user => res.json({ userId: req.body.userId }))
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
        }
    )

router.route('/unfollow')
    .post(
        passport.authenticate('jwt', { session: false}),
        (req, res) => {
            User.findOneAndUpdate({
                _id: req.user.id
            }, {
                $pull: { following: req.body.userId}
            },
            { new: true})
            .then(user => {
                User.findOneAndUpdate({
                    _id: req.body.userId
                }, {
                    $pull: { followers: req.user.id }
                }, { new: true })
                .then(user => res.json({ userId: req.body.userId }))
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
        }
    )

router.route('/search')
	.post((req, res) => {
		User.findOne({
			$or: [
				{email: req.body.text},
				{login: req.body.text}
			]
		})
		.then(user => res.json({ userId: user._id }))
		.catch(err => res.status(404).json({ msg: 'User not found'}))
    })

router.route('/find/:id')
    .get((req, res) => {
        User.findById(req.params.id)
            .then(user => {
                if (user) {
                    return res.json({
                        _id: user._id,
                        login: user.login,
                        email: user.email,
                        followers: user.followers,
                        following: user.following
                    })
                }
                else {
                    return res.status(404).json({ msg: 'User not found'})
                }
            })
            .catch(err => console.log(err))                
    })

router.route('/allusers')
    .get((req, res) => {
        User.find()
            .sort({ login: 1 })
            .then(users => res.json(users))
            .catch(err => console.log(err))
    })

router.route('/modify')
    .post(passport.authenticate('jwt', { session: false }), (req, res) => {
        const { isValid, errors } = validateRegisterInput(req.body);

        if (!isValid) {
            return res.status(404).json(errors);
        }

        User.findOne({ email: req.body.email })
            .then(user => {
                if (user && user.email !== req.user.email) {
                    errors.email = 'Email already used !'
                    return res.status(404).json(errors);
                }

                User.findOne({ login: req.body.login })
                    .then(user => {
                        if (user && user.login !== req.user.login) {
                            errors.login = 'Login already used !'
                            return res.status(404).json(errors);
                        }

                        bcrypt.genSalt(10, function (err, salt) {
                            bcrypt.hash(req.body.password, salt, function(err, hash) {
                                User.findOneAndUpdate({
                                    _id: req.user.id
                                }, {
                                    login: req.body.login,
                                    email: req.body.email,
                                    password: hash

                                },
                                { new: true})
                                .then(User => {
                                    Post.updateMany({
                                        "user.id": req.user.id
                                    }, {
                                        $set: { "user.login": req.body.login }
                                    }, { multi: true })
                                    .then(res.json(User))
                                    .catch(err => console.log(err))
                                })
                                .catch(err => console.log(err))
                            })                
                        })
                })
            })
    })
    
module.exports = router;