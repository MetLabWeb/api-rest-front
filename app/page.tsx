"use client";

import { useSpotify } from "./components/use-spotify";
import Image from "next/image";
import { useApiData } from "./components/use-api-data";
import { CreatePlaylistForm } from "./components/create-playlist-form";
import { EditPlaylistForm } from "./components/edit-playlist-form";
import { AlertMessage } from "./components/alert-message";

//Mocks for testing UI
// const playlistsMock = [
//   {
//     name: "Playlist name",
//     description: "Playlist description",
//     id: "62fG6pYOq4IMNieCKYFNfn",
//   },
//   {
//     name: "Playlist name",
//     description: "Playlist description",
//     id: "62fG6pYOq4IMNieCKYFNfn",
//   },
//   {
//     name: "Playlist name",
//     description: "Playlist description",
//     id: "62fG6pYOq4IMNieCKYFNfn",
//   },
//   {
//     name: "Playlist name",
//     description: "Playlist description",
//     id: "62fG6pYOq4IMNieCKYFNfn",
//   },
// ];
// const userMock = {
//   id: "12345666666",
//   display_name: "MetLab Web",
// };

export default function Home() {
  const { currentToken } = useSpotify();
  const {
    playlists,
    user,
    error,
    createPlaylist,
    updatePlaylist,
    alertMessage,
  } = useApiData(currentToken?.access_token);

  return (
    <div className="bg-black text-white h-screen flex flex-col">
      <header className="flex justify-between items-center p-4 bg-gray-900">
        <div className="font-bold flex flex-row w-full items-center">
          <img src={"/spotify.png"} alt="Spotify" className="w-48 h-14" />
          <img src={"/metlabweb-logo.png"} alt="MetLab Web" className="w-32" />
        </div>
        {user && (
          <div className="flex flex-row items-center gap-1">
            <img src="/user.png" alt="user" className="w-8" />
            <span className="w-full">{user.display_name}</span>
          </div>
        )}
      </header>

      <main className="flex flex-col p-24 h-screen items-center">
        <h1 className="text-3xl font-bold mb-6">🎶 Mis Playlists</h1>
        <div className="bg-gray-900 text-white p-4 rounded-lg w-96">
          {playlists.length > 0 ? (
            <ul className="space-y-4">
              {playlists.map((playlist) => (
                <li key={playlist.id} className="flex items-center space-x-4">
                  <img
                    src="/spotifyPink.png"
                    alt="playlist logo"
                    className="w-12 h-12 rounded-md"
                  />
                  <span className="flex flex-col">
                    <strong>{playlist.name}</strong>
                    <span>{playlist.description} </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col text-center items-center">
              <img src="/spotifyGreen.png" alt="logo" className="w-28" />
              <h1>
                <strong>No hay Playlist para mostrar aún</strong>
              </h1>
              <span>Comienza creando una</span>
            </div>
          )}
        </div>
      </main>
      {alertMessage && <AlertMessage message={alertMessage} />}
      {user && (
        <div className="flex flex-row justify-center bg-gray-900 text-white p-4 rounded-lg gap-7">
          <CreatePlaylistForm onCreatePlaylist={createPlaylist} />

          <EditPlaylistForm onUpdatePlaylist={updatePlaylist} />
        </div>
      )}
      {error && (
        <div>
          <p>
            There was an error when calling SpotifyApi with the following error
            message:
            <br />
            <code>{error}</code>
          </p>
        </div>
      )}
      {(!currentToken?.access_token || error) && (
        <>
          <p>Try getting a new token to connect with Spotify</p>
          <a
            href="/connectSpotify"
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
          >
            Get Spotify Token
          </a>
        </>
      )}
      <footer className="p-4 bg-gray-900 text-center">
        <p className="text-gray-500 text-sm">© 2024 Spotify by MetLab WeB 😉</p>
      </footer>
    </div>
  );
}
