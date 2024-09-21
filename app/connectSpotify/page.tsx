"use client";
/* **
 * This is an example that performs
 * the Authorization Code with PKCE oAuth2 flow to authenticate
 * against the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
 */

import { useEffect, useState } from "react";
import { useSpotify } from "../hooks/use-spotify";
import { UserProfile } from "@spotify/web-api-ts-sdk";

const clientId = "a53ce1dc1eff4437a8fbe1956464a7f8"; // Test MetLab Web app clientId
const redirectUrl = "http://localhost:3000/connectSpotify";

const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope =
  "user-read-private user-read-email playlist-read-private playlist-modify-public playlist-modify-private";

const Connect = () => {
  const { currentToken, saveTokenToLocalStorage, updateTokenFromLocalStorage } =
    useSpotify();

  const [code, setCode] = useState<string | null>();

  const [userData, setUserData] = useState<UserProfile | null>();

  useEffect(() => {
    const args = new URLSearchParams(window.location.search);
    setCode(args.get("code"));
  }, []);

  useEffect(() => {
    const fetchToken = async (code: string) => {
      const token = await getToken(code);
      saveTokenToLocalStorage(token);
      updateTokenFromLocalStorage();
    };

    // If we find a code, we're in a callback, do a token exchange
    if (code) {
      fetchToken(code);

      // Remove code from URL so we can refresh correctly.
      const url = new URL(window.location.href);
      url.searchParams.delete("code");

      const updatedUrl = url.search ? url.href : url.href.replace("?", "");
      window.history.replaceState({}, document.title, updatedUrl);
    }
  }, [code]);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserData();
      setUserData(data);
    };
    // If we have a token, we're logged in, so fetch user data
    if (currentToken?.access_token) {
      fetchUserData();
    }
  }, [currentToken]);

  const redirectToSpotifyAuthorize = async () => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const randomValues = crypto.getRandomValues(new Uint8Array(64));
    const randomString = randomValues.reduce(
      (acc, x) => acc + possible[x % possible.length],
      ""
    );

    const code_verifier = randomString;
    const data = new TextEncoder().encode(code_verifier);
    const hashed = await crypto.subtle.digest("SHA-256", data);

    const code_challenge_base64 = btoa(
      String.fromCharCode.apply(null, Array.from(new Uint8Array(hashed)))
    )
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    window.localStorage.setItem("code_verifier", code_verifier);

    const authUrl = new URL(authorizationEndpoint);
    const params = {
      response_type: "code",
      client_id: clientId,
      scope: scope,
      code_challenge_method: "S256",
      code_challenge: code_challenge_base64,
      redirect_uri: redirectUrl,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
  };

  // Spotify API Calls
  const getToken = async (code: string) => {
    const code_verifier = localStorage.getItem("code_verifier") as string;

    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUrl,
        code_verifier: code_verifier,
      }),
    });

    return await response.json();
  };

  const getUserData = async () => {
    const response = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { Authorization: "Bearer " + currentToken?.access_token },
    });

    return await response.json();
  };

  const onLogout = async () => {
    localStorage.clear();
    window.location.href = redirectUrl;
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {!currentToken?.access_token && (
          <>
            <h1 className="text-5xl font-extrabold dark:text-white">
              Spotify API Connection
            </h1>
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              onClick={redirectToSpotifyAuthorize}
            >
              Connect your account
            </button>
          </>
        )}
        {currentToken?.access_token && userData && (
          <>
            <h1 className="text-5xl font-extrabold dark:text-white">
              Spotify API Connection
            </h1>
            <h2 className="text-4xl font-bold dark:text-white">
              Logged in as <span>{userData.display_name}</span>
            </h2>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <tbody>
                <tr>
                  <td className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                    Display name
                  </td>
                  <td>{userData.display_name}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 bg-gray-50 dark:bg-gray-800">Id</td>
                  <td>{userData.id}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                    Email
                  </td>
                  <td>{userData.id}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                    Link{" "}
                  </td>
                  <td>
                    <a href={userData.href}>{userData.href}</a>
                  </td>
                </tr>
              </tbody>
            </table>

            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              onClick={onLogout}
            >
              Log out
            </button>

            <h2 className="text-4xl font-bold dark:text-white">oAuth info</h2>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <tbody>
                <tr>
                  <td className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                    Access token
                  </td>
                  <td>{currentToken.access_token}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                    Refresh token
                  </td>
                  <td>{currentToken.refresh_token}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                    Expiration at
                  </td>
                  <td>{currentToken.expires}</td>
                </tr>
              </tbody>
            </table>

            <a
              href="/"
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Back to main
            </a>
          </>
        )}
      </main>
    </div>
  );
};

export default Connect;
