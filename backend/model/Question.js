const mongoose=require("mongoose");

const questionSchema = new mongoose.Schema({
  level: {
    type: String,
    required: true,
    enum: ["easy", "medium", "hard"],
  },
  topics: {
    type: String,
    required: true,
    default:'',
  },

  sampleTestcases:[
    {
        input :{
            type: String,
            required: true,
            default: '',
        },
        output:{
            type: String,
            required: true,
            default: '',
        },
        default:{}
    }
  ],

  title: {
    type: String,
    required: true,
  },

  titleslug: {
    type: String,
    required: true,
    unique: true,
  },

  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },

  content: {
    type: String,
    required: true,
  },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports=mongoose.model('question',questionSchema);