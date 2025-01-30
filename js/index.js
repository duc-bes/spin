import { Wheel } from '../../../dist/spin-wheel-esm.js';
import { loadFonts, loadImages } from '../../../scripts/util.js';
import { props } from './props.js';
import * as easing from '../../../scripts/easing.js';

window.onload = async () => {

  await loadFonts(props.map(i => i.itemLabelFont));

  const wheel = new Wheel(document.querySelector('.wheel-wrapper'));
  // const dropdown = document.querySelector('select');

  const images = [];

  for (const p of props) {
    // Initalise dropdown with the names of each example:
    // const opt = document.createElement('option');
    // opt.textContent = p.name;
    // dropdown.append(opt);

    // Convert image urls into actual images:
    images.push(initImage(p, 'image'));
    images.push(initImage(p, 'overlayImage'));
    for (const item of p.items) {
      images.push(initImage(item, 'image'));
    }
  }

  // await loadImages(images);

  // Show the wheel once everything has loaded
  document.querySelector('.wheel-wrapper').style.visibility = 'visible';

  // // Handle dropdown change:
  // dropdown.onchange = () => {
  //   wheel.init({
  //     ...props[dropdown.selectedIndex],
  //     rotation: wheel.rotation, // Preserve value.
  //   });
  // };
  wheel.init({
    ...props[3],
    rotation: wheel.rotation, // Preserve value.
  });

  const resultSelector = document.querySelector('.result');
  wheel.onCurrentIndexChange = (evt) => {
    resultSelector.textContent = props[3].items[evt.currentIndex].label;
  };
  // // Select default:
  // dropdown.options[0].selected = 'selected';
  // dropdown.onchange();

  // Save object globally for easy debugging.
  window.wheel = wheel;

  const btnSpin = document.querySelector('button');
  let is50 = false;
  let is50Count = 0;
  resultSelector.onclick = () => {
    is50Count++;
    if (is50Count === 2) {
      is50 = true;
    }
  };

  window.addEventListener('click', (e) => {
    // Listen for click event on spin button:
    if (e.target === btnSpin) {
      let winningItemIdx = calcSpinToValues();
      if (is50) {
        winningItemIdx = [2, 6][Math.floor(Math.random() * 2)];
        is50Count = 0;
        is50 = false;
      }
      wheel.spinToItem(winningItemIdx, 5000, false, 2, 1, easing.cubicOut);
    }
  });

  function calcSpinToValues() {
    const ids = [];
    props[3].items.forEach((item, i) => {
      if (item.label === '$ 10' || item.label === '$ 20') {
        ids.push(i);
      }
    });
    const random = Math.floor(Math.random() * ids.length);

    return ids[random];
  }

  function initImage(obj, pName) {
    if (!obj[pName]) return null;
    const i = new Image();
    i.src = obj[pName];
    obj[pName] = i;
    return i;
  }

};