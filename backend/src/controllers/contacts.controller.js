import Contact from "../models/Contact.js";
import User from "../models/User.js";

export async function myContacts(req,res,next){
  try {
    const contacts = await Contact.find({ owner: req.user.id, status: "accepted" }).populate("friend","name email");
    res.json(contacts);
  } catch(e){ next(e); }
}

export async function inviteContact(req,res,next){
  try {
    const { email } = req.body;
    const friend = await User.findOne({ email });
    if (!friend) return res.status(404).json({ error: "User not found" });
    if (String(friend._id) === req.user.id) return res.status(400).json({ error: "Cannot add yourself" });
    const rel = await Contact.findOneAndUpdate(
      { owner: req.user.id, friend: friend._id },
      { $setOnInsert: { status: "pending" } },
      { upsert: true, new: true }
    );
    res.json(rel);
  } catch(e){ next(e); }
}

export async function acceptContact(req,res,next){
  try {
    const { ownerId } = req.body; // who invited me
    await Contact.findOneAndUpdate({ owner: ownerId, friend: req.user.id }, { status: "accepted" });
    await Contact.findOneAndUpdate(
      { owner: req.user.id, friend: ownerId },
      { $set: { status: "accepted" } },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch(e){ next(e); }
}
