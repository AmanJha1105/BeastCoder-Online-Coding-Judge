const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username:{ type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const solutionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username:{type:String, required:true},
  submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true },
  quesID: { type: String, required: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  timeOfPublish: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  topics: { type: [String] },
  replies: { type: [replySchema], default: [] },
});

module.exports = mongoose.model('Solution', solutionSchema);
