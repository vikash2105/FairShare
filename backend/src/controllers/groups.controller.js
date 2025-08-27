import { Group } from "../models/Group.js";
import { User } from "../models/User.js";
import { Balance } from "../models/Balance.js";
import { generateInviteCode } from "../utils/invite.js";

export async function createGroup(req, res) {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });
  let inviteCode;
  while (true) {
    inviteCode = generateInviteCode();
    const exist = await Group.findOne({ inviteCode });
    if (!exist) break;
  }
  const group = await Group.create({
    name, description, inviteCode, createdBy: req.user.id, members: [req.user.id]
  });
  // initialize balance for creator
  await Balance.updateOne({ groupId: group._id, userId: req.user.id }, { $setOnInsert: { balance: 0 } }, { upsert: true });
  res.json(group);
}

export async function joinGroup(req, res) {
  const { inviteCode } = req.body;
  const group = await Group.findOne({ inviteCode });
  if (!group) return res.status(404).json({ error: "Invalid code" });
  const already = group.members.find(m => String(m) === String(req.user.id));
  if (already) return res.status(400).json({ error: "Already a member" });
  group.members.push(req.user.id);
  await group.save();
  await Balance.updateOne({ groupId: group._id, userId: req.user.id }, { $setOnInsert: { balance: 0 } }, { upsert: true });
  res.json({ ok: true });
}

export async function myGroups(req, res) {
  const groups = await Group.find({ members: req.user.id }).select("_id name description inviteCode members createdAt");
  res.json(groups);
}

export async function getGroup(req, res) {
  const group = await Group.findById(req.params.id).populate("members", "_id name email");
  if (!group) return res.status(404).json({ error: "Not found" });
  const memberDetails = group.members.map(m => ({ _id: m._id, name: m.name, email: m.email }));
  res.json({
    _id: group._id,
    name: group.name,
    description: group.description,
    inviteCode: group.inviteCode,
    members: group.members.map(m=>m._id),
    memberDetails
  });
});
  const memberDetails = group.members.map(m => ({ _id: m._id, name: m.name, email: m.email }));
  res.json({ _id: group._id, name: group.name, description: group.description, inviteCode: group.inviteCode, members: group.members.map(m=>m._id), memberDetails });
}
