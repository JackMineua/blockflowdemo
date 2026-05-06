import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export default function Finishing() {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedWish, currentWeight, goalWeight, unit } = location.state || {};

    const [jobId, setJobId] = useState(null);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("idle");
    const [mode, setMode] = useState(null);
    const socketRef = useRef(null);

    const startWS = async () => {
        setMode('ws');
        setStatus('loading');
        const res = await fetch('http://localhost:3000/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        setJobId(data.jobId);

        const socket = new WebSocket('ws://localhost:3000');
        socket.onopen = () => {
            socket.send(JSON.stringify({ type: 'subscribe', jobId: data.jobId }));
        };
        socket.onmessage = (event) => {
            const update = JSON.parse(event.data);
            setProgress(update.progress);
            if (update.status === 'done') setStatus('done');
        };
        socketRef.current = socket;
    };

    const startPolling = async () => {
        setMode('http');
        setStatus('loading');
        
        const res = await fetch('http://localhost:3000/jobs', { method: 'POST' });
        const { jobId } = await res.json();
    
        const interval = setInterval(async () => {
            try {
                const statusRes = await fetch(`http://localhost:3000/jobs/${jobId}`);
                const data = await statusRes.json();

                if (data.status === 'done') {
                    setStatus('done');
                    clearInterval(interval);
                }
            } catch (e) {
                console.error("Polling error", e);
            }
        }, 1500); 
    };

    const handleReset = () => {
        if (socketRef.current) socketRef.current.close();
        navigate("/");
    };

    return (
        <div className="onboarding-container">
            <header className="header">
                <div className="navigation">
                    <Link className="back-btn" to="/goalweight" state={location.state}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                    </Link>
                    <div className="progress-container">
                        <div className="progress-bar" style={{ width: "100%" }}></div>
                    </div>
                </div>
            </header>

            <main className="content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {status === "idle" && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={startWS} className="option-item">Start via WebSocket</button>
                        <button onClick={startPolling} className="option-item">Start via HTTP</button>
                    </div>
                )}

                {status === "loading" && (mode === 'ws') && (
                    <>
                        <div className="circular-progress">
                            <svg width="200" height="200">
                                <circle cx="100" cy="100" r="90" stroke="#F3F4F6" strokeWidth="10" fill="none" />
                                <circle cx="100" cy="100" r="90" stroke="#26BAA4" strokeWidth="10" fill="none"
                                    strokeDasharray="565"
                                    strokeDashoffset={mode === 'ws' ? 565 - (565 * progress) / 100 : 400}
                                    style={{ transition: 'stroke-dashoffset 0.5s ease', animation: mode === 'http' ? 'rotate 2s linear infinite' : 'none' }}
                                />
                                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="32" fontWeight="700" fill="#26BAA4">
                                    {mode === 'ws' ? `${progress}%` : "..."}
                                </text>
                            </svg>
                        </div>
                        <h2 style={{ marginTop: '20px' }}>Creating something good for you...</h2>
                        <p className="helper-text">This will only take a moment — your item is almost ready.</p>
                    </>
                )}
                { (mode === 'http') && (status !== "done") && ( <p style={{ marginBottom: '20px' }}>Processing your request...</p> ) }

                {status === "done" && (
                    <div className="info-card" style={{ borderColor: '#26BAA4' }}>
                        <strong>Success!</strong>
                        <p>Your personalized plan is ready based on your wish!</p>
                    </div>
                )}

                <div className="testimonial-card">
                    <div className="stars">★★★★★</div>
                    <p>"I love this website! It makes practicing so easy and relaxing."</p>
                    <span className="author">John</span>
                </div>
            </main>

            <footer className="footer">
                <button onClick={handleReset} className="primary-btn" style={{ backgroundColor: "#F54927", opacity: 1 }}>Reset</button>
            </footer>
        </div>
    );
}