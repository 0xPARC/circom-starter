import React from 'react';
import logo from './logo.svg';
import './App.css';
// import Proposals from './components/Proposals';
// import { useAllProposals } from './wrappers/nounsDao';
import GeneratePoll from '../pages/generatepoll';
import Modal from './components/Modal/Modal';
// import Header from './components/Header/Header';
import { Polls } from './components/Polls';
import Post from './components/GeneratePoll/Post';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


function App() {
  // const { data: proposals } = useAllProposals();
  // const {address, isConnected} = useAccount()

  return (
    <div className="App">
    <header className="App-header">
      <Modal />
    </header>
    <div className="App-content">
      <Router>
        <Switch>
            <Route path="/" element={<Post/>}/>
            <Route path="/generatepoll" element={<GeneratePoll/>}/>
        </Switch>
      </Router>
    </div>
  </div>
  )
}

export default App;
