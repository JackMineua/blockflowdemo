import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react";

export default function GoalWeight() {
    const [goalWeight, setGoalWeight] = useState(useLocation().state?.goalWeight || null);

    const location = useLocation();
    const wish = location.state?.selectedWish;
    const currentweight = location.state?.currentWeight;
    const unit = location.state?.unit;

    useEffect(() => {
        if(!wish || !currentweight || !unit) {
            window.location.href="/";
        }
    }, []);

    const weightDiff = currentweight && goalWeight ? currentweight - goalWeight : 0;
    const losePercentage = currentweight > 0 ? Math.round((weightDiff / currentweight) * 100) : 0;

    function isValid() {
        if (unit === "kg") {
            if (goalWeight >= 10 && goalWeight <= 220) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            if (goalWeight >= 22 && goalWeight <= 485) {
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
                        <Link className="back-btn" to="/currentweight" state={{ selectedWish: wish, currentWeight: currentweight, unit: unit }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                        </Link>
                        <div className="progress-container">
                            <div className="progress-bar" style={{ width: "75%" }}></div>
                        </div>
                    </div>
                </header>

                <main className="content">
                    <h1 className="title">What is your goal weight?</h1>

                    <div className="input-area">

                        <div className="toggle-group">
                            <div className="toggle-btn active">{unit}</div>
                        </div>

                        <div className="big-value">
                            <input
                                type="number"
                                value={goalWeight}
                                placeholder="0"
                                onChange={(e) => setGoalWeight(e.target.value)}
                            />
                            <span>{unit}</span>
                        </div>

                        <p className={`weightAlert ${isValid() ? "" : "active"}`}>Please enter a value between {(unit === "lbs") && (<>22 lbs and 485 lbs</>)}{(unit === "kg") && (<>10 kg and 220 kg</>)}</p>

                        <div className="info-card">
                            <strong>Goal: Lose {losePercentage > 0 ? losePercentage : 0}% of your weight</strong>
                            <p>Even small, steady changes can make a meaningful difference. We'll support you with a balanced plan.</p>
                        </div>

                    </div>
                </main>

                <footer className="footer">
                <Link className={`primary-btn ${isValid() ? "" : "disabled"}`} to="/finishing" state={{ selectedWish: wish, currentWeight: currentweight, goalWeight: goalWeight, unit: unit }}>Continue</Link>
                </footer>
            </div>
        </>
    )
}