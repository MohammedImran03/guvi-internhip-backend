const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
    userId:{
        type: String,
        default:null,
    },
    tasktitle:{
      type: String,
      default:null,
    },
    taskdescrp:{
    type: String,
    default:null,
  },
  stratdate:{
    type: String,
    default:null,
  },
  taskenddate:{
    type: String,
    default:null,
  },
  taskstarttime:{
    type: String,
    default:null,
  },
  taskendtime:{
    type: String,
    default:null,
  },

});
// "userId" : userdata._id ,
// "tasktitle" : form.tasktitle ,
// "taskdescrp" : form.taskdescrp,
// "stratdate": stratdate,
// "taskenddate":taskenddate,
// "taskstarttime":taskstarttime,
// "taskendtime":taskendtime,
module.exports = mongoose.model("Tasks", notesSchema);