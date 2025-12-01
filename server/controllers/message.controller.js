import { ApiError } from "../lib/ApiError.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceverSocketId, io } from "../lib/socket.js";


// ------------------ Get All Users Except Logged-In User ------------------
export const getUsersForSidebar = async (req, res, next) => {
  try {
    // Logged-in user's ID is available through auth middleware
    const loggedInUserId = req.user._id;

    // Fetch all users except the logged-in user
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password"); // Do not send password

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar:", error.message);
    return next(new ApiError(500, "Internal Server Error"));
  }
};




// ------------------ Get Chat Messages Between Two Users ------------------
export const getMessages = async (req, res, next) => {
  try {
    // User we want to chat with - getting id from URL params
    const { id: userToChat } = req.params;

    // Logged-in user's ID
    const myId = req.user._id;

    // Find all messages where the two users are either sender or receiver
    const messages = await Message.find({
      $or: [
        { senderId: myId, recevierId: userToChat },
        { senderId: userToChat, recevierId: myId }
      ]
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages:", error.message);
    return next(new ApiError(500, "Internal Server Error"));
  }
};





// ------------------ Send a Message ------------------
export const sendMessage = async (req, res, next) => {
  try {
    const { text, image } = req.body; 
    console.log(req.body);
    
    const { id: recevierId } = req.params; // The person receiving the message
    console.log(req.params);
    
    const senderId = req.user._id; // Logged-in user
    let imageUrl;

    // If message contains an image, upload it to Cloudinary
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url; // Get Cloudinary image URL
    }

    // Create a new message document
    const newMessage = new Message({
      senderId,
      recevierId,
      text,
      image: imageUrl,
    });

    // Save message in MongoDB
    await newMessage.save();

    const recevierSocketId = getReceverSocketId(recevierId)
    if (recevierSocketId){
      io.to(recevierSocketId).emit("newMessage", newMessage)
    } 

    
    res.status(200).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage:", error.message);
    return next(new ApiError(500, "Internal Server Error"));
  }
};


