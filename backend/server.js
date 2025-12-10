import express from 'express';
import path from 'path';
import { connect } from '../db/connect.js';
import { play } from './player.js';
import fs from "fs";
import csv from "csv-parser";

const db = await connect();
const currentTracks = new Map();

const port = process.env.PORT || 3003;
const server = express();

server.use(express.static('frontend'));
server.use(express.json());
server.use(onEachRequest);

// API ROUTE TIL HAPPY PLAYLIST
server.get("/api/happyPlaylist", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM happyPlaylist ORDER BY id");
        res.json(result.rows);
    } catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: "Database error" });
    }
});


// API ROUTE TIL CHILL PLAYLIST
server.get("/api/chillPlaylist", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM chillPlaylist ORDER BY id");
        res.json(result.rows);
    } catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// API ROUTE TIL PARTY PLAYLIST
server.get("/api/partyPlaylist", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM partyPlaylist ORDER BY id");
        res.json(result.rows);
    } catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// API ROUTE TIL SAD PLAYLIST
server.get("/api/sadPlaylist", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM sadPlaylist ORDER BY id");
        res.json(result.rows);
    } catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// API ROUTE TIL WORKOUT PLAYLIST
server.get("/api/workoutPlaylist", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM workoutPlaylist ORDER BY id");
        res.json(result.rows);
    } catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// API ROUTE TIL MATCHED PLAYLIST BASERET PÅ BRUGER SVAR
server.post("/api/matchedPlaylist", async (req, res) => {
    try {
        const { valence, tempo, loudness, energy, acousticness, danceability, instrumentalness } = req.body;

        // Validering af input
        if (valence === undefined || tempo === undefined || loudness === undefined || 
            energy === undefined || acousticness === undefined || danceability === undefined || 
            instrumentalness === undefined) {
            return res.status(400).json({ error: "Missing audio features" });
        }

        // SQL query med range-baseret matching
        const result = await db.query(`
            SELECT track_name, artists, album_name, duration_ms, popularity,
                   valence, tempo, loudness, energy, acousticness, danceability, instrumentalness
            FROM mood_tracks 
            WHERE ABS(valence - $1) < 0.25
              AND ABS(energy - $2) < 0.25
              AND ABS(danceability - $3) < 0.25
              AND ABS(instrumentalness - $4) < 0.25
              AND ABS(acousticness - $5) < 0.25
              AND ABS(tempo - $6) < 50
              AND ABS(loudness - $7) < 3
            ORDER BY popularity DESC
            LIMIT 25
        `, [valence, energy, danceability, instrumentalness, acousticness, tempo, loudness]);

        console.log(`Found ${result.rows.length} matched songs for features:`, 
                    { valence, tempo, loudness, energy, acousticness, danceability, instrumentalness });

        res.json(result.rows);
    } catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: "Database error" });
    }
});

server.get('/api/party/:partyCode/currentTrack', onGetCurrentTrackAtParty);

// den her SKAL være til sidst ellers loader den ik de get pointer der kommer efterfølgende ;)
server.get(/\/[a-zA-Z0-9-_/]+/, onFallback);

server.listen(port, onServerReady);

function onEachRequest(request, response, next) {
    console.log(new Date(), request.method, request.url);
    next();
}

async function onFallback(request, response) {
    response.sendFile(path.join(import.meta.dirname, '..', 'frontend', 'index.html'));
}

function onServerReady() {
    console.log('Webserver running on port', port);
}

function pickNextTrackFor(partyCode) {
    const trackIndex = Math.floor(Math.random() * tracks.length)
    currentTracks.set(partyCode, trackIndex);
    const track = tracks[trackIndex];
    play(partyCode, track.track_id, track.duration, Date.now(), () => currentTracks.delete(partyCode));
    return trackIndex;
}

async function onGetCurrentTrackAtParty(request, response) {
    const partyCode = request.params.partyCode;
    let trackIndex = currentTracks.get(partyCode);
    if (trackIndex === undefined) {
        trackIndex = pickNextTrackFor(partyCode);
    }
    const track = tracks[trackIndex];
    response.json(track);
}