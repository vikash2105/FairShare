import Spin from "../models/Spin.js";
import Group from "../models/Group.js";

// List all spins for a group
export async function listSpins(req, res, next) {
  try {
    const { id } = req.params; // groupId
    const spins = await Spin.find({ groupId: id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(spins);
  } catch (err) {
    next(err);
  }
}

// Record a spin result provided by frontend
export async function spin(req, res, next) {
  try {
    const { id } = req.params; // groupId
    const { result } = req.body;
    if (!result) return res.status(400).json({ error: "Result required" });

    const spin = await Spin.create({
      groupId: id,
      result,
      createdBy: req.user.id,
    });

    res.status(201).json(spin);
  } catch (err) {
    next(err);
  }
}

// Randomize spin result on backend
export async function spinRandom(req, res, next) {
  try {
    const { id } = req.params; // groupId
    const group = await Group.findById(id).populate("members", "name email");
    if (!group) return res.status(404).json({ error: "Group not found" });

    const members = group.members;
    if (!members || members.length === 0) {
      return res.status(400).json({ error: "No members in group" });
    }

    // Pick a random member
    const randomMember = members[Math.floor(Math.random() * members.length)];

    const spin = await Spin.create({
      groupId: id,
      result: randomMember.name,
      createdBy: req.user.id,
    });

    res.status(201).json(spin);
  } catch (err) {
    next(err);
  }
}
