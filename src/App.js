import './App.css';
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Event from './components/Event'
import PastEvent from './components/PastEvent'
import CreateEvent from './components/CreateEvent'
import EditEvent from './components/EditEvent'
import UserProfile from './components/UserProfile'
import Search from './components/Search'

import { BrowserRouter, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path="/" component={Login} exact />
          <Route path="/register" component={Register} />
          <Route path="/dashboard/:userId" component={Dashboard} />
          <Route path="/event/:userId/:eventId" component={Event} />
          <Route path="/pastEvent/:userId/:eventId" component={PastEvent} />
          <Route path="/createEvent/:userId" component={CreateEvent} />
          <Route path="/editEvent/:userId/:eventId" component={EditEvent} />
          <Route path="/userProfile/:userId/:seeUserId?/:showEdit" component={UserProfile} />
          <Route path="/search/:userId/:eventName?/:location?/:eventType?/:date?" component={Search} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
