
// App.jsx
import { useState, useRef } from 'react';
import { ArcherContainer } from 'react-archer';
import DraggableCard from './components/DraggableCard';
import "./App.css";

const App = () => {
    const [cards, setCards] = useState([]);
    const [inputText, setInputText] = useState('');
    const [connections, setConnections] = useState([]);
    const [connecting, setConnecting] = useState(false);
    const [startCard, setStartCard] = useState(null);
    const canvasRef = useRef(null);

    const findEmptySpace = () => {
        const gridSize = 400;
        const maxX = canvasRef.current ? canvasRef.current.clientWidth - gridSize : 0;
        const maxY = canvasRef.current ? canvasRef.current.clientHeight - gridSize : 0;
        
        for (let y = 0; y <= maxY; y += gridSize) {
            for (let x = 0; x <= maxX; x += gridSize) {
                if (!cards.some(card => 
                    Math.abs(card.position.x - x) < gridSize && 
                    Math.abs(card.position.y - y) < gridSize
                )) {
                    return { x, y };
                }
            }
        }
        return { x: 0, y: 0 };
    };

    const addCard = () => {
        if (inputText.trim() === '') return;
        const position = findEmptySpace();
        const newCard = {
            id: Date.now(),
            text: inputText,
            position: position,
            size: { width: 300, height: 300 }
        };
        setCards([...cards, newCard]);
        setInputText('');
    };

    const startConnection = (id) => {
        setConnecting(true);
        setStartCard(id);
    };

    const endConnection = (endId) => {
        if (startCard !== null && startCard !== endId) {
          const newConnection = { 
            start: startCard, 
            end: endId,
            id: `conn_${startCard}_${endId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          };
          setConnections(prevConnections => [...prevConnections, newConnection]);
          setConnecting(false);
          setStartCard(null);
        }
      };

    const updateCard = (id, newPosition, newSize) => {
        setCards(cards.map(card =>
            card.id === id ? { ...card, position: newPosition, size: newSize } : card
        ));
        setConnections([...connections]);
    };

    const deleteCard = (id) => {
        setCards(cards.filter(card => card.id !== id));
        setConnections(connections.filter(conn => conn.start !== id && conn.end !== id));
    };

    return (
        <div className="app-container">
            <div className="input-container">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="input"
                    placeholder="Enter some text"
                />
                <button onClick={addCard} className="button-52">Add Card</button>
            </div>
            <div className="canvas-container" ref={canvasRef}>
                <ArcherContainer strokeColor="red">
                    <div className="card-canvas">
                        {cards.map((card) => (
                            <DraggableCard
                                key={`draggable-${card.id}`}
                                card={card}
                                onUpdate={updateCard}
                                onDelete={deleteCard}
                                onStartConnection={startConnection}
                                onEndConnection={endConnection}
                                connecting={connecting}
                                startCard={startCard}
                                relations={connections
                                    .filter(conn => conn.start === card.id)
                                    .map(conn => ({
                                      targetId: `card-${conn.end}`,
                                      targetAnchor: 'top',
                                      sourceAnchor: 'middle',
                                      label: `Connection ${conn.id}`, // Add a label if needed
                                      key: `${card.id}-${conn.end}` // Use a combination of start and end card IDs
                                    }))}
                            />
                        ))}
                    </div>
                </ArcherContainer>
            </div>
        </div>
    );
};

export default App;