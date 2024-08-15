// components/Card.jsx
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './Card.css';

const Card = ({ text, onDelete }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [displayText, setDisplayText] = useState('');
    const cardContentRef = useRef(null);

    useEffect(() => {
        if (cardContentRef.current) {
            const element = cardContentRef.current;
            let content = text;
            element.innerHTML = content;
            
            while (element.scrollHeight > element.clientHeight) {
                content = content.slice(0, -1);
                element.innerHTML = content + '...';
            }
            
            if (content.length < text.length) {
                setDisplayText(content + '...');
            } else {
                setDisplayText(content);
            }
        }
    }, [text]);

    const togglePopup = (e) => {
        e.stopPropagation();
        setShowPopup(!showPopup);
    };

    return (
        <div className="card">
            <div ref={cardContentRef} className="card-content">
                {displayText}
            </div>
            {displayText !== text && (
                <button onClick={togglePopup} className="button-29">
                    Show More
                </button>
            )}
            <button className="delete-button" onClick={onDelete}>X</button>
            
            {showPopup && (
                <div className="popup-overlay" onClick={togglePopup}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <p>{text}</p>
                        <button onClick={togglePopup} className="close-popup">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

Card.propTypes = {
    text: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default Card;
