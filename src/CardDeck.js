import React, { useEffect, useState } from 'react';
import Card from './Card';
import './CardDeck.css';
import axios from 'axios';

//API used to generate a card deck and draw cards from it.
const API_URL = 'https://deckofcardsapi.com/api/deck';

const CardDeck = () => {
  const [deck, setDeck] = useState(null);
  const [drawnCard, setDrawnCard] = useState([]);
  const [shuffle, setShuffle] = useState(false);

  useEffect(function getDeck() {
    const getData = async () => {
      const deck = await axios.get(`${API_URL}/new/shuffle/`);
      setDeck(deck.data);
    }
    getData();
  }, []);

  //Handles drawing of cards.
  const drawCard = async () => {
    try{
      const res = await axios.get(`${API_URL}/${deck.deck_id}/draw/`);
      if(res.data.remaining === 0) throw new Error('No cards remaining!');

      const card = res.data.cards[0];

      setDrawnCard(d => [
        ...d,
        {
          id: card.code,
          name: card.value + " of " + card.suit,
          image: card.image,
        },
      ]);
    } catch (e) {
      alert(e);
    }
  }

  //Handle the start of shuffling.
  const beginShuffle = async () => {
    setShuffle(true);
    try {
      await axios.get(`${API_URL}/${deck.deck_id}/shuffle/`);

      setDrawnCard([]);
    } catch (e) {
      alert(e);
    } finally {
      setShuffle(false);
    }
  }

  //Renders the draw card button if not shuffling.
  const renderDrawCardBtn = () => {
    if (!deck) {
      return null;
    } else {
      return (
        <button className="Deck-btn draw" disabled={shuffle} onClick={drawCard}>Draw Card</button>
      )
    };
  }

  //Renders the shuffle button if it is not already on screen.
  const renderShuffleCardBtn = () => {
    if (!deck) {
      return null;
    } else {
      return (
        <button className='Deck-btn shuffle' disabled={shuffle} onClick={beginShuffle}>Shuffle Deck</button>
      )
    };
  }

  return (
    <div className='Deck'>
      {renderDrawCardBtn()}
      {renderShuffleCardBtn()}

      <div className='Deck-cards'>
        {
          drawnCard.map(c => (
            <Card key={c.id} name={c.name} image={c.image} />
          ))
        }
      </div>

    </div>
  );
}

export default CardDeck;