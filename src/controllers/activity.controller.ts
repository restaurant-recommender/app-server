import Activity from '../models/activity.model'
import mongoose from 'mongoose'
import { Request, Response } from 'express'
import { getKeyByValue } from '../utilities/function'
import { ActivityEvent } from '../utilities/constant'

const getByQuery = (req: Request, res: Response) => {
    Activity.find(req.body).then((result) => {
        res.json(result)
    }).catch((error) => {
        res.status(500).send(error)
    })
}

const create = (req: Request, res: Response) => {
    if ('event_id' in req.body) {
        req.body.event_name = getKeyByValue(ActivityEvent, req.body.event_id)
    } else {
        throw new Error('Invalid event')
    }
    if ('user_id' in req.body) {
        req.body.user_id = mongoose.Types.ObjectId(req.body.user_id)
    }
    req.body.timestamp = Date.now()
    const newActivity = new Activity(req.body)
    newActivity.save().then((result) => {
        res.json(result)
    }).catch((error) => {
        res.status(500).send(error)
    })
}

export const activityController = {
    getByQuery,
    create,
}