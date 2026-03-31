import Post from '../models/Post.js';
import User from '../models/User.js';

const POINTS = { create: 10, upvote_received: 2 };

export const getPosts = async (req, res) => {
  try {
    const { category, neighborhood, city, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category)     filter.category = category;
    if (neighborhood) filter.neighborhood = new RegExp(neighborhood, 'i');
    if (city)         filter.city = new RegExp(city, 'i');

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('author', 'username neighborhood points badges')
        .sort({ pinned: -1, createdAt: -1 })
        .skip((page - 1) * Number(limit))
        .limit(Number(limit)),
      Post.countDocuments(filter),
    ]);

    res.json({ posts, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username neighborhood points badges');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, body, category, neighborhood, city } = req.body;
    const post = await Post.create({
      title, body, category, neighborhood, city,
      author: req.user.id,
    });
    await User.findByIdAndUpdate(req.user.id, { $inc: { points: POINTS.create } });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const upvotePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const alreadyVoted = post.upvotes.some((id) => id.toString() === req.user.id);
    if (alreadyVoted) {
      post.upvotes.pull(req.user.id);
    } else {
      post.upvotes.push(req.user.id);
      if (post.author.toString() !== req.user.id)
        await User.findByIdAndUpdate(post.author, { $inc: { points: POINTS.upvote_received } });
    }
    await post.save();
    res.json({ upvotes: post.upvotes.length, voted: !alreadyVoted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Forbidden' });
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};