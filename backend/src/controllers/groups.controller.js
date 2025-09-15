import Group from "../models/Group.js";
import User from "../models/User.js";

export async function createGroup(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Group name required" });

    const group = await Group.create({
      name: String(name).trim(),
      description: description || "",
      members: [req.user.id],
      inviteCode: Math.random().toString(36).substring(2, 8),
    });

    res.status(201).json(group);
  } catch (err) {
    next(err);
  }
}

export async function joinGroup(req, res, next) {
  try {
    const { inviteCode } = req.body;
    const group = await Group.findOne({ inviteCode });
    if (!group) return res.status(404).json({ error: "Group not found" });

    if (!group.members.map(String).includes(String(req.user.id))) {
      group.members.push(req.user.id);
      await group.save();
    }

    res.json(group);
  } catch (err) {
    next(err);
  }
}

export async function myGroups(req, res, next) {
  try {
    const groups = await Group.find({ members: req.user.id }).lean();
    res.json(groups);
  } catch (err) {
    next(err);
  }
}

export async function getGroup(req, res, next) {
  try {
    const group = await Group.findById(req.params.id)
      .populate("members", "name email")
      .lean();

    if (!group) return res.status(404).json({ error: "Group not found" });

    res.json({
      _id: group._id,
      name: group.name,
      description: group.description,
      inviteCode: group.inviteCode,
      members: group.members.map((m) => m._id),
      memberDetails: group.members,
    });
  } catch (err) {
    next(err);
  }
}
