import { Folder } from 'components/icons';
import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';
import SchemesData from 'utils/schemesData';

function ckanURL(slug) {
  return `https://ckan.civicdatalab.in/dataset/${slug}`;
}

const LinkWrapper = ({ type, link, children }) => {
  if (type == 'folder') {
    return (
      <Link href={`/resources/${link}`}>
        <a>{children}</a>
      </Link>
    );
  }
  return (
    <a href={ckanURL(link)} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
};

const icons = {
  ppt: '/assets/icons/ppt.png',
  docs: '/assets/icons/docs.png',
  xlsx: '/assets/icons/xlsx.png',
  folder: <Folder width={128} />,
};

const Card = ({ data }) => {
  
    const image_slug = {
    "pmfby-kharif-v3": "pmfby_kharif",
    "integrated-child-development-services-v3": "icds",
    "mgnrega-v3": "mgnrega",
    "mdm-v3": "mdm",
    "nhm-v3": "nhm",
    "national-social-assistance-programme-nsap-v3": "nsap",
    "pmay-v3": "pmay",
    "pmkisan-v3": "pmkisan",
    "pradhan-mantri-matru-vandana-yojana-scheme-pmmvy-v3": "pmmvy",
    "swachh-bharat-mission-gramin-sbmg-v3": "sbmg",
    "smsa-v3": "smsa",
    "pmfby-rabi-v3": "pmfby_rabi",
    "swachh-bharat-mission-urban-sbmu-v3" : "sbmu"
  }

  return (
    <LinkWrapper type={data.type} link={data.slug}>
      <Wrapper>
        <div>
          {data.icon == 'folder' ? (
            icons.folder
          ) : (
            <Image
              width={110}
              height={110}
               src={data.slug.includes('v3') ? SchemesData[image_slug[data.slug]]?.logo :icons[data.icon]}
              alt={`file format ${data.icon}`}
            />
          )}
        </div>
        <span>{data.title}</span>
        {data.type != 'folder' && (
          <span className="sr-only">external link</span>
        )}
      </Wrapper>
      
      
    </LinkWrapper>
  );
};

export { Card };

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
  background-color: #fff;
  border: 1px solid var(--color-grey-500);
  transition: border-color 150ms ease;

  height: 250px;

  > span {
    padding: 16px;
    text-decoration: none;
    display: block;
    width: 100%;
    text-align: center;
    border-radius: 6px;

    font-size: 0.875rem;
    font-weight: 500;
    transition: background-color 150ms ease;
  }

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  &:hover {
    border-color: var(--color-grey-400);

    > span {
      background-color: var(--color-grey-600);
    }
  }
`;
