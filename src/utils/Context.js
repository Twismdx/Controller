import React, { useContext, useState, useEffect } from 'react'


const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [superleague, setSuperleague] = useState({}) // 33
  const [vegasleague, setVegasleague] = useState({}) // 122
  const [league, setLeague] = useState()
  const [view, setView] = useState('default')
  const [id, setId] = useState()
  const [t1, setT1] = useState({
    compid: null,
    matchid: null
  });
  const [t2, setT2] = useState({
    compid: null,
    matchid: null
  });
  const [cancel1, setCancel1] = useState(false)
  const [cancel2, setCancel2] = useState(false)
  const [live, setLive] = useState([
    { id: 1, live: false },
    { id: 2, live: false }
  ])
  const fonts = {
    semiBold: 'Assets/OpenSan-Semibold.ttf#Open Sans Semibold',
    codec: 'Assets/Codec-Cold-ExtraBold-trial.ttf#Codec Cold Trial ExtraBold'
  }

  return (
    <AppContext.Provider
      value={{
        vegasleague,
        setVegasleague,
        superleague,
        setSuperleague,
        view,
        setView,
        id,
        setId,
        live,
        setLive,
        league,
        setLeague,
        fonts,
        cancel1,
        setCancel1,
        cancel2,
        setCancel2,
        t1,
        setT1,
        t2,
        setT2,
      }}>
      {children}
    </AppContext.Provider>
  )

}
const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppProvider, useGlobalContext }
