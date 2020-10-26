import express from "express"
import { userController, getAllUsers, getUser, createUser, interact } from "../controllers/userController"
import { getAllRestaurants, createRestaurant } from "../controllers/restaurantController"
import { categoryController, getAllCategories, createCategory, searchCategories } from "../controllers/categoryController"
import { requestRecommendation, getAllRecommendations, getRecommendation } from "../controllers/recommendationController"

import { authenticationController } from '../controllers/authenticationController'

const router = express.Router()

router.get("/api/_hc", (_, res) => {
    res.status(200).json({
        message: "ok"
    })
})

router.post('/api/auth', authenticationController.login)

router.get("/api/users", getAllUsers)
router.get("/api/users/:id", getUser)
router.post("/api/users", createUser)
router.post("/api/users/:id/interact", interact)
router.get("/api/users/has/:username", userController.hasUsername)

router.get("/api/users", getAllUsers)
router.get("/api/users/:id", getUser)
router.post("/api/users", createUser)
router.post("/api/users/:id/interact", interact)

router.get("/api/restaurants", getAllRestaurants)
router.get("/api/restaurants/:id", getAllRestaurants)
router.post("/api/restaurants", createRestaurant)

router.get("/api/categories", getAllCategories)
router.post("/api/categories", createCategory)
router.put("/api/categories/:id", categoryController.update)
router.get("/api/categories/search", searchCategories)

router.post("/api/recommendations", requestRecommendation)
router.get("/api/recommendations/:id", getRecommendation)
router.get("/api/recommendations", getAllRecommendations)

export default router