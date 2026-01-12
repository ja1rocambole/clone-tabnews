function status(req, res) {
  res.status(200).json({ status: "OK/KO" });
}

export default status;
