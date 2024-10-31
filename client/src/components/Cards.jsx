import React, { useState, useEffect } from "react";
import axios from "axios";
import CardItem from "./CardItem";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Cards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get("http://localhost:8080/cards");
        setCards(response.data);
      } catch (error) {
        console.error("failed fetching data cards", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updatedCards = Array.from(cards);
    const [removed] = updatedCards.splice(result.source.index, 1);
    updatedCards.splice(result.destination.index, 0, removed); // העברה ליעד הנכון

    setCards(updatedCards);
  };

  const handleAddCard = async () => {
    try {
      const response = await axios.post("http://localhost:8080/cards", {
        text: "",
        backgroundColor: "grey",
      });
      setCards((prevCards) => [...prevCards, response.data]);
    } catch (error) {
      console.error("failed to add new card", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/cards/${id}`);
      setCards((prevCards) => prevCards.filter((card) => card.id !== id));
    } catch (error) {
      console.error("failed delete card", error);
    }
  };

  const handleEdit = async (id, newText, newColor) => {
    try {
      await axios.put(`http://localhost:8080/cards/${id}`, {
        text: newText,
        backgroundColor: newColor,
      });
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === id
            ? { ...card, text: newText, backgroundColor: newColor }
            : card
        )
      );
    } catch (error) {
      console.error("error updating card", error);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div
            ref={provided.innerRef} // שימו לב שפה יש את ה-ref
            {...provided.droppableProps} // וה-props
            className="cards-container"
          >
            <h2>Cards List</h2>
            {loading ? (
              <p>Loading cards...</p>
            ) : (
              cards.map((card, index) => ( // השתמש ב-cards
                <Draggable
                  key={card.id}
                  draggableId={card.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef} // שימו לב שה-ref הזה גם קיים
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <CardItem
                        card={card}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                      />
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
            <div className="add-card" onClick={handleAddCard}>
              <span className="add-icon">+</span>
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Cards;
