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
        const datos = await data.json();
        console.log("datos", datos);
        setPlaylists(datos.items);
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
    const userId = user?.id;
    const response = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: "POST",
        body: JSON.stringify(body),
        ...requestDefaultOptions(),
      }
    );

    if (response.ok) {
      setAlertMessage("Playlist creada correctamente");
      const newPlaylist = await response.json();
      setPlaylists((prevData) => [...prevData, newPlaylist]);
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
      method: "PUT",
      body: JSON.stringify(body),
      ...requestDefaultOptions(),
    });
    if (response.ok) {
      setAlertMessage("Playlist editada correctamente");
      setPlaylists((prevData) => {
        const updatedList = prevData.map((p) => {
          if (p.id === id) {
            return { ...p, ...body };
          }
          return p;
        });
        return updatedList;
      });
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
