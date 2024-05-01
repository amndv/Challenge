import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import { TiArrowLeft } from "react-icons/ti";

export default function Album() {
  const [photos, setPhotos] = useState<IAlbum[]>([]);
  const [loading, setLoading] = useState(true)
  const router = useRouter();
  const path = router.query.photos;

  const onInit = () => {
    console.log('lightGallery has been initialized');
  };

  useEffect(() => {
    console.log("id", path);

    const fetchData = async () => {
      try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/photos");
        const albumPhotos = response.data.filter((photo: IAlbum) => photo.albumId === Number(path));
        setPhotos(albumPhotos);
        setLoading(false)
        console.log("album photo", albumPhotos);

      } catch (error) {
        console.error("Error fetching photos:", error);
        setLoading(false)
      }
    };

    if (path) {
      fetchData();
    }
  }, [path]);

  return (
    <main className="flex min-h-screen flex-col justify-between p-5 md:p-20 overflow-hidden">
      <button className="text-left flex items-center mb-5 text-slate-500 hover:text-slate-800" onClick={() => router.back()}><TiArrowLeft /> Back </button>
      <div className="flex flex-col justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Photos for Album {path}</h1>
        <div className="grid grid-cols-2 items-center md:grid-cols-4 gap-2 gap-y-3 md:gap-6 md:gap-y-12">
          {photos.map((photo) => (
            <div key={photo.id} className="text-left h-60 md:h-[310px]">
              <LightGallery
                onInit={onInit}
                speed={500}
                plugins={[lgThumbnail, lgZoom]}
              >
                <a
                  href={photo.url}
                  className="group justify-between rounded-lg border border-transparent px-4 py-3 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={photo.thumbnailUrl} alt="Photo Thumbnail" className="m-auto w-full h-auto text-sm opacity-50" onError={(e) => {
                    (e.target as HTMLInputElement).src =
                      "https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Account-512.png";
                  }} />
                  <h3 className="text-sm  md:text-lg font-semibold">{photo.title.length > 20 ? photo.title.substring(0, 20) + '...' : photo.title}
                  </h3>
                  <p className="text-slate-500 text-xs  md:text-sm">{photo.id}</p>
                </a></LightGallery>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
