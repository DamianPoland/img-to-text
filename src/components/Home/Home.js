import React, { useEffect, useState } from 'react'
import style from './Home.module.css'
import { storage, functions } from '../../shared/fire'
import { DAILY_COUNT, DAILY_COUNT_DATE } from '../../shared/constans'
import { languageList } from '../../shared/data'


// UI
import Spinner from '../../UI/Spinner/Spinner'
import Alert from '../../UI/Alert/Alert'
import AlertSmall from '../../UI/AlertSmall/AlertSmall'


// imgs 
import Question from '../../assets/question.png'
import Background from '../../assets/background.png'
import Look from '../../assets/look.png'


//icons
import { ReactComponent as Shuffle } from '../../assets/shuffle.svg'
import { ReactComponent as Copy } from '../../assets/copy.svg'
import { ReactComponent as Camera } from '../../assets/camera.svg'
import { ReactComponent as DownArrow } from '../../assets/downArrow.svg'
import { ReactComponent as Language } from '../../assets/language.svg'
import { ReactComponent as TwentyFour } from '../../assets/twentyFour.svg'
import { ReactComponent as Engineer } from '../../assets/engineer.svg'
import { ReactComponent as Key } from '../../assets/key.svg'
import { ReactComponent as Ssl } from '../../assets/ssl.svg'


const Home = () => {

    // scroll to top when open tab
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const [image, setImage] = useState(null) // write image
    const [imageURL, setImageURL] = useState('') // write URL from DB
    const [progress, setProgress] = useState(0) // progress bar
    const [language, setLanguage] = useState('pol') // set language, pol is default
    const [showSpinner, setShowSpinner] = useState(false) // set spinner visibility
    const [showProgress, setShowProgress] = useState(false) // set progress visibility
    const [showAlert, setShowAlert] = useState(false) // set alert visibility
    const [showDecodedText, setShowDecodedText] = useState(false) // set alert visibility
    const [showAlertSmall, setShowAlertSmall] = useState(false) // set alert visibility:  'Skopiowano', 'Najpierw dodaj zdjęcie', 'Plik jest za duży'

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

        // check image size, if more than 1MB then show alert and return
        if (image.size >= 1048576) {
            setShowAlertSmall({ name: 'Plik jest za duży. Max. to 1 MB.', icon: 'info', borderColor: 'orange', animationTime: '3' })
            return
        }


        // check if is new day then start new limit
        const date = new Date();
        const lastWrittenDay = parseInt(localStorage.getItem(DAILY_COUNT_DATE))
        if (lastWrittenDay !== date.getDate()) {
            localStorage.removeItem(DAILY_COUNT)
        }
        localStorage.setItem(DAILY_COUNT_DATE, date.getDate())

        // check if is not more than 50 times to use one day
        if (parseInt(localStorage.getItem(DAILY_COUNT)) >= 50) {
            console.log('%cmore than 50', 'color: orange');
            setShowAlertSmall({ name: 'Przekroczono dzienny limit 50 zdjęć.', icon: 'error', borderColor: 'red', animationTime: '4' })
            return
        }
        localStorage.getItem(DAILY_COUNT) ? localStorage.setItem(DAILY_COUNT, parseInt(localStorage.getItem(DAILY_COUNT)) + 1) : localStorage.setItem(DAILY_COUNT, 1)

        // set progress bar visibile
        setShowProgress(true)

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

    // read text from photo
    const handleReadText = () => {

        if (imageURL === '') {
            setShowAlertSmall({ name: 'Najpierw dodaj zdjęcie', icon: 'info', borderColor: 'orange', animationTime: '2' })
            return
        }

        // show spinner
        setShowSpinner(true)

        // send request to backend for read from photo
        const photoConverter = functions.httpsCallable('photoConverter')
        console.log('imageURL: ', imageURL);
        console.log('language: ', language);
        photoConverter({ imageURL: imageURL, language: language }) // in {} is request

            .then(res => {
                setShowSpinner(false) // hide spinner
                res.data.ParsedResults[0].ParsedText !== '' ? setShowDecodedText(res.data.ParsedResults[0].ParsedText) : setShowDecodedText('Brak tekstu') // set decoded text if not empty
            })

            .catch(err => {
                console.log(`%cPhotoConverter error from backend:\n${err}: `, 'color: red; font-weight: bold');
                setShowSpinner(false) // hide spinner
                setShowAlert('Nie udało się przeczytać tekstu. Spróbuj późnij.') // show alert error
            })
    }

    //copy decoded text to clipboard
    const copyDecodedText = () => {
        navigator.clipboard.writeText(showDecodedText) // topy text to clipboard
        setShowAlertSmall({ name: 'Skopiowano', icon: 'OK', borderColor: 'green', animationTime: '2' }) // set alert 'Skopiowano'
    }

    return (
        <section>

            {/* section decoder  */}
            <div className={style.decoder}>

                {/* alert 'Skopiowano', 'Najpierw dodaj zdjęcie', 'Plik jest za duży' */}
                {showAlertSmall && <AlertSmall hide={() => setShowAlertSmall(false)} description={showAlertSmall.name} alertIcon={showAlertSmall.icon} borderColor={showAlertSmall.borderColor} animationTime={showAlertSmall.animationTime} />}

                <div className={style.decoder_container}>
                    <h1 className={style.decoder_title}>Rozpoznawanie tekstu</h1>
                    <h2 className={style.decoder_title2}>Darmowa usługa</h2>
                    <p className={style.decoder_desc}>Skożystaj z narzędzia do rozponawania znaków. Serwis umożliwia konwersję w 24 językach.</p>

                    <div className={style.decoder_content}>

                        {/* brutton 'wybierz zdjęcie' */}
                        <div className={style.decoder_contentInputContainer}>
                            <input
                                id='file'
                                className={style.decoder_contentInputInput}
                                type='file'
                                onChange={getPhoto}
                                accept='image/*, .pdf' //image/* = .jpg, .jpeg, .bmp, .svg, .png, w OCR Supported image file formats are: pdf, png, jpg, gif, tif and bmp. 
                            />
                            <label htmlFor='file' className={`${style.decoder_contentInputLabel} ${style.btn}`}>
                                <div className={style.svg}>
                                    <DownArrow />
                                </div>
                            Wybierz zdjęcie
                        </label>
                        </div>

                        {/* photo container */}
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
                            <img className={style.decoder_contentImgQuestion} src={Background} alt='img background ' />
                            <img className={style.decoder_contentImg} src={imageURL || Question} alt='Brak podglądu zdjęcia.' />
                        </figure>

                        {/* choose language */}
                        <select onChange={(e) => setLanguage(languageList.find(item => item.name === e.target.value).code)} className={`${style.decoder_contentSelect} ${style.btn}`}>
                            {languageList.map((item) => <option key={item.code} className={style.decoder_contentOption}>{item.name}</option>)}
                        </select>

                        {/* buton 'konwertuj' */}
                        <button className={`${style.decoder_contentButton} ${style.btn}`} onClick={handleReadText}>
                            <div className={style.svg}>
                                <Shuffle />
                            </div>
                        Konwertuj
                    </button>

                    </div>
                </div>
            </div>

            {/* section description */}
            <div className={style.description_background}>
                <div className={style.description_content}>
                    <h1 className={style.header}>Zasada działania:</h1>
                    <div className={style.description_container}>

                        <div data-aos="flip-left" className={style.description_containerItem}>
                            <div className={style.description_containerItemSVG}>
                                <Camera />
                            </div>
                            <p className={style.description_containerItemDesc}><b>Przygotuj zdjęcie</b> tekstu do rozpoznania. Akceptowane formaty to: pdf, png, jpg, gif, tif, bmp. Maksymalna wielkość pliku to 1MB.</p>
                        </div>

                        <div data-aos="flip-left" className={style.description_containerItem}>
                            <div className={style.description_containerItemSVG}>
                                <DownArrow />
                            </div>
                            <p className={style.description_containerItemDesc}><b>Kliknij "Wybierz zdjęcie"</b>. Umożliwia wybranie zdjęcia z dysku. Po wybraniu, zdjęcie załaduje się automatycznie.</p>
                        </div>

                        <div data-aos="flip-left" className={style.description_containerItem}>
                            <div className={style.description_containerItemSVG}>
                                <Language />
                            </div>
                            <p className={style.description_containerItemDesc}><b>Wybierz język</b> tekstu na zdjęciu. Jeśli tego nie zrobisz program automatycznie użyje języka polskiego.</p>
                        </div>

                        <div data-aos="flip-left" className={style.description_containerItem}>
                            <div className={style.description_containerItemSVG}>
                                <Shuffle />
                            </div>
                            <p className={style.description_containerItemDesc}><b>Kliknij "Konwertuj"</b>. Czas przetwarzania zdjęcia może się róznić. Zwykle jest to kilka sekund ale czasem może trwac nawet 1 minutę.</p>
                        </div>
                    </div>
                </div>

            </div>



            {/* section advantages */}
            <div className={style.advantages_background}>
                <div className={style.advantages_content}>

                    <figure className={style.advantages_figure}>
                        <img className={style.advantages_img} src={Look} alt='look' />
                    </figure>

                    <div className={style.advantages_desc}>
                        <h1 className={style.header}>Co zyskujesz?</h1>
                        <div className={style.advantages_container}>

                            <div className={style.advantages_containerItem}>
                                <div data-aos="zoom-in" className={style.advantages_containerItemSVG}>
                                    <Key />
                                </div>
                                <p className={style.advantages_containerItemDesc}>Szybki i wygodny dotęp.</p>
                            </div>

                            <div className={style.advantages_containerItem}>
                                <div data-aos="zoom-in" className={style.advantages_containerItemSVG}>
                                    <TwentyFour />
                                </div>
                                <p className={style.advantages_containerItemDesc}>Konwerter obsługujący 24 języki.</p>
                            </div>

                            <div className={style.advantages_containerItem}>
                                <div data-aos="zoom-in" className={style.advantages_containerItemSVG}>
                                    <Engineer />
                                </div>
                                <p className={style.advantages_containerItemDesc}>Bardzo dokładny silnik OCR.</p>
                            </div>

                            <div className={style.advantages_containerItem}>
                                <div data-aos="zoom-in" className={style.advantages_containerItemSVG}>
                                    <Ssl />
                                </div>
                                <p className={style.advantages_containerItemDesc}>Ochrona danych dzięki protokołowi SSL.</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Home

