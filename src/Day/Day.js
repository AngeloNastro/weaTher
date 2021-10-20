export const Day = ({temp, type, description, iconID, day}) => {
    return(
        <div className='MainViewDay flexHorizontal'>
            
            <div className='DayDate'>{day.toUpperCase() || 'DAY'}</div>
            {/* <div className='DayType'>Type: {type}</div> */}
            <div className='DayTemp'>{`${temp}°` || 'Temperature'}</div>
            <div className='DayIcon flexVertical alignEnd'>
                <img className='DayIconSrc noGhost' src={`http://openweathermap.org/img/wn/${iconID}.png`} alt={description}></img>
                <div className='DayDescription'>{description.toUpperCase() || 'description'}</div>
            </div>
        </div>
    );
}