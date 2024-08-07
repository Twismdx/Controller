import React, { useEffect, useState, useRef } from 'react';
import { useGlobalContext } from '../utils/Context';
import axios from 'axios';
import { database } from '../firebaseConfig';
import { ref, remove, onValue, off, set } from 'firebase/database';
import LiveText from '../utils/LiveText';

const Table1 = ({ imageUrl, rotation, openModal, onClose }) => {
    const { live, setLive, t1, setT1, t2, setT2 } = useGlobalContext();
    const [showLive, setShowLive] = useState(false);
    const [stats, setStats] = useState([]);
    const [isHovered, setIsHovered] = useState(false);
    const id = 1;
    const blue = '/blue.png'; // Update image paths to relative paths
    const grey = '/grey.png';
    const green = '/green.png'; // Assuming green image is defined
    const imagePath = imageUrl === 'blue' ? blue : imageUrl === 'green' ? green : grey;
    const rotationStyle = rotation === '90' ? { transform: 'rotate(90deg)' } : {};
    const intervalId1 = useRef(null);

    const myID = live.find(item => item.id === id);

    const clearTable1 = () => {
        const databaseRef = ref(database, 'table1');

        remove(databaseRef)
            .then(() => {
                console.log('Data cleared successfully');
            })
            .catch((error) => {
                console.error('Error clearing data:', error);
            });
    };

    const reset = () => {
        clearInterval(intervalId1.current)
        setT1(prevState => ({ 
            ...prevState,
            compid: null,
            matchid: null
          }))
          setLive(prevLive =>
            prevLive.map(item =>
                item.id === myID.id
                    ? { ...item, live: false }
                    : item
            )
        );
        setShowLive(false);
        setStats([])
        clearTable1()
        onClose()
    }

    useEffect(() => {
        setShowLive(myID?.live || false);
    }, [myID]);

    useEffect(() => {
        const databaseRef = ref(database, 'table1');

        const unsubscribe = onValue(databaseRef, snapshot => {
            const data = snapshot.val();
            setStats(data);
            console.log(data)
        });

        return () => off(databaseRef, 'value', unsubscribe);
    }, []);

    const TableNo = () => {
        return (
            <div style={styles.tText}>
                <text style={styles.tText}>{id}</text>
            </div>
        );
    };

    const Live = () => {
        return (
            <div style={styles.live}>
                <LiveText liveStatus={showLive} />
            </div>
        );
    };

    useEffect(() => {
        intervalId1.current = setInterval(() => {
            if (t1.matchid !== null) {    
                try {
                const response = axios.post('https://twism.vercel.app/abif', null, {
                    params: { compid: t1.compid, matchid: t1.matchid },
                });
                const res = Object.keys(response.data).map((key) => response.data[key]);
                console.log(res);
            
                if (['3'].includes(res.livestatus) || ['3'].includes(res.remotestatusid) || ['3'].includes(res.status)) {
                    reset()
                }
            
                const databaseRef = ref(database, 'table1');
                set(databaseRef, res)
                    .then(() => console.log(`Data set in table1 successfully`))
                    .catch((error) => console.error(`Error setting data in table1}:`, error));
                } catch (error) {
                console.error('Error fetching data:', error);
                }
            }
        }, 20000)

    return () => clearInterval(intervalId1.current);
    }, [t1.matchid, t1.compid])

    const styles = {
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            // borderRadius: 10,
            // boxShadow: '0 8px 16px rgba(119, 119, 119, 0.5)',
            width: 700,
            marginLeft: '30%',
            position: 'relative', // Ensure positioning context for absolute positioning of stats
        },
        close: {
            backgroundColor: '#d80000',
            height: 35,
            width: 35,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 25,
            cursor: 'pointer',
            position: 'absolute',
            top: 10,
            right: 10,
        },
        closeButton: {
            fontSize: 24,
            color: 'black',
            fontWeight: 'bold',
        },
        hover: {
            backgroundColor: '#fb0000',
        },
        stats: {
            position: 'absolute',
            top: '35%',
            left: '-5%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
        },
        home: {
            textAlign: 'center',
            marginBottom: 10,
            fontSize: 25,
            fontWeight: 'bold',
            color: 'white',
        },
        away: {
            textAlign: 'center',
            marginTop: 10,
            fontSize: 25,
            fontWeight: 'bold',
            color: 'white',
        },
        awayscore: {
            textAlign: 'center',
            fontSize: 25,
            fontWeight: 'bold',
            marginTop: 10,
            alignSelf: 'center',
            color: 'white',
        },
        awayname: {
            textAlign: 'center',
            marginTop: 20,
            fontSize: 25,
            alignSelf: 'center',
            fontWeight: 'bold',
            color: 'white',
        },
        homename: {
            textAlign: 'center',
            marginBottom: 20,
            fontSize: 25,
            alignSelf: 'center',
            fontWeight: 'bold',
            color: 'white',
        },
        homescore: {
            textAlign: 'center',
            fontSize: 25,
            alignSelf: 'center',
            marginBottom: 10,
            fontWeight: 'bold',
            color: 'white',
        },
        tText: {
            position: 'absolute',
            top: '50%',
            left: '45.5%',
            transform: 'translate(-50%, -50%)',
            fontSize: 42,
            color: 'black',
            fontWeight: '800',
            fontFamily: 'OpenSans-SemiBold',
            textShadow: '0 4px 4px rgba(0, 0, 0, 0.25)',
        },
        live: {
            fontSize: 36,
            color: 'red',
            fontWeight: '800',
            fontFamily: 'OpenSans-SemiBold',
            textShadow: '0 4px 4px rgba(0, 0, 0, 0.25)',
        },
    };

    return (
        <div style={styles.container}>
            {stats && stats.length > 0 && (
                <div style={styles.stats}>
                <text style={styles.homename}>{stats[0].homeshortlabel}</text>
                <text style={styles.homescore}>{stats[0].homescore}</text>
                <text style={{fontSize: 50, fontWeight: 'bold', textAlign: 'center', color: 'red'}}>V</text>
                <text style={styles.awayscore}>{stats[0].awayscore}</text>
                <text style={styles.awayname}>{stats[0].awayshortlabel}</text>
            </div>
            )}
            <Live />
                <img
                    style={{ width: 260, height: 400 }}
                    onClick={() => openModal(id)}
                    src={imagePath}
                    alt="table"
                />
                <TableNo />
            {showLive && (
                <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
                    <button
                        style={{ ...styles.close, ...(isHovered ? styles.hover : {}) }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={reset}
                    >
                        <p style={styles.closeButton}>X</p>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Table1;
