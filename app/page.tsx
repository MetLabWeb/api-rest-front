"use client";

import { useSpotify } from "./components/use-spotify";
import Image from "next/image";
import { useApiData } from "./components/use-api-data";
import { CreatePlaylistForm } from "./components/create-playlist-form";
import { EditPlaylistForm } from "./components/edit-playlist-form";
import { AlertMessage } from "./components/alert-message";

//Mocks for testing UI
const playlistsMock = [
  {
    name: "Playlist name",
    description: "Playlist description",
    id: "62fG6pYOq4IMNieCKYFNfn",
  },
  {
    name: "Playlist name",
    description: "Playlist description",
    id: "62fG6pYOq4IMNieCKYFNfn",
  },
  {
    name: "Playlist name",
    description: "Playlist description",
    id: "62fG6pYOq4IMNieCKYFNfn",
  },
];
const userMock = {
  id: "12345666666",
  display_name: "MetLab Web",
};

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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          src={"/metlabweb-logo.png"}
          alt="MetLab Web"
          width={200}
          height={200}
        />
        <h1 className="text-5xl font-extrabold dark:text-white">
          Playing with Spotify API
        </h1>

        {currentToken?.access_token && (
          <>
            {user && (
              <>
                <h2 className="text-4xl font-bold dark:text-white">
                  👤 My User
                </h2>

                <p>Name: {user.display_name}</p>
                <p>Id: {user.id}</p>
                <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
              </>
            )}
            {playlists.length > 0 && (
              <>
                <h2 className="text-4xl font-bold dark:text-white">
                  🎶 My Playlists
                </h2>

                <ul>
                  {playlists.map((p) => {
                    return (
                      <li className="block max-w-sm mb-4 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <p>Name: {p.name} </p>
                        <p>Description: {p.description} </p>
                        <p>Id: {p.id} </p>
                      </li>
                    );
                  })}
                </ul>
                <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
              </>
            )}

            {alertMessage && <AlertMessage message={alertMessage} />}
            {user && (
              <>
                <CreatePlaylistForm onCreatePlaylist={createPlaylist} />

                <EditPlaylistForm onUpdatePlaylist={updatePlaylist} />
              </>
            )}
          </>
        )}
        {error && (
          <div>
            <p>
              There was an error when calling SpotifyApi with the following
              error message:
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
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Get Spotify Token
            </a>
          </>
        )}
      </main>
    </div>
  );
}
