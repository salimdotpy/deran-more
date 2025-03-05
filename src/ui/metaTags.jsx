import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useDidMount } from "../hooks";
import { fetchSetting } from "../utils";

const MetaTags = () => {
    const [images, setImages] = useState(null);
    const [seo, setSeo] = useState(null);
    const didMount = useDidMount();
    const fetchData = async () => {
        const snapshot = await fetchSetting('seo.data');
        setSeo(snapshot);
        const snapshot2 = await fetchSetting('logo_favicon.image');
        setImages(snapshot2);
    };

    useEffect(() => {
        fetchData();
        return ()=>{
            setContent(null);
            setElements(null);
        }
    }, []);

  if (!images || !seo) return null; // Prevent rendering if no data

  return (
    <Helmet>
      <title>{metaData.title}</title>
      <meta name="description" content={metaData.description} />
      <meta name="keywords" content={metaData.keywords} />
      <link rel="manifest" href="https://deran-moresite.vercel.app/manifest.json" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={seo?.social_title} />
      <meta property="og:description" content={seo?.social_description} />
      <meta property="og:keywords" content={seo?.keywords} />
      <meta property="og:image" content={seo?.image} />
      <meta property="og:image:width" content={800} />
      <meta property="og:image:height" content={600} />
      <meta property="og:image:alt" content={seo?.social_description} />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo?.social_title} />
      <meta name="twitter:description" content={seo?.social_description} />
      <meta name="twitter:image" content={seo?.image} />
      <meta name="twitter:image:width" content={800} />
      <meta name="twitter:image:height" content={600} />
      <meta name="twitter:image:alt" content={seo?.social_description} />

      {/* Favicon & Viewport */}
      <link rel="icon" type="image/svg+xml" href={images?.favicon} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
    </Helmet>
  );
};

export default MetaTags;
