import { Request, Response } from 'express'
import { restaurantService } from '../services'
import { restaurantInterface } from '../models/restaurant.model'
import { getDuplicateRestaurant, getDetailedRestaurant } from '../utilities/restaurant'

export const restaurnatController = {
    getAll: async (req: Request, res: Response): Promise<void> => {
        restaurantService.getAll().then((result) => {
            res.json(result)
        }).catch((error) => {
            res.status(500).send(error)
        })
    },

    search: async (req: Request, res: Response): Promise<void> => {
        restaurantService.getByQuery(req.body).then((result) => {
            res.json(result)
        }).catch((error) => {
            res.status(500).send(error)
        })
    },

    forcedCreate: (req: Request, res: Response): void => {
        restaurantService.create(req.body).then((result) => {
            res.json(result)
        }).catch((error) => {
            res.status(500).send(error)
        })
    },

    getNearyBy: (req: Request, res: Response): void => {
        try {
            if (!req.query.lat || !req.query.lon) {
                throw('\"lat\" and \"lon\" are required as query params')
            }

            const latitude: number = parseFloat(String(req.query.lat))
            const longitude: number = parseFloat(String(req.query.lon))
            const distance: number = req.query.dist ? parseInt(String(req.query.dist)) : null
            const limit: number = req.query.limit ? parseInt(String(req.query.limit)) : null
            const skip: number = req.query.skip ? parseInt(String(req.query.skip)) : null

            restaurantService.getByDistance(latitude, longitude, distance, limit, skip).then((result) => {
                res.json(result)
            }).catch((error) => {
                throw(error)
            })
        } catch (error) {
            res.status(500).send(error)
        }
    },

    create: (req: Request, res: Response): void => {
        try {
            const newRestaurant: restaurantInterface = req.body
            getDuplicateRestaurant(newRestaurant).then((duplidatedRestaurant: restaurantInterface | void) => {
                let targetRestaurant: restaurantInterface = newRestaurant
                if (duplidatedRestaurant) {
                    targetRestaurant = getDetailedRestaurant(duplidatedRestaurant, newRestaurant)
                    if (targetRestaurant._id == duplidatedRestaurant._id) {
                        console.log('Found duplicate restaurant! Existing data has more information. Skip creating restaurant')
                        return res.json({
                            status: true,
                            message: `Restaurant already existed! new:(${newRestaurant.name}) existed:(${duplidatedRestaurant.name} [${duplidatedRestaurant._id}])`,
                            data: duplidatedRestaurant
                        })
                    } else {
                        console.log(`Found duplicate restaurant! New data has more information. Deleting (${duplidatedRestaurant._id})`)
                        restaurantService.deleteById(duplidatedRestaurant._id)
                    }
                }
                restaurantService.create(targetRestaurant).then((restaurant) => {
                    return res.json({
                        status: true,
                        message: duplidatedRestaurant ? `Removed 1 duplicated restaurant existed:(${duplidatedRestaurant.name} [${duplidatedRestaurant._id}])` : null,
                        data: restaurant
                    })
                }).catch((error) => {
                    throw(error)
                })
            }).catch((error) => {
                throw(error)
            })
        } catch (error) {
            res.status(500).send(error)
        }
    }
}
