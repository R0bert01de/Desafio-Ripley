import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import { BrowserRouter as Router, Route } from "react-router-dom";
// import Home from "./components/home.component";
import './App.css';
import axios from 'axios';

class City extends React.Component {
 
    // Use the render function to return JSX component
    render() {
        return (
            <div className="ciudades-info">
            <h3> {this.props.ciudad}</h3>
            <ul>
                <li>Hora: {this.props.hora}</li>
                <li>Temperatura: {this.props.temp}ºC</li>
            </ul>
            </div>
        );
    }
  }   
  class App extends React.Component {
    constructor(props) {
        super(props);   
        this.state = {
          cities: [{
                Hora: null,
                Temperatura: null
            },{
                Hora: null,
                Temperatura: null
            },{
                Hora: null,
                Temperatura: null
            },{
                Hora: null,
                Temperatura: null
            },{
                Hora: null,
                Temperatura: null
            },{
                Hora: null,
                Temperatura: null
            }],
        };
      }
    componentDidMount() {
        this.interval = setInterval(() => 
        axios.get('http://my-lb-177089552.us-east-2.elb.amazonaws.com:4000/')
            .then(response => {
                if(response.data.status!='failed'){
                    console.log("se realiza solicitud");
                    console.log(response.data);
                    const cities = response.data;
                    this.setState({
                        ...this.state, ...{
                        cities
                        }
                    });
                }else{
                    console.log('Ocurrio un fallo');
                }
            })
            .catch(function (error){
                console.log(error);
            })
            , 10000);      
    }  
    // Use the render function to return JSX component
    render() {
        const { cities } = this.state;
        return (
        // <Router>  
            <div class="container">
                <div class="row">
                    <div class="col">
                        <div class="card">
                            <City ciudad='Santiago' hora={cities[0].Hora} temp={cities[0].Temperatura} />
                        </div>
                        <div class="card">
                            <City ciudad='Zurich' hora={cities[1].Hora} temp={cities[1].Temperatura} />
                        </div>
                        <div class="card">
                            <City ciudad='Auckland' hora={cities[2].Hora} temp={cities[2].Temperatura} />
                        </div>
                    </div>    
                </div>
                <div class="row">
                    <div class="col">
                        <div class="card">
                            <City ciudad='Sydney' hora={cities[3].Hora} temp={cities[3].Temperatura} />
                        </div>
                        <div class="card">
                            <City ciudad='Londres' hora={cities[4].Hora} temp={cities[4].Temperatura} />
                        </div>
                        <div class="card">
                            <City ciudad='Georgia' hora={cities[5].Hora} temp={cities[5].Temperatura} />
                        </div>
                    </div>    
                </div>
            </div>
        //     <Route path="/" except component={Home} />
        // </Router>
        );
      }
  }
export default App;
