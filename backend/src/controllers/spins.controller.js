import { Group } from "../models/Group.js";
import { Spin } from "../models/Spin.js";
import { User } from "../models/User.js";

export async function spin(req, res) {
  const group = await Group.findById(req.params.id);
  if (!group) return res.status(404).json({ error: "Group not found" });
  const members = group.members.map(String);
  if (members.length === 0) return res.status(400).json({ error: "No members" });
  const idx = Math.floor(Math.random() * members.length);
  const selectedMember = members[idx];
  const rec = await Spin.create({ groupId: group._id, selectedMember, spinBy: req.user.id, date: new Date() });
  const user = await User.findById(selectedMember).select("_id name");
  res.json({ selectedMember: user });
}

export async function history(req, res) {
  const { id } = req.params;
  const list = await Spin.find({ groupId: id }).sort({ date: -1 }).limit(10).lean();
  const ids = new Set();
  list.forEach(x => { ids.add(String(x.selectedMember)); ids.add(String(x.spinBy)); });
  const users = await User.find({ _id: { $in: Array.from(ids) }}).select("_id name");
  const map = new Map(users.map(u => [String(u._id), u.name || "User"]));
  const out = list.map(s => ({ 
    ...s, 
    selectedMemberName: map.get(String(s.selectedMember)) || "User",
    spinByName: map.get(String(s.spinBy)) || "User"
  }));
  res.json(out);
}
