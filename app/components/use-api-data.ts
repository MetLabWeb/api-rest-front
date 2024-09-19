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
    async function fetchPlaylists() {
      const data = await fetch(
        "https://api.spotify.com/v1/me/playlists",
        requestDefaultOptions()
      );
      if (data.ok) {
        const playlists = await data.json();
        setPlaylists(playlists.items);
      } else {
        const { error } = await data.json();
        setError(error.message);
      }
    }

    //https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
    async function fetchUser() {
      const data = await fetch(
        "https://api.spotify.com/v1/me",
        requestDefaultOptions()
      );

      if (data.ok) {
        const user = await data.json();
        setUser(user);
      } else {
        const { error } = await data.json();
        setError(error.message);
      }
    }

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
    const response = await fetch(
      `https://api.spotify.com/v1/users/${user?.id}/playlists`,
      {
        ...requestDefaultOptions(),
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      const newPlaylist = await response.json();
      setPlaylists((prevData) => [...prevData, newPlaylist]);
      setAlertMessage("Playlist created");
      setTimeout(() => {
        setAlertMessage(null);
      }, 2000);
    }
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
    const response = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
      ...requestDefaultOptions(),
      method: "PUT",
      body: JSON.stringify(body),
    });

    if (response.ok) {
      setPlaylists((prevData) => {
        const updatedList = prevData.map((p) => {
          if (p.id === id) {
            return { ...p, ...body };
          }
          return p;
        });
        return updatedList;
      });
      setAlertMessage("Playlist updated");
      setTimeout(() => {
        setAlertMessage(null);
      }, 2000);
    }
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
