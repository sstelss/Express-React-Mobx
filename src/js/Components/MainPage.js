import React from 'react';
import Navbar from './Navbar';
import CardList from './CardList';
import ListPages from './ListPages';
import Footer from './Footer';

const MainPage = () => {

  const [RegStatus, setRegStatus] = React.useState(false);

  React.useMemo(() =>{
    fetch('/currentUser')
    .then(response => response.json())
    .then(res => {
        if (res.status_text === 'OK'){
            setRegStatus(true);
        }
      }
    )
  })

  console.log("I'm in MainPage.js. RegStatus= ", RegStatus)

  const [Amount, setAmount] = React.useState(10);
  const [CurrentPage, setCurrentPage] = React.useState(1);
  const [MaxIndex, setMaxIndex] = React.useState(800)

  // const [pers, setPers] = React.useState(false);

  const changeAmount = (amount) => setAmount(() => amount)
  const changePage = (number) => {setCurrentPage(()=>number)}
  const changeMaxIndex = (number) => {setMaxIndex(()=>number)} 

   return (
        <div className="App">
          <Navbar funcChangeAmount={changeAmount} RegStatus={RegStatus}/>
          <CardList amount={Amount} currentPage={CurrentPage} funcMaxIndex={changeMaxIndex} RegStatus={RegStatus}/>
          <ListPages funcChange={changePage} currentPage={CurrentPage} amount={Amount} MaxIndex={MaxIndex} />
          <Footer />

        </div>
    )
}

export default MainPage;




