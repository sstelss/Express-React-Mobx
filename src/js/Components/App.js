import React from 'react';
import './App.css';
import MainPage from './MainPage';


import UserPanel from './UserPanel'
import 'bootstrap/dist/css/bootstrap.css'; 
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PersonalPage from './PersonalPage';

// import Filter from './mobxStore'
// import { observer } from 'mobx-react-lite'


const App = () => {

   return (
     <Router>
        <div className="App">

          <Route path="/" exact component={MainPage} />
          <Route path="/userPanel" component={UserPanel} />
          <Route path="/personalPage" component={PersonalPage} />
{/* 
          <Route path="/" exact render={() => <MainPage RegStatus={RegStatus}/>} />
          <Route path="/userPanel" component={UserPanel}/>
          <Route path="/personalPage"  render={() => RegStatus ? <PersonalPage/> : <MainPage/>}/> */}

          

        </div>
      </Router>
    )
  
}

export default App;
