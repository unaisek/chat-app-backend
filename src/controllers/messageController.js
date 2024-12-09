import Message from "../models/messageModel.js";

export const getMessages = async (req, res, next) => {
  try {
    const user1 = req.userId;
    const user2  = req.body.id
    if (!user1 || !user2) {
      return res.status(400).send("both user id are required");
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2},
        { sender: user2, recipient: user1 },
      ],
    }).sort({timestap: 1});

    return res.status(200).json({ messages });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server Error");
  }
};
