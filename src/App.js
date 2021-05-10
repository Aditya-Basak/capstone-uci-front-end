import './App.css';
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import EditEvent from './components/EditEvent'
import { BrowserRouter, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path="/" component={Login} exact />
          <Route path="/register" component={Register} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/editEvent" component={EditEvent} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
