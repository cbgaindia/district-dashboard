import Head from 'next/head';

const Seo: React.FC<{ seo?: any }> = ({ seo }) => {
  const title =
    seo && seo.title ? seo.title : 'District Dashboard | Open Budgets India';
  const description =
    seo && seo.description
      ? seo.description
      : 'Find downloadable data, visualisations and other useful information related to a number of schemes run by the Union and State GovernmentsFind downloadable data, visualisations and other useful information related to a number of schemes run by the Union and State Governments.';

  const url = `https://district.openbudgetsindia.org`;
  return (
    <>
      <Head>
        {title && (
          <>
            <title>{title}</title>
            <meta property="og:title" content={title} />
            <meta name="twitter:title" content={title} />
          </>
        )}
        {description && (
          <>
            <meta name="description" content={description} />
            <meta property="og:description" content={description} />
            <meta name="twitter:description" content={description} />
          </>
        )}
        {url && (
          <>
            <meta property="og:url" content={url} />
            <meta property="twitter:url" content={url} />
          </>
        )}

        {/* type */}
        <meta property="og:type" content="website" />
        <meta property="twitter:card" content="summary_large_image" />

        {/* Image */}
        <meta
          property="og:image"
          content={`${url}/assets/images/district_home.png`}
        />
        <meta
          property="twitter:image"
          content={`${url}/assets/images/district_home.png`}
        />

        <meta name="application-name" content="District Dashboard" />
      </Head>
      <div className="sr-only">
        <span id="maincontent">-</span>
      </div>
    </>
  );
};

export default Seo;
