import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import SchemesData from 'utils/schemesData';

const SchemeCard = ({ data }) => {
  const { query, pathname } = useRouter();

  return (
    <Card>
      <Link
        href={{
          pathname,
          query: { ...query, scheme: data.scheme_slug },
        }}
        // shallow
        // replace
      >
        <a>
          <figure>
            {SchemesData[data.scheme_slug] ? (
              <Image
                src={SchemesData[data.scheme_slug].logo}
                alt=""
                width={88}
                height={88}
                className="img-contain"
              />
            ) : null}
          </figure>
          <h3>{data.scheme_name}</h3>
        </a>
      </Link>
    </Card>
  );
};

export default SchemeCard;

const Card = styled.li`
  a {
    background-color: var(--color-background-lighter);
    padding: 8px 8px 16px;
    min-height: 224px;
    border-radius: 4px;
    box-shadow: var(--box-shadow-1);
    display: block;
    text-decoration-color: transparent;
    transition: box-shadow 200ms ease-in-out,
      text-decoration-color 200ms ease-in-out;

    &:hover {
      box-shadow: var(--box-shadow-hover);
      text-decoration-color: currentColor;
    }
  }

  figure {
    background-color: var(--color-grey-600);
    display: grid;
    place-content: center;
    padding-block: 12px;
  }

  h3 {
    font-weight: 600;
    text-align: center;
    font-size: 1rem;
    margin-top: 16px;
  }
`;
