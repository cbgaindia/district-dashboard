import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import MobileNav from './MobileNav';
import { IconDropdown, ArrowTail } from 'components/icons';
import styled from 'styled-components';
import { submenuHover, submenuClick } from './navbar.helper';
import { Button } from '@opub-cdl/design-system';

const Nav = ({ data }) => {
  const router = useRouter();

  // shows and hides the submenu on hover and focus
  useEffect(() => {
    var menuItems = document.querySelectorAll('li.has-submenu');
    let timer;
    submenuHover(menuItems, timer);
  }, []);

  return (
    <>
      <NavbarWrapper>
        <div className="container">
          <Logo className={data.logo && 'header__logo'}>
            <Link href="/">
              <a>
                {data.logo ? (
                  <Image
                    className="logo"
                    src={data.logo}
                    alt={`${data.site} logo`}
                    width={220}
                    height={46}
                  ></Image>
                ) : (
                  <h1>{data.site || 'District Dashboard'}</h1>
                )}
              </a>
            </Link>

            <Separator />

            <a
              className="obi"
              rel="noopener noreferrer"
              href="https://openbudgetsindia.org/"
            >
              <Image
                src="/assets/icons/obi_header.png"
                alt="Open Budgets India"
                layout="fixed"
                width={201}
                height={28}
              />
            </a>
          </Logo>

          <Navlinks>
            <h2 className="sr-only">Navigation menu</h2>
            <ul>
              {data.links &&
                data.links.map((navItem: any, index: number) => {
                  return (
                    <li
                      key={`menu-${index}`}
                      className={navItem.submenu && 'has-submenu'}
                    >
                      {navItem.submenu ? (
                        <>
                          <Navitem
                            onClick={(e) => submenuClick(e)}
                            aria-haspopup="true"
                            aria-expanded="false"
                            as="button"
                          >
                            {navItem.name} <IconDropdown width={24} />
                          </Navitem>
                          {navItem.submenu.length > 0 && (
                            <ul>
                              {navItem.submenu.map((item, num) => (
                                <li
                                  key={`sub-${index}-${num}`}
                                  className="submenu-item"
                                >
                                  <Link href={item.link}>
                                    <a>
                                      {item.name}
                                      <ArrowTail width={24} height={24} />
                                    </a>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      ) : (
                        <Link
                          key={`navItemDesktop-${index}`}
                          href={navItem.link}
                          passHref
                        >
                          <Navitem
                            className={
                              router.pathname.includes(
                                navItem.link.split('?')[0]
                              ) && 'active'
                            }
                          >
                            {navItem.name}
                          </Navitem>
                        </Link>
                      )}
                    </li>
                  );
                })}
              <Navitem
                aria-haspopup="true"
                aria-expanded="false"
                as="button"
              >
                <Button
                  css={{
                    display: 'flex',
                    alignItems: 'center',
                    color:'white',
                    background:'#DE7992',
                    
                  }}
                  variant={'link'}
                >
                  District Factsheets
                </Button>
              </Navitem>
            </ul>
          </Navlinks>
        </div>
      </NavbarWrapper>
      <MobileNav data={data} />
    </>
  );
};

export default Nav;

export const NavbarWrapper = styled.header`
  background-color: var(--nav-bg);
  color: var(--text-dark-high);
  padding: 13px;

  @media (max-width: 1096px) {
    display: none;
  }

  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
  }

  a {
    text-decoration: none;
  }

  .header__logo {
    font-size: 0;

    .logo {
      object-fit: contain;
      vertical-align: bottom;
    }
  }

  h1 {
    font-weight: 700;
    font-size: 1.5rem;
    line-height: 1.5;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;

  .obi {
    margin-top: 8px;
  }
`;

const Separator = styled.span`
  border-right: 1px solid rgba(255, 255, 255, 0.4);
  margin: 0 16px;
  height: 28px;
`;

const Navlinks = styled.nav`
  position: relative;

  > ul {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .has-submenu {
    position: relative;

    &.open {
      ul {
        display: block;
        isolation: isolate;
        z-index: 1;
      }
    }
  }
`;

const Navitem = styled.a`
  padding: 8px;
  align-items: center;
  display: flex;
  color: var(--text-dark-high);
  transition: background-color 200ms ease;
  width: max-content;

  &:hover {
    background-color: var(--nav-bg-hover);
    text-decoration: underline;
  }

  &.active {
    box-shadow: inset 0 -2px 0 0 #fff;
    font-weight: 500;

    @media (max-width: 1096px) {
      box-shadow: inset 3px 0 0 0 #fff;
    }
  }

  svg {
    fill: var(--text-dark-high);
    pointer-events: none;
  }

  & + ul {
    position: absolute;
    top: 160%;
    right: 0;
    background-color: var(--nav-submenu);
    padding: 8px;
    width: max-content;
    border-radius: 4px;
    min-width: 210px;
    display: none;

    &::before {
      content: '';
      display: inline-block;
      position: absolute;
      border-left: 14px solid transparent;
      border-right: 14px solid transparent;
      border-bottom: 17px solid var(--nav-submenu);
      top: -10px;
      right: 5px;
    }

    li {
      margin-top: 4px;
      transition: background-color 200ms ease;
      border-radius: 4px;

      &:first-child {
        margin-top: 0;
      }

      &:hover {
        background-color: var(--nav-submenu-hover);
      }
    }

    a {
      text-decoration: underline;
      line-height: 1.5;
      padding: 4px 8px 4px 12px;
      color: var(--text-dark-high);
      fill: var(--text-dark-high);
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-decoration-color: transparent;

      &:hover {
        text-decoration-color: inherit;
      }
    }
  }
`;
