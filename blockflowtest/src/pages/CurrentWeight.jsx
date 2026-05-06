import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react";

export default function CurrentWeight() {

    const [currentweight, setCurrentWeight] = useState(useLocation().state?.currentWeight || null);
    const [unit, setUnit] = useState(useLocation().state?.unit || "kg");

    const location = useLocation();
    const wish = location.state?.selectedWish;

    useEffect(() => {
        if (!wish) {
            window.location.href = "/";
        }
    }, []);

    function isValid() {
        if (unit === "kg") {
            if (currentweight >= 10 && currentweight <= 220) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            if (currentweight >= 22 && currentweight <= 485) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    return (
        <>
            <div className="onboarding-container">
                <header className="header">
                    <div className="navigation">
                        <Link className="back-btn" to="/" state={{ selectedWish: wish }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                        </Link>
                        <div className="progress-container">
                            <div className="progress-bar" style={{ width: "50%" }}></div>
                        </div>
                    </div>
                </header>

                <main className="content">
                    <h1 className="title">What is your weight?</h1>

                    <div className="input-area">

                        <div className="toggle-group">
                            <button
                                className={`toggle-btn ${unit === "lbs" ? "active" : ""}`}
                                onClick={() => setUnit("lbs")}
                            >lbs</button>
                            <button
                                className={`toggle-btn ${unit === "kg" ? "active" : ""}`}
                                onClick={() => setUnit("kg")}
                            >kg</button>
                        </div>

                        <div className="big-value">
                            <input
                                type="number"
                                value={currentweight}
                                placeholder="0"
                                onChange={(e) => setCurrentWeight(e.target.value)}
                                autoFocus
                            />
                            <span>{unit}</span>
                        </div>

                        <p className={`weightAlert ${isValid() ? "" : "active"}`}>Please enter a value between {(unit === "lbs") && (<>22 lbs and 485 lbs</>)}{(unit === "kg") && (<>10 kg and 220 kg</>)}</p>
                    </div>
                </main>

                <footer className="footer">
                    <Link className={`primary-btn ${isValid() ? "" : "disabled"}`} to="/goalweight" state={{ selectedWish: wish, currentWeight: currentweight, unit: unit }}>Continue</Link>
                </footer>
            </div>
        </>
    )
}