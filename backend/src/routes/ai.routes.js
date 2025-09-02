router.post("/chat/:groupId", (req, res, next) => {
  req.body.groupId = req.params.groupId; // inject groupId
  chat(req, res, next);
});
