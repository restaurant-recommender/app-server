import express from 'express'
import { 
    userController, 
    restaurnatController, 
    categoryController, 
    recommendationController, 
    authenticationController 
} from '../controllers'

const router = express.Router()

router.get('/api/_hc', (_, res) => {
    res.status(200).json({
        message: 'ok'
    })
})

router.post('/api/auth', authenticationController.login)

router.get('/api/users', userController.getAllUsers)
router.get('/api/users/:id', userController.getUser)
router.post('/api/users', userController.createUser)
router.get('/api/users/has/:username', userController.hasUsername)

router.get('/api/restaurants', restaurnatController.getAllRestaurants)
router.get('/api/restaurants/:id', restaurnatController.getAllRestaurants)
router.post('/api/restaurants', restaurnatController.createRestaurant)

router.get('/api/categories', categoryController.getAllCategories)
router.post('/api/categories', categoryController.createCategory)
router.put('/api/categories/:id', categoryController.update)
router.get('/api/categories/search', categoryController.searchCategories)

router.post('/api/recommendations', recommendationController.requestRecommendation)
router.get('/api/recommendations/:id', recommendationController.getRecommendation)
router.get('/api/recommendations', recommendationController.getAllRecommendations)

export default router