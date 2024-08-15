// components/DraggableCard.jsx
import { Rnd } from 'react-rnd';
import { ArcherElement } from 'react-archer';
import Card from './cardComponent';
import PropTypes from 'prop-types';
import './DraggableCard.css';

const DraggableCard = ({ 
    card, 
    onUpdate, 
    onDelete, 
    onStartConnection, 
    onEndConnection,
    connecting, 
    startCard, 
    relations 
}) => {
    const handleClick = () => {
        if (connecting) {
            onEndConnection(card.id);
        } else {
            onStartConnection(card.id);
        }
    };

    return (
        <Rnd
            position={card.position}
            size={card.size}
            minWidth={150}
            minHeight={100}
            onDragStop={(e, d) => onUpdate(card.id, { x: d.x, y: d.y }, card.size)}
            onResizeStop={(e, direction, ref, delta, position) => 
                onUpdate(card.id, position, { 
                    width: parseInt(ref.style.width), 
                    height: parseInt(ref.style.height) 
                })
            }
            bounds="parent"
            className="draggable-card"
        >
            <ArcherElement
                id={`card-${card.id}`}
                relations={relations}
            >
                <div 
                    className="archer-card" 
                    onDoubleClick={handleClick}
                >
                    <Card 
                        text={card.text} 
                        onDelete={() => onDelete(card.id)}
                    />
                    {connecting && startCard === card.id && (
                        <div className="connecting-indicator">Connecting...</div>
                    )}
                </div>
            </ArcherElement>
        </Rnd>
    );
};

DraggableCard.propTypes = {
    card: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onStartConnection: PropTypes.func.isRequired,
    onEndConnection: PropTypes.func.isRequired,
    connecting: PropTypes.bool.isRequired,
    startCard: PropTypes.number,
    relations: PropTypes.array.isRequired,
};

export default DraggableCard;