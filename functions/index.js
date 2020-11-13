const functions = require('firebase-functions');
const axios = require('axios');
require('dotenv').config()

// function photoConverter
exports.photoConverter = functions.https.onCall((data, context) => { //data=dane wysłane z frontu, context=kto wysłał zapytanie np context.auth.uid

    //request data:
    const reqImageURL = data.imageURL
    const reqLanguage = data.language
    functions.logger.log('reqImageURL: ', reqImageURL, 'reqLanguage: ', reqLanguage)

    // free api key
    const apiKEY = process.env.API_KEY //free api key, limit: 500 calls/day/IP, 25000 requests/month, max size 1 MB

    // OCR URL
    const imgURL = `https://api.ocr.space/parse/imageurl?apikey=${apiKEY}&url=${encodeURIComponent(reqImageURL)}&language=${reqLanguage}&detectOrientation=true`

    // send request for read from photo
    return axios.get(imgURL, { timeout: 60000 }) //set timeout because some times take to long to decode - add second parameter: , { timeout: 60000 }
        .then(res => {
            functions.logger.log('axios res: ', res.data)
            return res.data //response
        })
        .catch(err => {
            functions.logger.log('axios err:', err)
            throw new functions.https.HttpsError('aborted', err) //throw error
        })
})



