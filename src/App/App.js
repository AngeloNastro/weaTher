import { useEffect, useState } from "react"
import { Day } from '../Day/Day'
import { Progressbar } from '../Progressbar/Progressbar'
import '../styles/style.css'

//Useful functions (can be moved in a different component (not in the App since will be defined every time component is called))
let convertTime = (dateToConvert, now = undefined) =>{
    let date;
    if(now){
      date = new Date();
    }else{
      date = new Date(dateToConvert);
    }
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    return hours + ':' + minutes.substr(-2)
}

let convertDate = (dateToConvert) =>{
    let date = new Date(dateToConvert*1000);
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
}

//COMPONENT (can be splitted in different components but since the app is simple I just divided in three App, Day element and Progress bar)
export const App = () => {

    const Location = 'London';
    const Units = 'metric';
    const ApiKey = '63c0bbd221caec3f8cc9a08404781c83'; //ICLOUD
    const refreshingTimer = 1000; //every second: 1000ms
  
    const [currentWeatherInfo, setCurrentWeatherInfo] = useState();
    const [forecastWeatherInfo, setForecastWeatherInfo] = useState();
    const [timer, setTimer] = useState(60);

    //ONE MINUTE TIMER
    const updateTimer = (time) =>{
        if(time <= 1){
        fetchDataCurrent()
        fetchDataForecast()
        return 60
        }else{
        return time-1
        }
    }

    useEffect(() => {
        const timerP = setTimeout(() => {
          setTimer(updateTimer(timer));
        }, refreshingTimer);
        return () => clearTimeout(timerP);
    });
    
    useEffect(() => {
      fetchDataCurrent()
      fetchDataForecast()
    }, [])
  
    //Current weather
    const fetchDataCurrent = () => {
      fetch(`http://api.openweathermap.org/data/2.5/weather?q=${Location}&units=${Units}&appid=${ApiKey}`)
      .then(res => res.json())
      // .then(data => console.log(`data`, data))
      .then(data => setCurrentWeatherInfo(()=>{
        return {
          temp: parseInt(data.main.temp),
          type: data.weather[0].main,
          description: data.weather[0].description,
          iconID: data.weather[0].icon,
          timeDetection: convertTime(data.dt*1000), //Not sure if the task need the time of detection of the Temperature 
          timeCurrent: convertTime(null, true) //or is a simple clock (used optional parameter to use tha same function and not create a new date inside the component)
        }
      }));
    }

    //Forecasts (5 days)
    const fetchDataForecast = () => {
        fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${Location}&units=${Units}&appid=${ApiKey}`)
        .then(res => res.json())
        // .then(data => console.log(`forecast data`, data))
        .then(data => {
        let daySelected = data.list
        .filter((elem, index)=>{
            return index % 8 === 0
        })
        .map((elem)=>{
            return {
            temp: parseInt(elem.main.temp),
            type: elem.weather[0].main,
            description: elem.weather[0].description,
            iconID: elem.weather[0].icon,
            day: convertDate(elem.dt)
            }
        })
        setForecastWeatherInfo(daySelected)
        });
    }
     
    return (
        <div className='App flexVertical noselect'>
          <div className='Header flexVertical'>
            <div className='HeaderInfo flexHorizontal'>
              <div className='HeaderInfoCity'>{Location.toUpperCase() || 'CITY'}</div>
              <div className='HeaderInfoClock'>&bull;&bull;&bull;  {(currentWeatherInfo?.timeCurrent) ? `${currentWeatherInfo.timeCurrent} GMT` : `TIME GMT`}  &bull;&bull;&bull;</div>
              <div className='HeaderInfoTemperature'>{currentWeatherInfo ? `${currentWeatherInfo.temp}°` : 'Temperature'}</div>
            </div>
            <div className='HeaderBar flexVertical justifyCenter'>
              <div className='HeaderBarProgress'><Progressbar></Progressbar></div>
            </div>
          </div>
          <div className='MainView flexVertical'>
              {!!forecastWeatherInfo && forecastWeatherInfo.map((i, index)=>(
                <div key={index}>
                  <Day temp={i.temp} type={i.type} description={i.description} iconID={i.iconID} day={i.day}></Day>
                </div>
              ))}
          </div>
          <div className='Footer'>Created by Angelo Nastro</div>
        </div>
    );
}