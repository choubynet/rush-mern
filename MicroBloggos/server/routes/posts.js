const router = require("express").Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const Post = require("../models/Post");
const User = require("../models/User");

router.route('/add')
    .post(
        passport.authenticate('jwt', { session: false }),
        (req, res) => {
            const text = req.body.text.trim()
            
            const newPost = new Post({
                user: {
                    id: req.user.id,
                    login: req.user.login
                },
                text
            })

            newPost.save()
                .then(post => res.json(post))
                .catch(err => console.log(err))
        }    
    )

router.route('/delete')
    .post(
        passport.authenticate('jwt', { session: false }),
        (req, res) => {
            Post.findOneAndRemove({_id: req.body.id, "user.id": req.user.id}, req.body)
                .then(res.json("Ok"))
                .catch(err => console.log(err))
        }    
    )

router.route('/edit')
    .post(
        passport.authenticate('jwt', { session: false }),
        (req, res) => {
            Post.findOneAndUpdate({_id: req.body.id, "user.id": req.user.id}, {text: req.body.text}, {new: true})
                .then(Post => res.json(Post))
                .catch(err => console.log(err))
        }    
    )

router.route('/')
    .get((req, res) => {
        Post.find()
            .sort({ createdAt: -1 })
            .then(posts => res.json(posts))
            .catch(err => console.log(err))
    })

router.route('/following')
    .get(
        passport.authenticate('jwt', { session: false }),
        (req, res) => {
            Post.find({
                'user.id': { $in: req.user.following }
            })
            .sort({ createdAt: -1 })
            .then(posts => res.json(posts))
            .catch(err => console.log(err))
    })

router.route('/find')
    .get((req, res) => {
        Post.findById(req.body.postId)
            .then(post => {
                if (post) {
                    return res.json({
                        text: post.text
                    })
                }
                else {
                    return res.status(404).json({ msg: 'Post not found'})
                }
            })
            .catch(err => console.log(err))                
    })

router.route('/:userId')
    .get((req, res) => {
        Post.find({ 'user.id': req.params.userId })
            .sort({ createdAt : -1 })  
            .then(posts => res.json(posts))
            .catch(err => console.log(err))                
    })

module.exports = router;