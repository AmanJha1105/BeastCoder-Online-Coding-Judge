const express= require("express");
const { getDiscussions, AddComment, addReply, likeComment, likeReply } = require("../controllers/discussionsController");
const router = express.Router();

router.get("/:questionId/discussions",getDiscussions);

router.post("/:questionId/discussions/comment",AddComment);

router.post("/:questionId/discussions/comment/:commentId/reply",addReply);

router.post("/:questionId/discussions/:commentId/like",likeComment);

router.post("/:questionId/discussions/:commentId/:replyId/like",likeReply);

module.exports = router;
