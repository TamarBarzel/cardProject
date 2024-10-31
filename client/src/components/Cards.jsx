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

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const updatedCards = Array.from(cards);
    const [removed] = updatedCards.splice(result.source.index, 1);
    updatedCards.splice(result.destination.index, 0, removed);
    console.log(updatedCards);

    setCards(updatedCards);
    try {
      await axios.put("http://localhost:8080/cards", {
        fromIndex:result.source.index,
        toIndex:result.destination.index,
      });
    } catch (error) {
      console.error("failed updating new card position", error);
    }
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
    <div>
      <h2>Cards List</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="cards-container"
            >
              {loading ? (
                <p>Loading cards...</p>
              ) : (
                cards.map((card, index) => (
                  <Draggable
                    key={card.id}
                    draggableId={card.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
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
    </div>
  );
};

export default Cards;
