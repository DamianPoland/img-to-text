import React from 'react'
import style from './AlertPrivacy.module.css'


/* 
komponent do pokazywania akceptacji privacy policy
w props musi się znaleść:
- click => kliknięcie powinno zapisać w localStorage że zostało udzielone pozwolenie
*/

const AlertPrivacy = ({ click }) => {
    return (
        <div className={style.container}>
            <div className={style.content}>
                <p className={style.text}>Ta strona korzysta z plików cookie oraz Google Analytics, aby dostarczyć nam (w pełni anonimowych) statystyk. Dane, które potrzebne są w fomularzu kontaktowym, używamy tylko i wyłącznie w celu skontaktowania się z Tobą. <a className={style.anchor} href='/privacy-policy'>Dowiedz się więcej</a> </p>
            </div>
            <button onClick={click} className={style.button}>Rozumiem</button>
        </div>
    )
}

export default AlertPrivacy
