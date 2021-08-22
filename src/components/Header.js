import React from 'react'
import logo from '../logo.png'

const Header = () =>{
    return <header className="header">
        <nav>
            <div className="logo">
                <img src = {logo} alt="LOGO"></img>
                <strong>todoist</strong>
            </div>
            
        </nav>
    </header>
}

export default Header;