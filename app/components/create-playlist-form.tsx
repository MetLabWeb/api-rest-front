import { FormEvent } from "react";

export interface CreatePlaylistElements extends HTMLFormControlsCollection {
  name: HTMLInputElement;
  description: HTMLInputElement;
}

interface CreatePlaylistForm extends HTMLFormElement {
  readonly elements: CreatePlaylistElements;
}

export const CreatePlaylistForm = ({
  onCreatePlaylist,
}: {
  onCreatePlaylist: (name: string, description: string) => Promise<void>;
}) => {
  return (
    <div className="flex flex-col p-7 w-[400px]">
      <h2 className="text-2xl font-bold dark:text-white">Crear Playlist</h2>

      <form
        className="max-w-sm"
        onSubmit={(event: FormEvent<CreatePlaylistForm>) => {
          event.preventDefault();
          const name = event.currentTarget.elements.name.value;
          const description = event.currentTarget.elements.description.value;
          onCreatePlaylist(name, description);
        }}
      >
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
            placeholder="Nombre de la playlist"
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
            placeholder="Descripcion de la playlist"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="text-white bg-green-900 hover:bg-green-700 focus:ring-4 focus:outline-none focus:bg-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
          Submit
        </button>
      </form>
    </div>
  );
};
