import Spin from "../models/Spin.js";
import Group from "../models/Group.js";

// GET /spins/:groupId
export async function listSpins(req, res, next) {
  try {
    const { groupId } = req.params;
    const spins = await Spin.find({ groupId })
      .sort({ date: -1 })
      .populate("selectedMember", "name email")
      .populate("spinBy", "name email")
      .lean();

    // normalize for frontend
    const data = spins.map((s) => ({
      _id: s._id,
      date: s.date,
      result: s.selectedMember?.name || "Unknown",
      spinBy: s.spinBy ? { name: s.spinBy.name, email: s.spinBy.email } : null,
    }));

    res.json(data);
  } catch (err) {
    next(err);
  }
}

// POST /spins/:groupId/random
export async function spinRandom(req, res, next) {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate("members", "name email");
    if (!group) return res.status(404).json({ error: "Group not found" });

    const members = group.members || [];
    if (!members.length) return res.status(400).json({ error: "No members to spin" });

    const selectedMember = members[Math.floor(Math.random() * members.length)];

    const spin = await Spin.create({
      groupId,
      selectedMember: selectedMember._id,
      spinBy: req.user.id,
      date: new Date(),
    });

    res.status(201).json({
      _id: spin._id,
      date: spin.date,
      result: selectedMember.name,
      spinBy: null, // you can refetch to populate if needed
    });
  } catch (err) {
    next(err);
  }
}
