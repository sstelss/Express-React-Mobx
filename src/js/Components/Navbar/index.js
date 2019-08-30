import React from 'react'
import './index.css'

import Filterm from '../mobxStore'
import { observer } from 'mobx-react-lite'

import { Link } from "react-router-dom";

const Navbar = observer(function (props){

    const store = React.useContext(Filterm);

    const {funcChangeAmount, RegStatus} = props;

    const [FilterIsOpen, setFilterIsOpen] = React.useState(false);

    const listOfTypes = ["Normal", "Fire", "Fighting",
                         "Water", "Flying", "Grass",
                         "Poison", "Electric", "Ground",
                         "Psychic", "Rock", "Ice", "Bug",
                         "Dragon", "Ghost", "Dark", "Steel", "Fairy"];


    
    const typesCheckbox = listOfTypes.map((value, index) => {
        return(
            <div className="p-2 m-1 border text-white" key={index} >
                <input type="checkbox" value={value.toLowerCase()}  onClick={()=>{store.toggleType(value)}}/> {value} 
            </div>
        )
    })

    const autBtn = RegStatus ? <Link className="btn btn-outline-success mx-2 my-2 my-sm-0" to="/UserPanel" onClick={()=>{fetch("/logout")}}>Log out</Link> : <Link className="btn btn-outline-success mx-2 my-2 my-sm-0" to="/userPanel">Autorithation</Link>;

    const PPBtn = RegStatus ?  <Link className="btn btn-outline-success mx-2 my-2 my-sm-0"  to="/personalPage">Personal Page</Link> : undefined;
    return(
        <div className='navbar navbar-dark navbar-expand-sm bg-dark'>
           <a className='navbar-brand' href="#">
                    Pokedex
            </a>
            
    <div className="flex-column mx-auto">
        <ul className="navbar-nav">
                   
            <li className="nav-item">
                <a className="nav-link" href="#" onClick={() => funcChangeAmount(10)}>10</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="#" onClick={() => funcChangeAmount(20)}>20</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="#" onClick={() => funcChangeAmount(50)}>50</a>
            </li>
        </ul>

      

        <ul className="navbar-nav">
            <li className="nav-item">
                                        
                        
                <a className="btn btn-sm btn-outline-secondary" href="#" onClick={() => setFilterIsOpen(!FilterIsOpen)}>Filter panel:</a>

                <div className={FilterIsOpen ? 'navbar__searchPanel' : "noVisable"}>

                    <div className="id_name_container">
                        <div className="PokemonName">
                            <input type='text' id="pokemonName" value={store.name} onChange={store.toggleName}    placeholder='Print name or id'></input>
                        </div>

                    </div>
                                
                    <div className="mx-auto">
                        <div className="d-flex flex-wrap">
                            {typesCheckbox}
                        </div>
                    </div>
                </div>

                
            </li>               
        </ul>
    </div>

    {autBtn}
    {PPBtn}
    </div>
    );
}
)

export default Navbar;