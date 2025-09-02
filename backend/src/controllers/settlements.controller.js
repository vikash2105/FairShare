import Settlement from "../models/Settlement.js";

export async function addSettlement(req,res,next){
  try {
    const { groupId, from, to, amount, method="other", note } = req.body;
    const st = await Settlement.create({ groupId, from, to, amount, method, note, createdBy: req.user.id });
    res.status(201).json(st);
  } catch(e){ next(e); }
}

export async function listSettlements(req,res,next){
  try {
    const { groupId } = req.params;
    const list = await Settlement.find({ groupId }).populate("from to", "name");
    res.json(list);
  } catch(e){ next(e); }
}
