import express from "express"
import { getAllUser, getUser, createUser, interact } from "../controllers/userController"
import { getAllRestaurant, createRestaurant } from "../controllers/restaurantController"

const router = express.Router()

router.get("/api/_hc", (_, res) => {
    res.status(200).json({
        message: "ok"
    })
})

router.get("/api/users", getAllUser)
router.get("/api/users/:id", getUser)
router.post("/api/users", createUser)
router.post("/api/users/:id/interact", interact)

router.get("/api/users", getAllUser)
router.get("/api/users/:id", getUser)
router.post("/api/users", createUser)
router.post("/api/users/:id/interact", interact)

router.get("/api/restaurants", getAllRestaurant)
router.get("/api/restaurants/:id", getAllRestaurant)
router.post("/api/restaurants", createRestaurant)

export default router