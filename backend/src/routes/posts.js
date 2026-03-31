import { Router } from 'express';
import { getPosts, getPost, createPost, upvotePost, deletePost } from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/',            getPosts);
router.get('/:id',         getPost);
router.post('/',           protect, createPost);
router.put('/:id/upvote',  protect, upvotePost);
router.delete('/:id',      protect, deletePost);

export default router;