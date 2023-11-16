import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Get a user
router.get('/', async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId ? await User.findById(userId): await User.findOne({username: username})
        const {password, createdAt, ...other} = user._doc
        res.status(200).json(other)
    } catch (error) {
        res.status(500).json(error)
    }
});


// Update user
router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      if (req.body.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (err) {
          return res.status(500).json(err);
        }
      }
      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        res.status(200).json("Account has been updated");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You can update only your account!");
    }
});


// Delete user
router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Account has been deleted");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You can delete only your account!");
    }
});


// Follow a user
router.put("/:id/follow", async (req, res) => {
    if(req.body.userId !== req.params.id){
      try {
        const user = await User.findById(req.params.id)
        const currentUser = await User.findById(req.body.userId);
  
        if(!user.followers.includes(req.body.userId)){
          await user.updateOne({$push: {followers: req.body.userId}});
          await currentUser.updateOne({$push: {followings: req.params.id}});
          res.status(200).json("user hasbeen followed");
  
        }else{
          res.status(403).json("you already follow this user")
        }
      } catch (error) {
        res.status(500).json(error)
      }
  
    }else{
      res.status(403).json("you can't follow yourself")
    }
  
});


// Unfollow a user
router.put("/:id/unfollow", async (req, res) => {
    if(req.body.userId !== req.params.id){
      try {
        const user = await User.findById(req.params.id)
        const currentUser = await User.findById(req.body.userId);
  
        if(user.followers.includes(req.body.userId)){
          await user.updateOne({$pull: {followers: req.body.userId}});
          await currentUser.updateOne({$pull: {followings: req.params.id}});
          res.status(200).json("user hasbeen unfollowed");
  
        }else{
          res.status(403).json("you already unfollowed this user")
        }
      } catch (error) {
        res.status(500).json(error)
      }
  
    }else{
      res.status(403).json("you can't unfollow yourself")
    }
  
});
  
export default router;