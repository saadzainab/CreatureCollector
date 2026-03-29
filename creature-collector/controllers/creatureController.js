const Creature = require('../models/Creature');

// Helper: get userId from session OR JWT cookie (demonstrates both auth methods)
const jwt = require('jsonwebtoken');

function getUserId(req) {
  // 1️⃣  Try session first (stateful)
  if (req.session && req.session.userId) {
    return req.session.userId;
  }
  // 2️⃣  Fall back to JWT in cookie (stateless)
  const token = req.cookies && req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.userId;
    } catch {
      return null;
    }
  }
  return null;
}

// ─── GET /creatures ───────────────────────────────────────────────────────────
exports.getCreatures = async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Not logged in' });

  try {
    const creatures = await Creature.find({ owner: userId }).sort({ createdAt: -1 });
    res.json(creatures);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch creatures' });
  }
};

// ─── POST /creatures ──────────────────────────────────────────────────────────
exports.addCreature = async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Not logged in' });

  const { name, power } = req.body;
  if (!name) return res.status(400).json({ error: 'Creature name is required' });

  try {
    const newCreature = new Creature({ name, power, owner: userId });
    await newCreature.save();
    res.status(201).json(newCreature);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add creature' });
  }
};

// ─── DELETE /creatures/:id ────────────────────────────────────────────────────
exports.deleteCreature = async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Not logged in' });

  try {
    // findOneAndDelete ensures the user can only delete THEIR OWN creatures
    const creature = await Creature.findOneAndDelete({
      _id: req.params.id,
      owner: userId,
    });

    if (!creature) {
      return res.status(404).json({ error: 'Creature not found or not yours' });
    }

    res.json({ message: 'Creature deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete creature' });
  }
};
