import Spin from "../models/Spin.js";

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
