const Discussion = require('../model/Discussions');
const Question = require('../model/Question');
const User = require('../model/User');

const getDiscussions = async(req,res)=>{
  try {
    const { questionId } = req.params;

    const ques = await Question.findOne({ titleslug: questionId });

    const quesId = ques._id;

    const discussion = await Discussion.findOne({ question: quesId })

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    res.json(discussion);
  } catch (error) {
    console.error('Error fetching discussion:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const AddComment = async(req,res)=>{

    try {
        const { questionId } = req.params;
        const { content ,userId} = req.body;

        const user = await User.findById(userId);

        const username = user.username;

        const ques = await Question.findOne({ titleslug: questionId });

        const quesId = ques._id;

        if (!ques) {
            return res.status(404).json({ message: "Question not found" });
        }
    
        let discussion = await Discussion.findOne({ question: quesId });
    
        if (!discussion) {
          discussion = new Discussion({ question: quesId, comments: [] });
        }
    
        discussion.comments.push({ content :content, author: userId ,username: username});
        await discussion.save();

    
        res.status(201).json(discussion);
      } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

const addReply = async(req,res)=>{

  try {
    const { questionId, commentId } = req.params;
    const { content, userId } = req.body;

    const user = await User.findById(userId);
    const username = user.username;

    const ques = await Question.findOne({ titleslug: questionId });

    const quesId = ques._id;

    const discussion = await Discussion.findOne({ question: quesId });

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    const comment = discussion.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    comment.replies.push({ content, author: userId, username });
    await discussion.save();

    res.status(201).json(discussion);
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

}

const likeComment = async (req,res)=>{
  try {
    const { questionId, commentId } = req.params;
    const { userId } = req.body;

    const user = await User.findById(userId);
    const username = user.username;

    const ques = await Question.findOne({ titleslug: questionId });

    const quesId = ques._id;

    const discussion = await Discussion.findOne({ question: quesId });

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    const comment = discussion.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const userIndex = comment.likes.indexOf(userId);

    if (userIndex === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes.splice(userIndex, 1);
    }

    await discussion.save();

    return res.status(201).json(discussion);

  } catch (error) {
    console.error('Error liking comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

}

const likeReply = async(req,res)=>{
  try {
    const { questionId, commentId, replyId } = req.params;
    const {userId} = req.body;

    const ques = await Question.findOne({ titleslug: questionId });

    const quesId = ques._id;

    const discussion = await Discussion.findOne({ question: quesId });

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    const comment = discussion.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const reply = comment.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    const likedIndex = reply.likes.indexOf(userId);
    if (likedIndex === -1) {
      reply.likes.push(userId);
    } else {
      reply.likes.splice(likedIndex, 1);
    }

    await discussion.save();
    return res.status(201).json(discussion);

  } catch (error) {
    console.error('Error liking reply:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.getDiscussions = getDiscussions;
exports.AddComment = AddComment;
exports.addReply = addReply;
exports.likeComment = likeComment;
exports.likeReply = likeReply;