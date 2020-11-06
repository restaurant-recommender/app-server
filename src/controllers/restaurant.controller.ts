import { Request, Response } from 'express'
import { restaurantService } from '../services'

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

            restaurantService.getByDistance(req.body, latitude, longitude, distance, limit, skip).then((result) => {
                res.json(result)
            }).catch((error) => {
                throw(error)
            })
        } catch (error) {
            res.status(500).send(error)
        }
    },

    create: (req: Request, res: Response): void => {
        restaurantService.createWithValidation(req.body).then((restaurant) => {
            res.json(restaurant)
        }).catch((error) => { 
            console.log(error)
            res.status(500).send(error) 
        })
    },

    update: (req: Request, res: Response): void => {
        console.log(req.body)
        restaurantService.update(req.params.id, req.body).then((restaurant) => {
            res.json(restaurant)
        }).catch((error) => { 
            console.log(error)
            res.status(500).send(error)
        })
    },
}
