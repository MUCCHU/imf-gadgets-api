const express = require('express');
const { Gadget } = require('../models');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const authenticateToken = require("../middleware/auth");

const CODENAMES = [
  "The Nightingale",
  "The Kraken",
  "Phantom Shadow",
  "Iron Falcon",
  "Ghost Whisperer",
  "Cyber Panther",
  "Silent Viper",
  "Storm Breaker",
  "Black Hawk",
  "Omega Phantom"
];

const getUniqueCodename = async () => {
  let availableCodenames = [...CODENAMES];

  while (availableCodenames.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableCodenames.length);
    const codename = availableCodenames[randomIndex];

    // Check if codename exists in the database
    const existingGadget = await Gadget.findOne({ where: { name: codename } });

    if (!existingGadget) {
      return codename; // Found a unique name
    }
    if(existingGadget.status === "Destroyed") {
      return codename; // Found a unique name
    }

    // Remove used codename from list
    availableCodenames.splice(randomIndex, 1);
  }

  // If all predefined codenames are used, generate a random one
  return `Codename-${uuidv4().slice(0, 8)}`;
};
// GET: List all gadgets with a random mission success probability
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {status} = req.query;
    const whereCondition = status ? {status} : {};
    // console.log(whereCondition);
    const gadgets = await Gadget.findAll({ where: whereCondition });
    const gadgetsWithProbability = gadgets.map((gadget) => ({
      ...gadget.toJSON(),
      missionSuccessProbability: `${Math.floor(Math.random() * 100)}%`,
    }));
    res.json(gadgetsWithProbability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Add a new gadget
router.post('/',authenticateToken, async (req, res) => {
  try {
    const codename = await getUniqueCodename();
    const newGadget = await Gadget.create({
      id: uuidv4(),
      name: codename,
      status: "Available",
    });
    res.status(201).json(newGadget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH: Update a gadget
router.patch('/:id',authenticateToken, async (req, res) => {
  try {
    const gadget = await Gadget.findByPk(req.params.id);
    if (!gadget) return res.status(404).json({ error: "Gadget not found" });
    if(gadget.status === "Decommissioned") return res.status(400).json({ error: "Gadget is decommissioned" });
    await gadget.update(req.body);
    res.json(gadget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Mark a gadget as decommissioned
router.delete('/:id',authenticateToken, async (req, res) => {
  try {
    const gadget = await Gadget.findByPk(req.params.id);
    if (!gadget) return res.status(404).json({ error: "Gadget not found" });

    await gadget.update({ status: "Decommissioned", decommissionedAt: new Date() });
    res.json({ message: "Gadget decommissioned", gadget });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Self-destruct sequence
router.post('/:id/self-destruct',authenticateToken, async (req, res) => {
  try {
    const gadget = await Gadget.findByPk(req.params.id);
    if (!gadget) return res.status(404).json({ error: "Gadget not found" });

    const confirmationCode = Math.floor(1000 + Math.random() * 9000);
    await gadget.update({ status: "Destroyed" });

    res.json({ message: "Self-destruct sequence initiated", confirmationCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
