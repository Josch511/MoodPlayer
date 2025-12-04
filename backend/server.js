import express from 'express';
import path from 'path';
import { connect } from '../db/connect.js';
import { play } from './player.js';
import { on } from 'events';


const db = await connect();
const tracks = await loadTracks();
const currentTracks = new Map(); // maps partyCode to index in tracks

const port = process.env.PORT || 3003;
const server = express();

server.use(express.static('frontend'));
server.use(express.json());
server.use(onEachRequest);
server.get('/api/party/:partyCode/currentTrack', onGetCurrentTrackAtParty);
server.get(/\/[a-zA-Z0-9-_/]+/, onFallback); // serve index.html on any other simple path
server.get("/api/tracks", onGetTracks); // Existing endpoint for all tracks
server.listen(port, onServerReady);

async function onGetCurrentTrackAtParty(request, response) {
    const partyCode = request.params.partyCode;
    let trackIndex = currentTracks.get(partyCode);
    if (trackIndex === undefined) {
        trackIndex = pickNextTrackFor(partyCode);
    }
    const track = tracks[trackIndex];
    response.json(track);
}

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
// 
async function onGetTracks(request, response) {
    const dbResult = await db.query(`
        select *
        from   tracks
        limit 10
    `);
    response.json(dbResult.rows);
}

// skal rettes til !

function onMusicData(request, response) {
    const query = request.query.song?.toLowerCase() || '';
    const matches = [];

    for (const album of albums) {
        for (const track of album.tracks) {
            if (track.title.toLowerCase().startsWith(query)) {
                matches.push({
                    title: track.title,
                    albumTitle: album.title,
                    artist: album.artist.name
                });
            }
        }
    }
}