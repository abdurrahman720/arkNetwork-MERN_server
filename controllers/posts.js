import Post from '../models/Post.js';
import User from '../models/User.js';

// create post 
export const createPosts = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        })

        await newPost.save();
        const posts = await Post.find(); // we need to get all the posts for the feed after creating a post 
        res.status(201).json(posts)
    }
    catch (err) {
        res.status(409).json({ message: err.message });
    }
}

// read 
export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(201).json(posts)
    }
    catch (err) {
        res.status(409).json({ message: err.message });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({userId});
        res.status(201).json(posts)
    }
    catch (err) {
        res.status(409).json({ message: err.message });
    }
}

// update

export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId); // will return a boolean value 
        
        if (isLiked) {
            post.likes.delete(userId); //get, delete and set method is for mapping. check PostSchema to learn more
        }
        else {
            post.likes.set(userId);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {likes: post.likes},
           {new:true}
        );

        res.status(200).json(updatedPost)
    }
    catch (err) {
        res.status(409).json({ message: err.message });
    }
}