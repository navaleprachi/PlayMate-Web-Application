import express from "express";

import * as arenaController from '../controllers/arena-controller.js';

const router = express.Router();

// Route to fetch the sports arenas with sport and city as the path params
router.route('/:sport/:city')
    .get(arenaController.findArenas);

export default router;