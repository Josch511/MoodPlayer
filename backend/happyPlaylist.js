/*

Happy Songs from CSV
Extract 20 songs with high valence (happiness metric) from the database and dynamically display them in the happyPlaylist.html table.

Steps
Create API endpoint in backend/server.js that queries tracks with valence > 0.6, ordered by valence descending, limited to 20 songs, returning track_name, artists, album_name, and duration_ms.

Implement query logic in backend/happyPlaylist.js using the database connection to fetch happy tracks and export a getHappyTracks function.

Create frontend JavaScript file frontend/happyPlaylist.js that fetches from the new endpoint when the page loads and populates the table rows with track data.

Format and display data by converting duration_ms to MM:SS format and inserting track_name, artists, album_name, and formatted time into the 8 table rows (or expand to 20).

Link JavaScript file by adding <script src="happyPlaylist.js"></script> before the closing </body> tag in happyPlaylist.html.
*/