import React from 'react'
import style from './Footer.module.css'
import logo from '../../assets/logoStudioWWW.png'



const Footer = () => {
    return (
        <div className={style.background}>
            <div className={style.container}>
                <a href='/privacy-policy' className={`${style.text} ${style.link}`}>Polityka prywatności</a>
                <p className={style.text}>Copyright © 2020</p>
                <a href='https://studio-www.com' target='blank' className={style.designedBy}>
                    <span className={`${style.text} ${style.textLeft}`}>Designed by</span>
                    <img className={style.logo} src={logo} alt='logo' />
                    <span className={`${style.text} ${style.textRight}`}>studio-www</span>
                </a>
            </div>
        </div>
    )
}

export default Footer