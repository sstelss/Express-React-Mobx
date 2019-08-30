import React from 'react';

import fullStar from '../../img/Star_full.jpg';
import emptyStar from '../../img/Star.jpg';


export default function Card(props){

    const {value, RegStatus, LoveList} = props;

    const st_star = React.useRef();

    st_star.current = (LoveList.indexOf(String(value.id)) !== -1) ? true : false;


    const [ShowStats, setShowStats] = React.useState(false);
    const [Star, setStar] = React.useState(st_star)

    const giveMeTable = (value, flag) =>{
        if(flag){
           return( <table className="stats"  border="1">
                {value.stats.map((value, index) => 
                    <tbody key={index}>
                        <tr> 
                        <td>{value.stat.name}</td>
                        <td>{value.base_stat}</td>
                        </tr>
                    </tbody>
                )}
            </table>
           )
        }
        return undefined;
    }

    const handleStar = () =>{

        setStar({current: !Star.current})

      
        fetch('/belove/add/'+value.id)
        .then(response => response.json())
        .then(res => {
            if (res.status_text === 'OK'){
                console.log("I in fetch('/belove/add'), All is good. Massage: ", res.text)
            }
        })

    }

    return(
        <div className="card" key={value.id}> 

            <div className="card-body">
                <div className="d-flex justify-content-between">
                    <span className="font-weight-bold">ID: {value.id}</span>
                    
                    <img
                     src={Star.current ? fullStar : emptyStar}
                     alt="star"
                     style= {RegStatus ? {width: "35px", height: "35px"} : {display:"none"}} 
                     onClick={handleStar}
                    ></img>
                </div>

                <div className="d-flex justify-content-center">
                   <h5 className="font-weight-bold "> {value.name} </h5>
                </div>

                <img className="card-img-top" alt='pokemon_card' src={value.icon} style={{width: "180px", height: "180px"}}/>
                
                <div className="d-flex flex-wrap">
                    {value.type.map((value,index)=>
                                <img
                                        src={require('../../img/Types/'+value+'.png')}
                                        alt={value}
                                        style= {{width: "35px", height: "35px"}} 
                                        title={value}
                                        key={index}
                                ></img>)
                    }
                </div>

                <p className="weight">Weight: {value.weight}</p>
                <button className="btn btn-primary" onClick={()=>setShowStats(ShowStats?false:true)}> {ShowStats?"Close stats":"Open stats"} </button>
            </div>
            {giveMeTable(value, ShowStats)}
        </div>
       
    )
}