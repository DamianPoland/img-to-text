import React, { useEffect } from 'react'
import style from './About.module.css'
import { languageList } from '../../shared/data'

//background video
import backgroundVideo from '../../assets/backgroundVideo.mp4'

//icons
import { ReactComponent as Info } from '../../assets/info.svg'
import { ReactComponent as Requirements } from '../../assets/requirements.svg'
import { ReactComponent as Languages } from '../../assets/languages.svg'
import { ReactComponent as Developer } from '../../assets/developer.svg'

const About = () => {

    // scroll to top when open tab
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <section className={style.background}>
            <video className={style.backgroundVideo} src={backgroundVideo} autoPlay muted loop type="video/mp4" alt="background Video" />
            <div className={style.container}>
                <div className={style.service}>

                    <div className={style.service_container}>

                        <h1 className={style.service_title}>O serwisie</h1>

                        <div className={style.service_infoContainer}>
                            <div className={style.service_infoTitle}>
                                <div className={style.service_infoSvg}>
                                    <Info />
                                </div>
                                <h2 className={style.service_infoHeader}>Podstawowe informacje:</h2>
                            </div>
                            <p className={style.service_infoDesc}>Portal text-ze-zdjecia.web.app jest w pełni bezpłatną usługą OCR <i>(ang. optical character recognition)</i>, która umożliwia konwersję zdjęć oraz plików pdf aby rozpoznać zawarty na nich tekst. Nie ma potrzeby rejestracji lub instalowania aplikacji na urządzeniu. Całe zadanie jest wykonywane w przeglądarce.Konwerter rozpoznaje wszystkie znaki. Jest w stanie poprawnie odczytać tekst w 24 językach. </p>
                        </div>

                        <div className={style.service_infoContainer}>
                            <div className={style.service_infoTitle}>
                                <div data-aos="fade-right" className={style.service_infoSvg}>
                                    <Requirements />
                                </div>
                                <h2 className={style.service_infoHeader}>Wymagania:</h2>
                            </div>
                            <p data-aos="fade-up-left" className={style.service_infoDesc}>Pliki poddawane konwersji nie mogą być większe niż 1 MB. Akceptowane formaty plików to: pdf, png, jpg, gif, tif, bmp. Każdy może podadć konwersji maxymalnie 50 plików dziennie. Aby popawić jakość odczytywania zdjęcia postaraj się umieścić zdjęcie z tekstem umieszczonym poziomo oraz w miarę możliwości usuń nieptrzebne elementy takie jak obrazki lub tabele.  </p>
                        </div>

                        <div className={style.service_infoContainer}>
                            <div className={style.service_infoTitle}>
                                <div data-aos="fade-right" className={style.service_infoSvg}>
                                    <Languages />
                                </div>
                                <h2 className={style.service_infoHeader}>Obsługiwane języki:</h2>
                            </div>
                            <ul data-aos="fade-up-left" className={style.service_infoDescList}>
                                {languageList.map(item => {
                                    return (
                                        <li key={item.name}>{item.name}</li>
                                    )
                                })}
                            </ul>
                        </div>

                        <div className={style.service_infoContainer}>
                            <div className={style.service_infoTitle}>
                                <div data-aos="fade-right" className={style.service_infoSvg}>
                                    <Developer />
                                </div>
                                <h2 className={style.service_infoHeader}>Wykonanie:</h2>
                            </div>
                            <p data-aos="fade-up-left" className={style.service_infoDesc}>Właścicielem portalu jest <strong>studio-www.com</strong>. Aby skontaktować się z deweloperem znajdź dane kontaktowe w polityce prywatności lub skorzsystaj z linku w stopce niniejszej strony.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About

