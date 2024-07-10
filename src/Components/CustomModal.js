import React, { useEffect, useState } from 'react';
import RadioCard from '../Components/RadioCard';
import { useGlobalContext } from '../utils/Context';

export default function CustomModal({
    visible,
    onClose,
    data,
    view,
    handleSuper,
    reset,
    tid,
    compname,
}) {
    useEffect(() => {
        console.log(data);
    }, [data]);

    const { fonts } = useGlobalContext();
    const [isHovered, setIsHovered] = useState(false);

    const styles = {
        close: {
            backgroundColor: '#d80000',
            height: 35,
            width: 35,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 25,
            cursor: 'pointer',
        },
        closeButton: {
            fontSize: 24,
            color: 'black',
            fontWeight: 'bold',
        },
        hover: {
            backgroundColor: '#fb0000',
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContent: {
            width: 1280,
            height: 720,
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 10,
            position: 'relative',
            overflowY: 'auto',
        },
        fullScreenOverlay: {
            display: 'flex',
            width: '100%',
            maxHeight: 620,
            paddingBottom: 25,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        box: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 450,
        },
        box2: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            height: '90%',
            width: '90%',
            borderRadius: 20,
        },
        boxtext: {
            marginTop: 25,
            marginBottom: 10,
            fontSize: 30,
            fontWeight: 'bold',
            color: 'white',
        },
        cardContainer: {
            display: 'flex',
            flexDirection: 'row', // Changed to row for horizontal arrangement
            flexGrow: 1,
            backgroundColor: 'rgba(164, 166, 162, 0.4)',
            minWidth: 1280,
            maxWidth: 720,
            flexWrap: 'wrap',
            overflowY: 'auto',
            maxHeight: '100%',
        },
        backgroundImage: {
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
        },
        buttonStyle: {
            backgroundColor: '#FC9742',
            height: 50,
            width: 100,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: 'rgba(164, 166, 162, 0.4)',
            cursor: 'pointer',
            zIndex: 10,
        },
        buttontext: {
            color: 'black',
            fontWeight: '800',
            fontSize: 22,
            marginTop: 3,
        },
        compHeader: {
            fontSize: 24,
            fontWeight: 'bold',
            marginTop: 10,
            marginBottom: 5,
        },
        roundHeader: {
            fontSize: 20,
            fontWeight: 'bold',
            marginTop: 5,
            marginBottom: 5,
            color: 'white',
        },
        divider: {
            width: 2, // Vertical line
            backgroundColor: 'black', // Changed to black
            margin: '0 10px', // Horizontal margin
            height: '100%', // Full height
        },
    };

    if (!visible) return null;

    const groupedMatches = {};

    // Group matches by compId and roundId
    data.forEach(match => {
        const { compId, roundid } = match;

        if (!groupedMatches[compId]) {
            groupedMatches[compId] = {
                compname: match.compname,
                rounds: {},
            };
        }

        if (!groupedMatches[compId].rounds[roundid]) {
            groupedMatches[compId].rounds[roundid] = {
                rounddesc: match.rounddesc,
                matches: [],
            };
        }

        groupedMatches[compId].rounds[roundid].matches.push(match);
    });

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div style={styles.modalOverlay} onClick={handleOverlayClick}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div style={styles.cardContainer}>
                    {Object.keys(groupedMatches).map((compId, index) => (
                        <React.Fragment key={compId}>
                            {index > 0 && <div style={styles.divider} />}
                            <div>
                                <h2 style={styles.compHeader}>{groupedMatches[compId].compname}</h2>
                                {Object.keys(groupedMatches[compId].rounds).map(roundid => (
                                    <div key={roundid}>
                                        <h3 style={styles.roundHeader}>{groupedMatches[compId].rounds[roundid].rounddesc}</h3>
                                        {groupedMatches[compId].rounds[roundid].matches.map(item => (
                                            <RadioCard
                                                key={item.matchId}
                                                home={item.home.teamname}
                                                away={item.away.teamname}
                                                matchid={item.matchId}
                                                compid={item.compId}
                                                liveStatus={item.home.livestatus}
                                                tid={tid}
                                                reset={reset}
                                                homescore={item.home.framescore}
                                                awayscore={item.away.framescore}
                                                compname={compname}
                                                rounds={item.rounds}
                                                data={item}
                                                onClose={onClose}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}
