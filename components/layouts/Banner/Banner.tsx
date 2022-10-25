import Image from 'next/image';
import styled from 'styled-components';
import { Button } from '@opub-cdl/design-system';
const Banner = ({ details }) => {
  return (
    <BannerWrapper
      className="banner"
      style={{ backgroundColor: details.color }}
    >
      <div className="banner__content">
        <h2 className="gradient-amazon">{details.heading}</h2>
        <div className="gradient1-amazon">{details.content}</div>
        <Button
          css={{
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(162.85deg, #8A9BE5 0%, #212740 99.48%)',
            color: 'linear-gradient(162.85deg, #8A9BE5 0%, #212740 99.48%)',
          }}
          
        >
          Open District Factsheet
        </Button>
      </div>
      <figure>
         <Image src={'/Vector.svg'} width={130} height={120} alt="" /> 
      </figure>
    </BannerWrapper>
  );
};

export default Banner;

export const BannerWrapper = styled.section`
  isolation: isolate;
  padding: 40px 60px 48px;
  border-radius: 4px;
  position: relative;
  background-color: var(--color-background-lighter);
  filter: drop-shadow(var(--box-shadow-1));
  margin-top:30px;

  .gradient1-amazon {
    margin-bottom:20px;
  }

  .banner__content {
    width: clamp(250px, 100%, 720px);
    z-index: 10;

    h2 {
      font-weight: 900;
      font-size: 1.5rem;
    }

    > div {
      margin-top: 16px;
    }
  }

  figure {
    position: absolute;
    right: 55px;
    top: 55px;
    z-index: -1;

    @media (max-width: 720px) {
      display: none;
    }
  }

  p {
    line-height: 1.5;
    margin-top: 0.5rem;
    font-weight: 500;
  }

  a {
    text-decoration: none;
    font-weight: 600;
  }
`;
