import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, name = "Moonlit Salon & Spa", type = "website", url = "https://moonlitbeautyhub.netlify.app", image = "https://moonlitbeautyhub.netlify.app/og-image.jpg" }) => {
  return (
    <Helmet>
      {}
      <title>{title ? `${title} | ${name}` : name}</title>
      <meta name="description" content={description || "Premium Salon & Spa services for the modern aesthetic."} />

      {}
      <meta property="og:title" content={title ? `${title} | ${name}` : name} />
      <meta property="og:description" content={description || "Premium Salon & Spa services for the modern aesthetic."} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title ? `${title} | ${name}` : name} />
      <meta name="twitter:description" content={description || "Premium Salon & Spa services for the modern aesthetic."} />
      <meta name="twitter:image" content={image} />

      {}
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "BeautySalon",
            "name": "${name}",
            "image": "${image}",
            "url": "${url}",
            "telephone": "+15551234567",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "123 Serenity Avenue",
              "addressLocality": "Beverly Hills",
              "addressRegion": "CA",
              "postalCode": "90210",
              "addressCountry": "US"
            },
            "priceRange": "$$$",
            "description": "${description || "Premium Salon & Spa services for the modern aesthetic."}"
          }
        `}
      </script>
    </Helmet>
  );
};

export default SEO;
