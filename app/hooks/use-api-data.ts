import { useEffect, useState } from "react";
import { Playlist, User } from "@spotify/web-api-ts-sdk";

export const useApiData = (accessToken?: string | null) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  //Access token header required for Spotify to work
  const requestDefaultOptions = () => ({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  useEffect(() => {
    //https://developer.spotify.com/documentation/web-api/reference/get-a-list-of-current-users-playlists
    async function fetchPlaylists() {}

    //https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
    async function fetchUser() {}

    if (accessToken) {
      fetchPlaylists();
      fetchUser();
    }
  }, [accessToken]);

  //https://developer.spotify.com/documentation/web-api/reference/create-playlist
  const createPlaylist = async (name: string, description: string) => {
    const body = {
      name,
      description,
      public: true,
    };
  };

  //https://developer.spotify.com/documentation/web-api/reference/change-playlist-details
  const updatePlaylist = async (
    id: string,
    name: string,
    description: string
  ) => {
    const body = {
      name,
      description,
    };
  };

  return {
    playlists,
    user,
    error,
    createPlaylist,
    updatePlaylist,
    alertMessage,
  };
};
