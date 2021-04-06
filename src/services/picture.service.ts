import { ICategory } from "../models/category.model";
import { IRestaurant } from "../models/restaurant.model";

const defaultPicture: any = {
    "Thai": [
        'https://storage.googleapis.com/resrec-img/defaults/thai1.jpeg',
    ],
    "Japanese": [
        'https://storage.googleapis.com/resrec-img/defaults/japanese1.jpg',
    ],
    "Chinese" : [
        'https://storage.googleapis.com/resrec-img/defaults/chinese1.jpg',
    ],
    "Korean" : [
        'https://storage.googleapis.com/resrec-img/defaults/korean1.jpeg',
    ],
    "Italian" : [
        'https://storage.googleapis.com/resrec-img/defaults/italian1.jpeg',
    ],
    "Fast Food" : [
        'https://storage.googleapis.com/resrec-img/defaults/fastfood1.jpeg',
    ],
    "Buffet" : [
        'https://storage.googleapis.com/resrec-img/defaults/buffet1.jpeg',
    ],
    "Seafood" : [
        'https://storage.googleapis.com/resrec-img/defaults/seafood1.jpeg',
    ],
    "Noodle" : [
        'https://storage.googleapis.com/resrec-img/defaults/noodle1.jpeg',
    ],
    "Steakhouse" : [
        'https://storage.googleapis.com/resrec-img/defaults/steak1.jpeg',
    ],
    "Shabu Shabu" : [
        'https://storage.googleapis.com/resrec-img/defaults/shabu1.jpeg',
    ],
    "default": [
        'https://storage.googleapis.com/resrec-img/defaults/default1.jpeg',
    ],
}

const getPictureUrl = (restaurant: IRestaurant) => {
    console.log(restaurant.cover_url)
    return restaurant.cover_url
    // if (restaurant.cover_url) {
    //     return restaurant.cover_url
    // } else {
    //     let defaultPictureUrl: string = defaultPicture.default[0]
    //     for (let i = 0; i < restaurant.profile.categories.length; i++) {
    //         const categoryName = (restaurant.profile.categories[i] as ICategory).name_en
    //         if (categoryName in defaultPicture) {
    //             defaultPictureUrl = defaultPicture[categoryName][0]
    //             break
    //         }
    //     }
    //     return defaultPictureUrl
    // }
}

export const pictureService = {
    getPictureUrl,
}