import { spotifyCard } from '../data/spotifyCard';
import { FaSpotify } from 'react-icons/fa';

const SPOTIFY_TRACK_ID_REGEX = /^[A-Za-z0-9]{22}$/;

function toEmbedTrackUrl(trackUrl) {
  if (typeof trackUrl !== 'string') return null;
  const value = trackUrl.trim();
  if (!value) return null;

  let trackId = null;

  if (value.startsWith('spotify:track:')) {
    const idFromUri = value.split(':')[2];
    if (SPOTIFY_TRACK_ID_REGEX.test(idFromUri || '')) {
      trackId = idFromUri;
    }
  } else {
    try {
      const parsed = new URL(value);
      const segments = parsed.pathname.split('/').filter(Boolean);
      const trackIndex = segments.findIndex((segment) => segment === 'track');

      if (trackIndex >= 0 && segments[trackIndex + 1]) {
        const idFromPath = segments[trackIndex + 1];
        if (SPOTIFY_TRACK_ID_REGEX.test(idFromPath)) {
          trackId = idFromPath;
        }
      }
    } catch {
      return null;
    }
  }

  return trackId ? `https://open.spotify.com/embed/track/${trackId}` : null;
}

function SpotifyPlaylistCard({ compact = false }) {
  const embedUrl = toEmbedTrackUrl(spotifyCard.trackUrl);
  const tracks = Array.isArray(spotifyCard.tracks) ? spotifyCard.tracks : [];

  return (
    <div className={`playlist-card${compact ? ' playlist-card--compact' : ''}`} aria-label="Playlist card">
      <div className="playlist-cover">
        <p className="playlist-cover-label">I'm Listening to</p>
        <div className="playlist-cover-badge" aria-hidden="true">
          <FaSpotify />
        </div>
      </div>

      <p className="playlist-kicker">{embedUrl ? 'Now Playing' : 'Featured Playlist'}</p>
      <h3 className="playlist-title">{spotifyCard.playlistTitle}</h3>
      <p className="playlist-subtitle">{spotifyCard.subtitle}</p>

      {embedUrl ? (
        <div className="playlist-embed-wrap">
          <iframe
            className="playlist-embed"
            src={embedUrl}
            title="Spotify player"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      ) : (
        <p className="playlist-fallback-note">
          Spotify embed unavailable. Showing track list only.
        </p>
      )}

      {!compact && (
        <ul className="playlist-tracks">
          {tracks.map((track, index) => (
            <li key={track.title} className="playlist-track">
              <span className="playlist-track-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="playlist-track-title">{track.title}</span>
              <span className="playlist-track-duration">{track.duration}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SpotifyPlaylistCard;
