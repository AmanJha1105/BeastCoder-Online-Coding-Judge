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
  },

  sampleTestcases:[
    {
        input :{
            type: String,
            required: true,
        },
        output:{
            type: String,
            required: true,
        }
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
});

module.exports=mongoose.model('question',questionSchema);