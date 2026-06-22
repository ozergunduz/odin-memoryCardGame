import { useEffect, useState } from "react";
import "./App.css";

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function App() {
  const [cards, setCards] = useState([]);
  const [clickedCards, setClickedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    async function getPokemon() {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=12"
      );

      const data = await response.json();

      const pokemonData = await Promise.all(
        data.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();

          return {
            id: details.id,
            name: details.name,
            image: details.sprites.other["official-artwork"].front_default,
          };
        })
      );

      setCards(pokemonData);
    }

    getPokemon();
  }, []);

  function handleCardClick(id) {
    if (clickedCards.includes(id)) {
      setClickedCards([]);
      setScore(0);
      setCards(shuffleArray(cards));
      return;
    }

    const newScore = score + 1;

    setClickedCards([...clickedCards, id]);
    setScore(newScore);

    if (newScore > bestScore) {
      setBestScore(newScore);
    }

    setCards(shuffleArray(cards));
  }

  return (
    <div className="app">
      <h1>Memory Card Game</h1>

      <div className="scoreboard">
        <p>Score: {score}</p>
        <p>Best Score: {bestScore}</p>
      </div>

      <div className="card-container">
        {cards.map((card) => (
          <button
            key={card.id}
            className="card"
            onClick={() => handleCardClick(card.id)}
          >
            <img src={card.image} alt={card.name} />
            <p>{card.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}