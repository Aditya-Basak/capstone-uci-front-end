import './App.css';
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Event from './components/Event'
import PastEvent from './components/PastEvent'
import CreateEvent from './components/CreateEvent'
import EditEvent from './components/EditEvent'
import EditUser from './components/EditUser'

import { BrowserRouter, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path="/" component={Login} exact />
          <Route path="/register" component={Register} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/event" component={Event} />
          <Route path="/pastEvent" component={PastEvent} />
          <Route path="/createEvent" component={CreateEvent} />
          <Route path="/editEvent" component={EditEvent} />
          <Route path="/editUser" component={EditUser} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
