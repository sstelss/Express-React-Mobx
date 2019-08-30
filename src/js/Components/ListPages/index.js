import React from 'react'
import './index.css'

export default function ListPages(props){
     const {amount, funcChange, currentPage, MaxIndex} = props;

     

     const maxIndex = MaxIndex;
     const diapasonStart = 1;
     const diapasonFinish = Math.ceil(maxIndex / amount);

     console.log("MaxIndex= ", maxIndex, "  diapasonFinish= ", diapasonFinish)

     if(currentPage > diapasonFinish){
        const f = ()=>{funcChange(diapasonFinish)};
        f();
     }
     console.log("diapasonFinish", diapasonFinish)
    const getDiapason = (start, finish, current) => {
        if (start === finish){
            return[start]
        }
        if (finish - start === 1){
            return[start, finish]
        }
        if (finish - start === 2){
            return[start, start+1, finish]
        }
        if (finish - start === 3){
            return[start, start+1, start+2, finish]
        }
        if(current === start){
            return [start, current+1, current+2, '...', finish]
        }
        if(current - start === 1){
            return [start, current, current+1, '...', finish]
        }
        if(current - start === 2){
            return [start, current-1, current, current+1, '...', finish]
        }
        if(finish === current){
            return [start, '...', current-2, current-1, finish]
        }
        if(finish - current === 1){
            return [start, '...', current-1, current, finish]
        }
        if(finish - current === 2){
            return [start, '...', current-1, current, current+1, finish]
        }
        return [start, '...', current-1, current, current+1, '...', finish]
    }
    const diapason = getDiapason(diapasonStart, diapasonFinish, currentPage)
    .map((value, index) =>{
    const mclass = (value === currentPage) ? "currentNumber ListPages__li" : "ListPages__li";
    const f = (value === '...') ? undefined : ()=>{funcChange(value); console.log("in funck  ", value)};
    return(
    <li key={index} className={mclass} onClick={f}>
        {value}
    </li>
    )}
        
    );

    return(
            <ul className='chooseList'>
                {diapason}
            </ul>

    )
}