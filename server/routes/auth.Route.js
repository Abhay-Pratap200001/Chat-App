import express from 'express'
import { login, logout, signup } from '../controllers/auth.Controller.js'

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)


export default  router


// apprince534_db_user
// yqrJByH7Iwj14XVP