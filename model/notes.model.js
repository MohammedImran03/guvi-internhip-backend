const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

const notesSchema = new mongoose.Schema({
    userId:{
        type: String,
        default:null,
    },
    title:{
      type: String,
      default:null,
    },
  notes:{
    type: String,
    default:null,
  },
  link:{
    type: Array,
    default:null,
  },
  filesattached:{
    type: Array,
    default:null,
  },
 createdAt:{
  type: Date,
  default: Date.now(),
 },
 LastEdited:{
    type: Date,
    default: "",
   },
});


// //  Hash password
// userSchema.pre("save", async function (next){
//   if(!this.isModified("password")){
//     next();
//   }

//   this.password = await bcrypt.hash(this.password, 10);
// });

// // jwt token
// userSchema.methods.getJwtToken = function () {
//   return jwt.sign({ id: this._id}, process.env.JWT_SECRET_KEY,{
//     expiresIn: process.env.JWT_EXPIRES,
//   });
// };

// // compare password
// userSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

module.exports = mongoose.model("notes", notesSchema);