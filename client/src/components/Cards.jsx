import React, { useState, useEffect } from "react";
import axios from "axios";
import CardItem from "./CardItem";

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
      {loading ? (
        <p>Loading cards...</p>
      ) : (
        <div className="cards-container">
          {cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
          <div className="add-card" onClick={handleAddCard}>
            <span className="add-icon">+</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
