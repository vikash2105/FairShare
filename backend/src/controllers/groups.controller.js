import Group from "../models/Group.js";
import User from "../models/User.js";
import crypto from "crypto";

export async function createGroup(req,res,next){
  try {
    const { name, description } = req.body;
    const inviteCode = crypto.randomBytes(3).toString("hex").toUpperCase();
    const group = await Group.create({ name, description, inviteCode, owner: req.user.id, members: [req.user.id] });
    const populated = await group.populate("members", "name email");
    res.status(201).json(populated);
  } catch(e){ next(e); }
}

export async function myGroups(req,res,next){
  try {
    const groups = await Group.find({ members: req.user.id }).populate("members", "name email");
    res.json(groups);
  } catch(e){ next(e); }
}

export async function getGroup(req,res,next){
  try {
    const g = await Group.findById(req.params.id).populate("members", "name email");
    if (!g) return res.status(404).json({ error: "Group not found" });
    res.json({
      _id: g._id,
      name: g.name,
      description: g.description,
      inviteCode: g.inviteCode,
      memberDetails: g.members.map(m=>({ _id: m._id, name: m.name, email: m.email }))
    });
  } catch(e){ next(e); }
}

export async function joinGroup(req,res,next){
  try {
    const { inviteCode } = req.body;
    const g = await Group.findOne({ inviteCode });
    if (!g) return res.status(404).json({ error: "Invalid invite code" });
    if (!g.members.find(m=> String(m)===req.user.id))
      g.members.push(req.user.id);
    await g.save();
    const populated = await Group.findById(g._id).populate("members", "name email");
    res.json(populated);
  } catch(e){ next(e); }
}
