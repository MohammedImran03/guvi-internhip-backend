const express = require("express");
const Notes = require("../model/notes.model");
const router = express.Router();
// const ErrorHandler = require("../utils/Errorhandler");
const sendMail =require("../utils/mailsender");
const catchAsyncErrors=require("../middleware/AsyncErrors");
const sendToken=require("../utils/sendjwttoken");
const {isAuthenticated} = require("../middleware/authentication.js");

//Post notes
router.post("/create-notes",catchAsyncErrors(async (req, res, next) => {
    try {
        // const { _id } = req.params;
        // const senderid = req.userId;
        const { title,userId,
      notes,
      link,
      filesattached} = req.body;
      const newnote={ userId,
        title,
        notes,
        link,
        filesattached};
        const result = await Createnewnote(newnote);
        if (result._id) {
            res.status(200).json({
                success: true,
                message: "New note Created Successfully.",
              });
        }else{
          return res.status(400).json({
            success: false,
          message: "Unable to create new notes try later.",
        });
        }
        // return next(new ErrorHandler("Unable to create new notes try later.", 400));
      }catch (error) {
        res.status(500).json({ success:false,message: error.message });
      }
  })
);

const Createnewnote = (newnote) => {
        return new Promise((resolve, reject) => {
            try {
                Notes(newnote)
                .save()
                .then((data) => resolve(data))
                .catch((error) => reject(error));
            } catch (error) {
              reject(error);
            }
          });
     
  };

// Get all Notes for a specific user
router.get("/user-notes/:id", async (req, res) => {
  try {
    // const {userId} = req.body;
    const { id } = req.params;
    console.log(id);
    const result = await getNotes(id);
    return  res.status(200).json({
      success: true,
      result
    });
  } catch (error) {
    // res.json({ status: "error", message: error.message });
    res.json({ status: 500 , success:false , message: error.message });
  }
});

const getNotes = (id) => {
  console.log(id);
  return new Promise((resolve, reject) => {
    try {
      Notes.find({ userId :id})
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

// update notes
 router.put("/update-notes/:_id",async (req, res) => {
  try {
    const { _id } = req.params;
    // const senderid = req.userId;
    const  {
      title,
      notes,
      link,
      filesattached} = req.body;
      const LastEdited = Date.now();
    const result = await updateClientReply( {
      _id, 
      title,
      notes,
      link,
      filesattached,
      LastEdited 
    });
    if (result._id) {
      return res.json({
        status: "success",
        message: "your Notes are updated Successfully",
      });
    }
    res.json({
      status: "error",
      message: "Unable to update your notes please try again later",
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});


const updateClientReply = ({
  _id,
  title, 
  notes,
  link,
  filesattached,
  LastEdited
}) => {
  return new Promise((resolve, reject) => {
    try {
      Notes.findOneAndUpdate(
        { _id },
        {
          title : title,
          notes : notes,
          link : link,
          filesattached:filesattached,
          LastEdited:LastEdited
        },
        { new: true }
      )
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

// Get users specific Notes
router.get("/get_notes/:_id",async (req, res) => {
  try {
    const { _id } = req.params;
    // const {userId} = req.body;
    const { userid } = req.headers;
    // console.log(userId,req.headers);
    const result = await getTicketById(_id, userid);
    if(result.length==1){
      return res.status(200).json({
        success : true,
        message : "User Notes Fetched",
        result,
      });
    }
    return res.status(400).json({
      success : false,
      message : "User Notes Not Found",
    });
  } catch (error) {
    res.json({ status: 404, success : false, message: error.message });
  }
});

const getTicketById = (_id, userid) => {
  return new Promise((resolve, reject) => {
    try {
      Notes.find({ _id, userId : userid })
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};


router.post("/deleteproduct/:_id", async function (req, res, next) {
  try {
    const {_id} = req.params;
    await Notes.findOneAndDelete({ _id});
    return res.status(200).json({
      success : true,
      message : "Note Deleted Successfuly",
    });
    // res.send("Product Deleted Successfuly");
  } catch (error) {
    return res.status(400).json({message:error.message,success:false});
  }
});

module.exports = router;