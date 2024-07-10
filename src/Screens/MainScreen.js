import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table1 from '../Components/Table1';
import Table2 from '../Components/Table2';
import { useGlobalContext } from '../utils/Context';
import CustomModal from '../Components/CustomModal';
import './home.css';

const MainScreen = () => {
    const { league, setLeague, superleague, setSuperleague, vegasleague, setVegasleague, view, setView, id, setId, live, setLive } = useGlobalContext();
    const [compname, setCompname] = useState();
    const [compData, setCompData] = useState([]);
    const [liveMatchesData, setLiveMatchesData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const reset = () => {
        setView('default');
        setModalVisible(false);
        setLeague(null);
        setCompname(null);
    };

    const tableReset = () => {
        setView('default');
        setModalVisible(false);
        setLeague(null);
        setCompname(null);
        setId(null);
    };

    const fetchData = async (orgId, setState) => {
        try {
            const response = await axios.post(
                'https://twism.vercel.app/compstoday',
                null,
                {
                    params: {
                        'orgid': 64,
                    },
                }
            );
            setState(response.data);
            const processedData = liveMatches(response.data);
            setLiveMatchesData(processedData);
        } catch (error) {
            console.error('Error fetching data for orgId', orgId, ':', error);
        }
    };

    const onClose = () => {
        setModalVisible(false);
        setView('default');
        setLeague(null);
    };

    useEffect(() => {
        const fetchDataForLeagues = async () => {
            await fetchData(64, setSuperleague);
        };
        fetchDataForLeagues();
        const interval = setInterval(() => {
            fetchDataForLeagues();
        }, 45000);
        return () => clearInterval(interval);
    }, []);

    const liveMatches = (type) => {
        return Object.entries(type).flatMap(([compId, compData]) => {
            return Object.entries(compData.matches || {}).reduce((acc, [matchId, match]) => {
                if (match.home.status !== '3' || match.away.status !== '3') {
                    acc.push({ 
                        compId, 
                        compname: compData.compname, // Include compname
                        rounddesc: match.rounddesc, // Include rounddesc
                        matchId, 
                        roundid: match.roundid, 
                        ...match 
                    });
                }
                return acc;
            }, []);
        });
    };
    

    const handleSuper = () => {
        console.log('clicked')
        setLiveMatchesData(liveMatches(superleague));
        setView('Cards');
        setLeague('superleague');
    };

    const handleVegas = () => {
        setLiveMatchesData(liveMatches(vegasleague));
        setView('Cards');
        setLeague('vegasleague');
    };

    useEffect(() => {
        if (league === 'superleague') {
            setLiveMatchesData(liveMatches(superleague));
        } else if (league === 'vegasleague') {
            setLiveMatchesData(liveMatches(vegasleague));
        }
    }, [superleague, vegasleague]);

    const handleTableClick = (tid) => {
        setId(tid);
        setModalVisible(true);
    };

    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            minHeight: '100vh',
            marginLeft: "10.3vw",
            backgroundImage: '/public/Empire_Background.png',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        },
        wrapper: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            maxWidth: 1200,
        },
        box: {
            flex: 1,
            padding: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContainer: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        closeButton: {
            marginTop: 20,
            padding: 10,
            backgroundColor: '#ffffff',
            borderRadius: 5,
        },
        closeButtonText: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#000000',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                <div style={styles.box}>
                    <Table1
                        openModal={() => handleTableClick('1')}
                        imageUrl='grey'
                        liveData={liveMatchesData.filter(data => data.compId === '1')}
                        reset={tableReset}
                        onClose={onClose}
                    />
                </div>
                <div style={styles.box}>
                    <Table2
                        openModal={() => handleTableClick(2)}
                        imageUrl='grey'
                        liveData={liveMatchesData.filter(data => data.compId === '2')}
                        reset={tableReset}
                        onClose={onClose}
                    />
                </div>
            </div>

            {modalVisible && (
                <div style={styles.modalContainer}>
                    <CustomModal
                        visible={modalVisible}
                        data={liveMatchesData}
                        view={view}
                        handleSuper={handleSuper}
                        handleVegas={handleVegas}
                        reset={reset}
                        compname={compname}
                        tid={id}
                        onClose={onClose}
                    />
                    <button onClick={() => setModalVisible(false)} style={styles.closeButton}>
                        <span style={styles.closeButtonText}>Close Modal</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default MainScreen;
