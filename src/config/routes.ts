import { TransitRoutingPreference } from '@googlemaps/google-maps-services-js'
import express from 'express'
import { 
    userController, 
    restaurnatController, 
    categoryController,
    reportController,
    recommendationController, 
    authenticationController, 
    favoriteController
} from '../controllers'
import { auth } from '../utilities/authentication'

const router = express.Router()

router.get('/api/_hc', (_, res) => {
    res.status(200).json({
        message: 'ok'
    })
})

router.get('/api/history', recommendationController.getHistory)

router.post('/api/auth/login', authenticationController.login)
router.post('/api/auth/register', authenticationController.register)

router.post('/api/users/:id/preferences', userController.updatePreferences)
router.get('/api/users/:id/preferences', userController.getPreferences)
router.get('/api/users/:userid/favorites', favoriteController.getUserFavorite)
router.get('/api/users/:userid/favorites/add/:restaurantid', favoriteController.addUserFavorite)
router.get('/api/users/:userid/favorites/remove/:restaurantid', favoriteController.removeUserFavorite)
router.get('/api/users/:userid/favorites/check/:restaurantid', favoriteController.hasRestaurant)

router.get('/api/categories/common', categoryController.getCommonCategories)

router.get('/api/recommendations/:id', recommendationController.getById)
router.post('/api/recommendations/init', recommendationController.initialize)
router.get('/api/recommendations/:id/request', recommendationController.request)
router.get('/api/recommendations/:id/final', recommendationController.getFinal)
router.post('/api/recommendations/:id/history', recommendationController.updateHistories)
router.post('/api/recommendations/:id/complete', recommendationController.complete)
router.post('/api/recommendations/:id/members/:userid/rate', recommendationController.updateRating)
router.post('/api/recommendations/:id/members/:userid/price', recommendationController.updateMemberPreferPrice)
router.post('/api/recommendations/:id/members/:userid/rank', recommendationController.updateMemberRestaurantRank)
router.post('/api/recommendations/:id', recommendationController.update)

router.post('/api/group/:pin/join', recommendationController.joinGroup)

// Common --------------------------------------------

router.get('/api/users', userController.getAllUsers)
router.get('/api/users/:id', userController.getUser)
router.put('/api/users/:id/profile_weight', userController.updateProfileWeight)
router.post('/api/users', userController.create)
router.put('/api/users/:id', userController.update)
router.get('/api/users/has/:username', userController.hasUsername)

router.get('/api/restaurants/nearby', restaurnatController.getNearyBy)
router.get('/api/restaurants', restaurnatController.getAll)
router.get('/api/restaurants/search', restaurnatController.search)
router.post('/api/restaurants/search', restaurnatController.search)
router.post('/api/restaurants/forced', restaurnatController.forcedCreate)
router.post('/api/restaurants', restaurnatController.create)
router.put('/api/restaurants/:id', restaurnatController.update)

router.get('/api/categories', categoryController.getAllCategories)
router.post('/api/categories', categoryController.createCategory)
router.put('/api/categories/:id', categoryController.update)
router.get('/api/categories/search', categoryController.searchCategories)

router.post('/api/v0/recommendations/init', recommendationController.initRecommendation)
router.post('/api/v0/recommendations/request', recommendationController.requestRecommendation)

router.get('/api/reports', reportController.getByQuery)
router.post('/api/reports', reportController.create)

router.get('/api/favorites', favoriteController.getAll)
router.post('/api/favorites', favoriteController.create)

export default router