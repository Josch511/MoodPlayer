import express from 'express';
import path from 'path';
import { connect } from '../db/connect.js';
import { play } from './player.js';
import fs from "fs";
import csv from "csv-parser";

const db = await connect();
const tracks = await loadTracks();
const currentTracks = new Map();

const port = process.env.PORT || 3003;
const server = express();

server.use(express.static('frontend'));
server.use(express.json());
server.use(onEachRequest);

// API ROUTE TIL HAPPY PLAYLIST 
server.get("/api/happyPlaylist", (req, res) => {
    // tomt array til rækkerne fra csv filen 
    const results = [];
    // stien til csv filen 
    const filePath = path.join(import.meta.dirname, '..', 'db', 'happyPlaylist.csv');
    // et objekt der læser vores fil en linje af gangen i stedet for at indlæse hele filen på en gang
    fs.createReadStream(filePath)
        // den der gør at det kan konverteres fra csv til json 
        .pipe(csv())
        // hver gang den har læst en ny linje i csv filen, bliver denne linje skubbet ud i DOM
        .on("data", (row) => results.push(row))
        // der er ikke flere sange på listen og den logger i console.log hvor mange sange der er på listen
        .on("end", () => {
            console.log("Loaded", results.length, "songs");
            res.json(results);
        })
        // hvis der kommer en fejl, meddeler den at vi ik ku få fat i csv filen så vi ved det er der fejlen er 
        .on("error", (err) => {
            console.error("CSV error:", err);
            res.status(500).json({ error: "Failed to read CSV file" });
        });
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

async function loadTracks() {
    const dbResult = await db.query(`
        select *
        from   tracks
        where track_id = '5SuOikwiRyPMVoIQDJUgSV'
    `);
    return dbResult.rows;
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
