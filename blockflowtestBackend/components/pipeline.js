const db = require('./db');

const steps = [
    { name: 'Analyzing data', duration: 1500, weight: 30 },
    { name: 'Optimizing plan', duration: 2000, weight: 40 },
    { name: 'Finalizing result', duration: 1000, weight: 30 }
];

async function runPipeline(jobId, onUpdateCallback) {
    let currentProgress = 0;

    db.run('UPDATE jobs SET status = "processing", progress = 0 WHERE id = ?', [jobId]);

    for (const step of steps) {
        await new Promise(res => setTimeout(res, step.duration));
        currentProgress += step.weight;

        db.run('UPDATE jobs SET progress = ?, status = "processing" WHERE id = ?', [currentProgress, jobId], (err) => {
            if (err) console.error("DB Update Error:", err);

            if (onUpdateCallback) {
                onUpdateCallback({ id: jobId, status: 'processing', progress: currentProgress });
            }
        });
    }

    db.run('UPDATE jobs SET status = "done", progress = 100 WHERE id = ?', [jobId], () => {
        if (onUpdateCallback) {
            onUpdateCallback({ id: jobId, status: 'done', progress: 100 });
        }
    });
}

module.exports = { runPipeline };