import { FormEvent } from "react";
import { CreatePlaylistElements } from "./create-playlist-form";

interface UpdatePlaylistElements extends CreatePlaylistElements {
  id: HTMLInputElement;
}
interface UpdatePlaylistForm extends HTMLFormElement {
  readonly elements: UpdatePlaylistElements;
}

export const EditPlaylistForm = ({
  onUpdatePlaylist,
}: {
  onUpdatePlaylist: (
    id: string,
    name: string,
    description: string
  ) => Promise<void>;
}) => (
  <>
    <h2 className="text-4xl font-bold dark:text-white">Edit Playlist</h2>

    <form
      className="max-w-sm"
      onSubmit={(event: FormEvent<UpdatePlaylistForm>) => {
        event.preventDefault();
        const id = event.currentTarget.elements.id.value;
        const name = event.currentTarget.elements.name.value;
        const description = event.currentTarget.elements.description.value;
        onUpdatePlaylist(id, name, description);
      }}
    >
      <div className="mb-5">
        <label
          htmlFor="id"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Id
        </label>
        <input
          type="text"
          id="id"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="name"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="name for the playlist"
          required
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="description"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Description
        </label>
        <input
          type="text"
          id="description"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Submit
      </button>
    </form>
  </>
);
