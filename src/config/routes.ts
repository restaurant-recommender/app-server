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
router.put('/api/users/:id/profile_weight', userController.updateProfileWeight)
router.post('/api/users', userController.create)
router.put('/api/users/:id', userController.update)
router.get('/api/users/has/:username', userController.hasUsername)

router.get('/api/restaurants/nearby', restaurnatController.getNearyBy)
router.get('/api/restaurants', restaurnatController.getAll)
router.get('/api/restaurants/search', restaurnatController.search)
router.post('/api/restaurants/forced', restaurnatController.forcedCreate)
router.post('/api/restaurants', restaurnatController.create)

router.get('/api/categories', categoryController.getAllCategories)
router.post('/api/categories', categoryController.createCategory)
router.put('/api/categories/:id', categoryController.update)
router.get('/api/categories/search', categoryController.searchCategories)

// router.post('/api/recommendations', recommendationController.requestRecommendation)
router.post('/api/recommendations/init', recommendationController.initRecommendation)
router.post('/api/recommendations/request', recommendationController.requestRecommendation)
// router.get('/api/recommendations/detailed/:id', recommendationController.getDetailedById)
// router.get('/api/recommendations/:id', recommendationController.getRecommendation)
// router.get('/api/recommendations', recommendationController.getAllRecommendations)

export default router