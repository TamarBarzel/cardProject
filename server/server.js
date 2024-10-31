const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 8080;

app.use(express.json());
app.use(cors());

let cards = [
  { id: 1, text: "To Kill a Mockingbird", backgroundColor: "blue" },
  { id: 2, text: "1984", backgroundColor: "yellow" },
  { id: 3, text: "The Great Gatsby", backgroundColor: "green" },
];
let currentId = cards.length + 1;

app.get("/cards", (req, res) => {
  res.status(201).json(cards);
});

app.get("/cards/:id", (req, res) => {
  const cardId = parseInt(req.params.id);
  const card = cards.find((c) => c.id === cardId);
  if (card) {
    res.status(200).json(card);
  } else {
    res.status(404).json({ massage: "card not found" });
  }
});

app.post("/cards", (req, res) => {
  const newCard = {
    id: currentId,
    text: req.body.text,
    backgroundColor: req.body.backgroundColor,
  };
  cards.push(newCard);
  currentId++;
  res.status(201).json(newCard);
});

app.put("/cards/:id", (req, res) => {
  const cardId = parseInt(req.params.id);
  const card = cards.find((c) => c.id === cardId);

  if (card) {
    card.text = req.body.text || card.text;
    card.backgroundColor = req.body.backgroundColor || card.backgroundColor;
    res.status(201).json(card);
  } else {
    res.status(404).json({ message: "card not found" });
  }
});

app.put("/cards", (req, res) => {
  const { fromIndex, toIndex } = req.body;

  const [movedCard] = cards.splice(fromIndex, 1);
  cards.splice(toIndex, 0, movedCard);
  res.status(200).json({"success": true, cards })
});

app.delete("/cards/:id", (req, res) => {
  const cardId = parseInt(req.params.id);
  const card = cards.find((c) => c.id === cardId);

  if (card) {
    cards = cards.filter((c) => c.id !== cardId);
    res.status(201).json({ message: "card deleted succesfully" });
  } else {
    res.status(404).json({ message: "card not found" });
  }
});

app.listen(PORT, () => {
  console.log(`server is listening at http://${PORT}`);
});
