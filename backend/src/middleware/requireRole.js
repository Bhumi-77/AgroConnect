export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user?.role) return res.status(401).json({ ok: false, message: "Unauthorized" });
    if (req.user.role !== role) return res.status(403).json({ ok: false, message: "Forbidden" });
    next();
  };
}
