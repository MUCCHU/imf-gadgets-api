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

/**
 * @swagger
 * /gadgets:
 *   get:
 *     summary: Retrieve a list of all gadgets
 *     description: Fetch all gadgets from the inventory. Optionally, filter by status. Each gadget includes a randomly generated mission success probability.
 *     tags:
 *       - Gadgets
 *     security:
 *       - BearerAuth: []  # Uses the global authorization from the "Authorize" button
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Available, Deployed, Destroyed, Decommissioned]
 *         description: Filter gadgets by status.
 *     responses:
 *       200:
 *         description: A list of gadgets with mission success probabilities.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     example: "1ccfa09b-6d39-441c-ac3a-5b449d623a48"
 *                   name:
 *                     type: string
 *                     example: "Nightingale"
 *                   status:
 *                     type: string
 *                     enum: [Available, Deployed, Destroyed, Decommissioned]
 *                     example: "Available"
 *                   missionSuccessProbability:
 *                     type: string
 *                     example: "87%"
 *       400:
 *         description: Invalid status filter.
 *       401:
 *         description: Unauthorized (Missing or Invalid Token).
 *       500:
 *         description: Internal server error.
 */



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

/**
 * @swagger
 * /gadgets:
 *   post:
 *     summary: Add a new gadget to the inventory
 *     description: Creates a new gadget with a unique, randomly generated codename. The gadget is initially marked as "Available".
 *     tags:
 *       - Gadgets
 *     security:
 *       - BearerAuth: []  # Uses JWT authentication
 *     responses:
 *       201:
 *         description: Successfully created a new gadget.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "1ccfa09b-6d39-441c-ac3a-5b449d623a48"
 *                 name:
 *                   type: string
 *                   example: "The Kraken"
 *                 status:
 *                   type: string
 *                   enum: [Available, Deployed, Destroyed, Decommissioned]
 *                   example: "Available"
 *       401:
 *         description: Unauthorized (Missing or Invalid Token).
 *       500:
 *         description: Internal server error.
 */

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

/**
 * @swagger
 * /gadgets/{id}:
 *   patch:
 *     summary: Update an existing gadget
 *     description: Updates the details of a specific gadget. Decommissioned gadgets cannot be updated.
 *     tags:
 *       - Gadgets
 *     security:
 *       - BearerAuth: []  # Requires authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique ID of the gadget to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Night Stalker"
 *               status:
 *                 type: string
 *                 enum: [Available, Deployed, Destroyed, Decommissioned]
 *                 example: "Deployed"
 *     responses:
 *       200:
 *         description: Gadget successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "1ccfa09b-6d39-441c-ac3a-5b449d623a48"
 *                 name:
 *                   type: string
 *                   example: "Night Stalker"
 *                 status:
 *                   type: string
 *                   enum: [Available, Deployed, Destroyed, Decommissioned]
 *                   example: "Deployed"
 *       400:
 *         description: Gadget is decommissioned and cannot be updated.
 *       401:
 *         description: Unauthorized (Missing or Invalid Token).
 *       404:
 *         description: Gadget not found.
 *       500:
 *         description: Internal server error.
 */

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

/**
 * @swagger
 * /gadgets/{id}:
 *   delete:
 *     summary: Decommission a gadget
 *     description: Marks a gadget as "Decommissioned" instead of deleting it permanently.
 *     tags:
 *       - Gadgets
 *     security:
 *       - BearerAuth: []  # Requires authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique ID of the gadget to be decommissioned.
 *     responses:
 *       200:
 *         description: Gadget successfully decommissioned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Gadget decommissioned"
 *                 gadget:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "1ccfa09b-6d39-441c-ac3a-5b449d623a48"
 *                     name:
 *                       type: string
 *                       example: "Stealth Falcon"
 *                     status:
 *                       type: string
 *                       enum: [Available, Deployed, Destroyed, Decommissioned]
 *                       example: "Decommissioned"
 *                     decommissionedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-05T12:00:00.000Z"
 *       401:
 *         description: Unauthorized (Missing or Invalid Token).
 *       404:
 *         description: Gadget not found.
 *       500:
 *         description: Internal server error.
 */

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

/**
 * @swagger
 * /gadgets/{id}/self-destruct:
 *   post:
 *     summary: Trigger the self-destruct sequence for a gadget
 *     description: Marks the gadget as "Destroyed" and returns a randomly generated confirmation code.
 *     tags:
 *       - Gadgets
 *     security:
 *       - BearerAuth: []  # Requires authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique ID of the gadget to be self-destructed.
 *     responses:
 *       200:
 *         description: Self-destruct sequence initiated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Self-destruct sequence initiated"
 *                 confirmationCode:
 *                   type: integer
 *                   example: 5678
 *       401:
 *         description: Unauthorized (Missing or Invalid Token).
 *       404:
 *         description: Gadget not found.
 *       500:
 *         description: Internal server error.
 */

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
