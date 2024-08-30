import express from 'express';
import {checkUnique, deleteUser, test, updateUser} from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);

router.post('/update/:id', verifyToken, updateUser)

router.delete('/delete/:id', verifyToken, deleteUser)

router.post('/check-unique', checkUnique)



export default router;