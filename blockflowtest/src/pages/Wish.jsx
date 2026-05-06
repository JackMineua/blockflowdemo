import { useState } from "react";
import { Link } from "react-router-dom"

export default function Wish() {

    const wishes = [
        { id: 1, emoji: '😊', text: 'wish1' },
        { id: 2, emoji: '🥳', text: 'wish2' },
        { id: 3, emoji: '⚖️', text: 'wish3' },
        { id: 4, emoji: '💚', text: 'wish4' },
        { id: 5, emoji: '😁', text: 'wish5' },
        { id: 6, emoji: '🌟', text: 'wish6' },
    ];

    const [selectedId, setSelectedId] = useState(null);

    const handleSelect = (id) => {
        setSelectedId(id);
    };

    return (
        <>
            <div className="onboarding-container">
                <header className="header">
                    <div className="navigation">
                        <div className="progress-container">
                            <div className="progress-bar" style={{ width: "25%" }}></div>
                        </div>
                    </div>
                </header>

                <main className="content">
                    <h1 className="title">What is your main wish?</h1>
                    <div className="options-list">
                        {wishes.map((wish) => (
                            <div
                                key={wish.id}
                                className={`option-item ${selectedId === wish.id ? 'active' : ''}`}
                                onClick={() => handleSelect(wish.id)}
                            >
                                <span>{wish.emoji}</span> {wish.text}
                            </div>
                        ))}
                    </div>
                </main>

                <footer className="footer">
                    <Link className="primary-btn" to="/currentweight" state={{ selectedWish: selectedId }}>Continue</Link>
                </footer>
            </div>
        </>
    )
}