import useSWR from 'swr';
import fscreen from 'fscreen';

export function sectionCollapse(e: any, wrapperRef) {
  const btn = e.target;

  const target = btn.nextElementSibling;
  const expanded = btn.getAttribute('aria-expanded') === 'true';

  const selectedBtn = wrapperRef.current.querySelector(
    '[aria-expanded = "true"]'
  );
  if (selectedBtn && !expanded) {
    selectedBtn.setAttribute('aria-expanded', 'false');
    (selectedBtn.nextElementSibling as HTMLElement).hidden = true;
  }

  btn.setAttribute('aria-expanded', !expanded);
  target.hidden = expanded;
}

export function truncate(str, num) {
  if (str.length > num) {
    return str.slice(0, num) + '...';
  } else {
    return str;
  }
}

export function debounce(func, timeout = 1000) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

// function to create tabbed interface
export function tabbedInterface(tablist, panels) {
  // Get relevant elements and collections
  const tabs = tablist.querySelectorAll('a');

  // The tab switching function
  const switchTab = (oldTab, newTab) => {
    newTab.focus();
    // Make the active tab focusable by the user (Tab key)
    newTab.removeAttribute('tabindex');
    // Set the selected state
    newTab.setAttribute('aria-selected', 'true');
    oldTab.removeAttribute('aria-selected');
    oldTab.setAttribute('tabindex', '-1');
    // Get the indices of the new and old tabs to find the correct
    // tab panels to show and hide
    let index = Array.prototype.indexOf.call(tabs, newTab);
    let oldIndex = Array.prototype.indexOf.call(tabs, oldTab);
    panels[oldIndex].hidden = true;
    panels[index].hidden = false;
  };

  // Add the tablist role to the first <ul> in the .tabbed container
  tablist.setAttribute('role', 'tablist');

  // Add semantics are remove user focusability for each tab
  Array.prototype.forEach.call(tabs, (tab, i) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('id', 'tab' + (i + 1));
    tab.setAttribute('tabindex', '-1');
    tab.parentNode.setAttribute('role', 'presentation');

    // Handle clicking of tabs for mouse users
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      let currentTab = tablist.querySelector('[aria-selected]');
      if (e.currentTarget !== currentTab) {
        switchTab(currentTab, e.currentTarget);
      }
    });

    // Handle keydown events for keyboard users
    tab.addEventListener('keydown', (e) => {
      // Get the index of the current tab in the tabs node list
      let index = Array.prototype.indexOf.call(tabs, e.currentTarget);
      // Work out which key the user is pressing and
      // Calculate the new tab's index where appropriate
      let dir =
        e.which === 37
          ? index - 1
          : e.which === 39
          ? index + 1
          : e.which === 40
          ? 'down'
          : null;
      if (dir !== null) {
        e.preventDefault();
        // If the down key is pressed, move focus to the open panel,
        // otherwise switch to the adjacent tab
        dir === 'down'
          ? panels[i].focus()
          : tabs[dir]
          ? switchTab(e.currentTarget, tabs[dir])
          : void 0;
      }
    });
  });

  // Add tab panel semantics and hide them all
  Array.prototype.forEach.call(panels, (panel, i) => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('tabindex', '-1');
    panel.setAttribute('aria-labelledby', tabs[i].id);
    panel.hidden = true;
  });

  // Initially activate the first tab and reveal the first tab panel
  tabs[0].removeAttribute('tabindex');
  tabs[0].setAttribute('aria-selected', 'true');
  panels[0].hidden = false;
}

// if no function is provided, id would be used a fetch url
export function swrFetch(id, func = null, param = null) {
  const fetcher = (arg: any, ...args: any) =>
    fetch(arg, ...args).then((res) => res.json());

  const customFetcher = (url: string) => (param ? func(...param) : func());

  const { data, error } = useSWR(id, func ? customFetcher : fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

// find the value of the key of an object case insensitively
export function getParameterCaseInsensitive(
  object: any,
  key: string | number
) {
  const asLowercase = key.toString().toLowerCase();
  return object[
    Object.keys(object).find((k) => k.toLowerCase() === asLowercase)
  ];
}

export function sortArrayOfObj(obj: any, key: string | number) {
  if (obj[0] && obj[0][key])
    return [...obj].sort(
      (a: { [x: string]: number }, b: { [x: string]: number }) =>
        a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0
    );
  return obj;
}

export function handleArrOfObjSearch(query, list) {
  let newList = [];

  if (query.length > 0) {
    list?.forEach((obj) => {
      const filteredCons = obj.children.filter((item) =>
        item.district.toLowerCase().includes(query.toLowerCase())
      );
      if (filteredCons.length) {
        newList.push({ char: obj.char, children: filteredCons });
      }
    });

    return newList;
  } else return list;
}

export function groupListByAlphabets(list: [], key: string) {
  const groupedObj = list.reduce((acc: any, current: any) => {
    // get the first character
    const char = current[key][0];

    // if there is no property by that character, create it
    if (!acc[char]) acc[char] = { char, children: [current] };
    // otherwise push the current element in respective field
    else acc[char].children.push(current);

    return acc;
  }, {});

  // return the values of new Object as array
  return Object.values(groupedObj);
}

export function fullScreenMode(id: string) {
  const wrapper = document.getElementById(id);

  if (fscreen.fullscreenElement !== null) {
    fscreen.exitFullscreen();
  } else {
    wrapper.style.overflowY = 'auto';
    if (wrapper) fscreen.requestFullscreen(wrapper);
  }
}

export function capitalize(str) {
  return str
    .toLowerCase()
    .replaceAll('-', ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
