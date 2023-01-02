import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { ArrowTail, Cross, Hamburger } from 'components/icons';
import styled from 'styled-components';
import { Button } from 'components/actions/Button';
import Modal from 'components/actions/Modal';
import { sectionCollapse } from 'utils/helper';

const MobileNav = ({ data }) => {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const menuBtnRef = useRef(null);
  const menuRef = useRef(null);
  const router = useRouter();

  // opening / closing mobile navbar
  function mobileNavHandler() {
    menuBtnRef.current.setAttribute('aria-expanded', !navIsOpen);
    setNavIsOpen(!navIsOpen);
  }

  return (
    <>
      <MobileHeader>
        <div className="container">
          <Button
            passRef={menuBtnRef}
            icon={<Hamburger />}
            iconOnly
            kind="custom"
            aria-expanded="false"
            onClick={mobileNavHandler}
          >
            open menu
          </Button>

          <div className={data.logo && 'header__logo'}>
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
          </div>
        </div>
      </MobileHeader>

      <Modal
        isOpen={navIsOpen}
        modalHandler={mobileNavHandler}
        label="mobile menu"
        from="left"
      >
        <MobileNavWrapper>
          <MenuHeader>
            <h2 id="mobileMenu">Menus</h2>
            <Button
              icon={<Cross />}
              iconOnly
              kind="custom"
              onClick={mobileNavHandler}
            >
              close menu
            </Button>
          </MenuHeader>

          <ul ref={menuRef}>
            {data.links &&
              data.links.map((navItem: any, index: number) => (
                <li key={`navItemMobile-${index}`}>
                  {navItem.submenu ? (
                    <>
                      <MenuItem
                        as="button"
                        type="button"
                        aria-expanded="false"
                        onClick={(e) => sectionCollapse(e, menuRef)}
                      >
                        {navItem.name}
                      </MenuItem>
                      <SubMenu hidden>
                        {navItem.submenu.length > 0 && (
                          <ul>
                            {navItem.submenu.map((item, num) => (
                              <li
                                key={`sub-${index}-${num}`}
                                className="submenu-item"
                              >
                                <Link href={item.link}>
                                  <a onClick={mobileNavHandler}>
                                    {item.name}
                                    <ArrowTail width={24} height={24} />
                                  </a>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </SubMenu>
                    </>
                  ) : (
                    <MenuItem
                      href={navItem.link}
                      onClick={mobileNavHandler}
                      className={`navbar__item ${
                        router.pathname.includes(navItem.link)
                          ? 'navbar__item--active'
                          : ''
                      }`}
                    >
                      {navItem.name}
                    </MenuItem>
                  )}
                </li>
              ))}
          </ul>
        </MobileNavWrapper>
      </Modal>
    </>
  );
};

export default MobileNav;

export const MobileHeader = styled.header`
  display: none;
  align-items: center;
  background-color: var(--nav-bg);

  @media (max-width: 1096px) {
    display: block;
  }

  > div {
    display: flex;
    padding-block: 16px;
    justify-content: flex-start;
    align-items: center;
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
    font-weight: 600;
    font-size: 1rem;
    color: var(--text-dark-high);
  }

  button {
    margin-right: 8px;
    color: var(--text-dark-high);
  }

  .mb-cta {
    justify-self: flex-end;

    @media (max-width: 480px) {
      display: none;
    }
  }
`;

export const MobileNavWrapper = styled.nav`
  background-color: var(--nav-mobile);
  color: var(--text-dark-high);
  height: 100%;

  a {
    text-decoration: none;
  }

  button {
    color: var(--text-dark-high);
  }

  @media (max-width: 480px) {
    min-width: 248px;
  }
`;

export const MenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--nav-bg-hover);
  height: 4rem;
  padding-left: 1.5rem;

  button {
    height: 100%;
    width: 4rem;
    font-size: 1.5rem;
  }
`;

export const MenuItem = styled.a`
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  line-height: 2rem;

  &:hover,
  &:focus-visible {
    background-color: var(--nav-bg-hover);
  }

  &[type='button'] {
    &::after {
      border-bottom: 2px solid #0b0c0c;
      border-bottom-color: rgb(11, 12, 12);
      border-right: 2px solid #0b0c0c;
      border-right-color: rgb(11, 12, 12);
      content: ' ';
      display: inline-block;
      height: 8px;
      margin: 0 2px 0 1rem;
      transform: translateY(-35%) rotate(45deg);
      vertical-align: middle;
      width: 8px;
      border-color: var(--color-white);
      transition: transform 300ms ease;
    }
  }

  &[aria-expanded='true'] {
    background-color: var(--nav-bg-hover);

    &::after {
      transform: rotate(-135deg);
    }

    & + ul {
      background-color: var(--nav-bg-hover);
      padding-bottom: 1rem;
    }
  }
`;

export const SubMenu = styled.ul`
  width: 100%;

  a {
    padding: 1rem 1.5rem;
    display: block;
    padding-left: 2rem;
    display: flex;
    justify-content: space-between;
  }

  svg {
    fill: var(--text-dark-high);
    transform: rotate(180deg);
  }
`;
