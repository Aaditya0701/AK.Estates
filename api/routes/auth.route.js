import express from 'express';
import { google, signin, signup } from '../controllers/auth.controller.js';

const router = express.Router();

//signup route
router.post('/signup', signup);

//sognin route
router.post('/signin', signin);

//google OAuth signin route
router.post('/google', google)

export default router;