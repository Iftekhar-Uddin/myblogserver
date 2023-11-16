import express from 'express';
import mongoose from "mongoose";
import verify from '../middleware/verify.js';
import User from '../models/User.js';
import Post from "../models/Posts.js";

const router = express.Router();


// gets posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json("error")
    }
});

// create post
router.post('/', verify, async (req, res) => {
    const newpost = new Post(req.body)
    try {
        const savedPost = await newpost.save()
        res.status(200).json(savedPost)
    } catch (error) {
        res.status(500).json(error)
    }
});

// get post
router.get('/:_id', async (req, res) => {
    try {
        const post = await Post.findById(req.params._id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error)
    }
});

// Like post
router.patch('/:id/likePost', verify, async (req, res) => {
    const {id} = req.params;

    // if(!req.userId) return res.json({message: 'Unauthenticated'});

    // if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with this id');

    const post = await Post.findById(id);
    
    const index = post.likes.findIndex((id) => id === String(req.userId));
    
    if(index === -1){
        post.likes.push(req.userId);
    } else {
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    const updatedPost = await Post.findByIdAndUpdate(id, post, {new: true});

    res.json(updatedPost)
})

//update post
router.patch('/:_id', verify, async (req, res) => {
    const {_id} = req.params;
    const post = req.body;

    const updatedPost = await Post.findByIdAndUpdate(_id, {...post}, {new: true});

    res.json(updatedPost)
})

// delete post
router.delete('/:id', verify, async (req, res) => {
    const {id} = req.params;
    const deletePost = await Post.findByIdAndRemove(id);
    res.json(deletePost)
})


export default router;