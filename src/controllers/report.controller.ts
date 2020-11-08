import Report from '../models/report.model'
import mongoose from 'mongoose'
import { Request, Response } from 'express'

const getByQuery = (req: Request, res: Response) => {
    if ('restaurant' in req.body) {
        req.body.restaurant = mongoose.Types.ObjectId(req.body.restaurant)
    }
    Report.find(req.body).populate({
        path: 'restaurant',
        model: 'restaurants'
    }).then((result) => {
        res.json(result)
    }).catch((error) => {
        res.status(500).send(error)
    })
}

const create = (req: Request, res: Response) => {
    if ('restaurant' in req.body) {
        req.body.restaurant = mongoose.Types.ObjectId(req.body.restaurant)
    }
    const newReport = new Report(req.body)
    newReport.save().then((result) => {
        res.json(result)
    }).catch((error) => {
        res.status(500).send(error)
    })
}

export const reportController = {
    getByQuery,
    create,
}