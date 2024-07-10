import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useGlobalContext } from '../utils/Context';
import { database } from '../firebaseConfig';
import { ref, set, remove } from 'firebase/database';

const RadioCard = ({
  compname,
  home,
  away,
  liveStatus,
  matchid,
  compid,
  tid,
  reset,
  homename,
  awayname,
  homescore,
  rounds,
  awayscore,
  onClose
}) => {
  const { live, setLive, setId, id, fonts, setT1, setT2 } = useGlobalContext();

  const handleClick = () => {
    console.log(id)
    if (id === 1 || id === '1') {
      setT1(prevState => ({ 
        ...prevState,
        compid: compid,
        matchid: matchid
      }))
      onClose()
    } else if (id === 2 || id === '2') {
      setT2(prevState => ({ 
        ...prevState,
        compid: compid,
        matchid: matchid
      }))
      onClose()
    }
  };

  const styles = {
    cardContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: 10,
      padding: 1,
      margin: 10,
      cursor: 'pointer',
      transition: 'transform 0.2s',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    contentContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    title1: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    vsContainer: {
      display: 'flex',
      alignItems: 'center',
      margin: '10px 0',
    },
    divider: {
      height: 1,
      backgroundColor: '#ccc',
      flex: 1,
      margin: '0 10px',
    },
    description: {
      fontSize: 16,
      color: '#999',
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
  };

  return (
    <div style={styles.cardContainer} onClick={handleClick}>
      <div style={styles.contentContainer}>
        <div style={styles.title1}>{home}</div>
        <div style={styles.vsContainer}>
          <div style={styles.divider} />
          <div style={styles.description}>vs</div>
          <div style={styles.divider} />
        </div>
        <div style={styles.title}>{away}</div>
      </div>
    </div>
  );
};

export default RadioCard;
