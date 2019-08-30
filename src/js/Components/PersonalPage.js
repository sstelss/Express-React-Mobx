import React from 'react'

import { Redirect,Link  } from "react-router-dom";

import Card from './Card'

const Pokedex = require('pokeapi-js-wrapper');



const PersonalPage = (props) => {

    const P = new Pokedex.Pokedex();

    
    const [ListElements, setListElements] = React.useState([]);
    const [RegStatus, setRegStatus] = React.useState(false);
    const [LoveList, setLoveList] = React.useState([]);
    const [User, setUser] = React.useState('');

    React.useMemo ( () => {
        fetch('/currentUser')
        .then(response => response.json())
        .then(res => {
            if (res.status_text === 'OK'){
                setRegStatus(true);
                setUser(res.username)

                fetch('/belove/getList')
                .then(response => response.json())
                .then(res => {
                    console.log("I got PokeList: ", res.PokemonsList)
                    setLoveList([...res.PokemonsList])
                })
            }
        })
    }, [])


    React.useEffect(()=> {
        let mypromise = [];
        const list = [];

        // for(let i = mstart; i < finish && i < LoveList.length; i += 1) {
        for(let i = 0; i < LoveList.length; i += 1) {
            let temp = 0;
            mypromise.push(P.getPokemonByName(LoveList[i])
                .then(function(response) {
                let tempStats = [];
                response.types.map((value)=>tempStats.push(value.type.name))
                temp = {
                        "name": response.name,
                        "id": response.id,
                        "icon": response.sprites.front_default,
                        "stats": response.stats,
                        "type": tempStats,
                        "weight": response.weight,
                    };
                    list.push(temp);
                })
                .catch(function(error) {
                    console.log('There was an ERROR: ', error);
                }));
        }
        //if(mstart < 801)
        //it'll work out when all promises from arr mypromise done

        Promise.all(mypromise)
        .then((result) => {
                setListElements([...list])
        })
    }, [LoveList.length])

    const listCards =ListElements.length === 0 ? <h3>You do not have favorite pokemons!</h3> : ListElements.map((value, index) => 
        <Card value={value} RegStatus={RegStatus} LoveList={LoveList.slice()} key={index}/>
    );

    const fullVersion = (
        <div className="container">
            <div className="jumbotron">
                <h1>This is your personal page!</h1>
                <Link to='/'>To main page</Link>
            </div>
            <h2 className="mx-auto">List of your favorite pokemons:</h2>
            <div className="deksArea">
                {listCards}
            </div>
        </div>
    )
   
    return(
        <div>
            {fullVersion}
        </div>
    )   
}


export default PersonalPage;



       
    
