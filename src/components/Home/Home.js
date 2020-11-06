import React, { useEffect, useState } from 'react'
import style from './Home.module.css'
import { storage } from '../../shared/fire'
import Question from '../../assets/question.png'
import axios from 'axios'
import Spinner from '../../UI/Spinner/Spinner'
import Alert from '../../UI/Alert/Alert'

//icons
import { ReactComponent as Upload } from '../../assets/upload.svg'
import { ReactComponent as Shuffle } from '../../assets/shuffle.svg'
import { ReactComponent as Copy } from '../../assets/copy.svg'

const Home = () => {

    const [image, setImage] = useState(null) // write image
    const [imageURL, setImageURL] = useState('') // write URL from DB
    const [progress, setProgress] = useState(0) // progress bar
    const [language, setLanguage] = useState('pol') // set language, pol is default
    const [showSpinner, setShowSpinner] = useState(false) // set spinner visibility
    const [showProgress, setShowProgress] = useState(false) // set progress visibility
    const [showAlert, setShowAlert] = useState(false) // set alert visibility
    const [showDecodedText, setShowDecodedText] = useState(false) // set alert visibility

    // get photo from file/camera
    const getPhoto = e => {
        setProgress(0) // set progress bar on 0
        setShowDecodedText(false) // hide decoded text
        setImageURL('') // reser img url
        setImage(e.target.files[0]) // add photo to state
    }

    // send photo to DB and get URL WHEN state image CHANGE (after get photo from file/camera)
    useEffect(() => {

        // if image is empty then return
        if (!image) {
            return
        }

        setShowProgress(true) // set progress bar visibile


        // // set photo name from date
        // const date = new Date();
        // const photoName = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();
        // console.log('date', photoName);

        // send photo to DB
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        uploadTask.on('state_changed',
            snapshot => { setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)) },//progress bar
            err => { //show if error
                console.log('upload error: ', err)
                setShowProgress(false) // set progress bar invisibile
            },
            () => {
                storage // get url
                    .ref('images')
                    .child(image.name)
                    .getDownloadURL() // get url
                    .then(url => {
                        setImageURL(url)
                        setShowProgress(false) // set progress bar invisibile
                    }) // write url in state
                    .catch(errStorage => {
                        console.log('storage errStorage', errStorage);
                        setShowProgress(false) // set progress bar invisibile
                    })
            })
    }, [image])

    // read url photo when finish writing - only for log
    useEffect(() => {
        console.log('useEffect url: ', imageURL)
    }, [imageURL])

    // read text from photo
    const handleReadText = () => {

        // show spinner
        setShowSpinner(true)

        //api key
        const apiKEY = '' //free api key from https://ocr.space/ (subscription stuidowww.com@gmail.com), limit: 500 calls/day, 25000 requests/month, max size 1MB

        // OCR URL - apiKEY(private API KEY from OCR)
        const imgURL = `https://api.ocr.space/parse/imageurl?apikey=${apiKEY}&url=${encodeURIComponent(imageURL)}&language=${language}&detectOrientation=true`

        // send request for read from photo
        axios.get(imgURL, { timeout: 20000 }) //set timeout because some times take to long to decode - add second parameter: , { timeout: 15000 }
            .then(res => {
                console.log('axios res: ', res)
                console.log('axios res TEXT: \n', res.data.ParsedResults[0].ParsedText)
                setShowSpinner(false) // hide spinner
                res.data.ParsedResults[0].ParsedText !== '' ? setShowDecodedText(res.data.ParsedResults[0].ParsedText) : setShowDecodedText('Brak tekstu') // set decoded text if not empty

            })
            .catch(err => {
                console.log('axios err:', err)
                setShowSpinner(false) // hide spinner
                setShowAlert('Nie udało się przeczytać tekstu. Spróbuj późnij.') // show alert error
            })
    }

    //copy decoded text to clipboard
    const copyDecodedText = () => {
        navigator.clipboard.writeText(showDecodedText) // topy text to clipboard
        console.log('skopiowano:\n', showDecodedText);
    }

    return (
        <section className={style.decoder}>
            <div className={style.decoder_container}>
                <h1 className={style.decoder_title}>Rozpoznawanie textu</h1>
                <h2 className={style.decoder_title2}>Darmowa usługa</h2>
                <p className={style.decoder_desc}>Skożystaj z darmowego narzędzia do rozponawania znaków. Serwis umożliwia konwersję w 24 językach.</p>
                <div className={style.decoder_content}>
                    <div className={style.decoder_contentInputContainer}>
                        <input
                            id='file'
                            className={style.decoder_contentInputInput}
                            type='file'
                            onChange={getPhoto}
                            accept='image/*' //'.jpg, .jpeg, .bmp, .svg, .png' w OCR Supported image file formats are png, jpg (jpeg), gif, tif (tiff) and bmp. 
                        />
                        <label htmlFor='file' className={`${style.decoder_contentInputLabel} ${style.btn}`}>
                            <div className={style.svg}>
                                <Upload />
                            </div>
                            Wybierz zdjęcie
                        </label>
                    </div>
                    <figure className={style.decoder_contentFigure}>
                        {showSpinner && <Spinner />}
                        {showProgress &&
                            <div className={style.decoder_contentProgressContainer}>
                                <progress className={style.decoder_contentProgress} value={progress} max='100' />
                            </div>}
                        {showAlert && <Alert alertName='Error' alertDetails={showAlert} click={() => setShowAlert(false)} />}
                        {showDecodedText &&
                            <div className={style.decoder_contentDecodedText}>
                                <div onClick={copyDecodedText} className={`${style.decoder_contentDecodedTextSVG} ${style.svg}`}>
                                    <Copy />
                                </div>
                                <p className={style.decoder_contentDecodedTextHint}>Rozpoznany tekst:</p>
                                <p className={style.decoder_contentDecodedTextDesc}>{showDecodedText}</p>
                            </div>}
                        <img className={style.decoder_contentImg} src={imageURL || Question} alt='img' />
                    </figure>
                    <select onChange={(e) => setLanguage(languageList.find(item => item.name === e.target.value).code)} className={`${style.decoder_contentSelect} ${style.btn}`}>
                        {languageList.map((item) => <option key={item.code} className={style.decoder_contentOption}>{item.name}</option>)}
                    </select>
                    <button className={`${style.decoder_contentButton} ${style.btn}`} onClick={handleReadText}>
                        <div className={style.svg}>
                            <Shuffle />
                        </div>
                        Konwertuj
                    </button>
                </div>
            </div>
        </section>
    )
}

export default Home



const languageList = [
    { name: 'polski', code: 'pol' },
    { name: 'angielski', code: 'ang' },
    { name: 'arabski', code: 'ara' },
    { name: 'bułgarski', code: 'bul' },
    { name: 'chiński upr', code: 'chs' },
    { name: 'chiński trad', code: 'cht' },
    { name: 'chorwacki', code: 'hrv' },
    { name: 'czeski', code: 'cze' },
    { name: 'duński', code: 'dan' },
    { name: 'fiński', code: 'fin' },
    { name: 'francuski', code: 'fre' },
    { name: 'grecki', code: 'gre' },
    { name: 'hiszpański', code: 'spa' },
    { name: 'holenderski', code: 'dut' },
    { name: 'japoński', code: 'jpn' },
    { name: 'koreański', code: 'kor' },
    { name: 'niemiecki', code: 'ger' },
    { name: 'portugalski', code: 'por' },
    { name: 'rosyjski', code: 'rus' },
    { name: 'słoweński', code: 'slv' },
    { name: 'szwedzki', code: 'swe' },
    { name: 'turecki', code: 'tur' },
    { name: 'węgierski', code: 'hun' },
    { name: 'włoski', code: 'ita' },
]