import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { MdSearch } from "react-icons/md";

export default function Home() {
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchActive, setSearchActive] = useState<boolean>(false); // State untuk mengontrol keaktifan input pencarian
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/photos");
        const albumData: IAlbum[] = response.data.map((album: any) => ({
          albumId: album.albumId,
          id: album.id,
          title: album.title,
          url: album.url,
          thumbnailUrl: album.thumbnailUrl,
        }));
        const uniqueAlbums: IAlbum[] = [];

        albumData.forEach((album) => {
          const existingIndex = uniqueAlbums.findIndex((item) => item.albumId === album.albumId);
          if (existingIndex === -1) {
            uniqueAlbums.push(album);
          } else {
            uniqueAlbums[existingIndex] = album;
          }
        });

        setAlbums(uniqueAlbums);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching album data:", error);
      }
    };

    fetchData();
  }, []);

  const handleClick = (albumId: number) => {
    router.push(`${albumId}`);
  };

  const filteredAlbums = albums.filter((album) =>
    album.albumId.toString().includes(searchTerm)
  );

  return (
    <main className="min-h-screen p-5 md:p-20 overflow-hidden">
      <div className="flex justify-between mb-5 items-center">
        <h1 className="text-left text-lg md:text-3xl font-bold">Albums</h1>
        <div className="flex items-center">
          <MdSearch onClick={() => setSearchActive(true)} />
          {searchActive && (
            <input
              type="text"
              placeholder="Search by albumId"
              className="px-2 py-2 bg-transparent rounded-md focus:outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 gap-y-3 md:gap-6 md:gap-y-12 h-[70vh] overflow-y-scroll scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
        {filteredAlbums.map((album, index) => (
          <div key={index} className="text-left h-60 md:h-[310px]">
            <a
              onClick={() => handleClick(album.albumId)}
              className="group rounded-lg border border-transparent px-4 py-3 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 block cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={album.thumbnailUrl}
                alt="Album Thumbnail"
                className="m-auto w-full h-auto text-sm opacity-50"
                onError={(e) => {
                  (e.target as HTMLInputElement).src =
                    "https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Account-512.png";
                }}
              />
              <h3 className="mb-3 md:text-lg text-sm font-medium">
                {album.title.length > 20 ? album.title.substring(0, 20) + '...' : album.title}
              </h3>
              <p className="text-slate-500 text-sm">{album.albumId}</p>
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
