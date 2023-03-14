const random = (min, max) => Math.round(Math.random() * (max - min) + min);

const getRandomColor = () =>
  `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;

const getStorageItem = (key) => {
  const value = localStorage.getItem(key);
  return value && JSON.parse(value);
};

const setStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const ButtonRandomColor = (saveColors) => {
  const element = document.createElement('button');
  element.id = 'button-random-color';
  element.innerText = 'Cores aleatórias';

  element.addEventListener('click', () => {
    document.querySelectorAll('.color').forEach((item, index) => {
      const color = index === 0 ? 'black' : getRandomColor();
      const eslint = item;
      eslint.style.backgroundColor = color;
      saveColors(index, color);
    });
  });

  return element;
};

const Color = (color) => {
  const element = document.createElement('div');
  element.classList.add('color');
  element.style.backgroundColor = color;

  return element;
};

const PaletteColor = () => {
  const element = document.createElement('div');
  element.id = 'color-palette';
  const colors = getStorageItem('colorPalette') || [
    'black',
    'purple',
    'orange',
    'green',
  ];

  colors.forEach((color) => element.appendChild(Color(color)));

  const handleChangeColor = (index, color) => {
    colors[index] = color;
    setStorageItem('colorPalette', colors);
  };

  element.appendChild(ButtonRandomColor(handleChangeColor));
  return element;
};

const Cell = (index) => {
  const element = document.createElement('div');
  element.classList.add('pixel');
  element.style.backgroundColor = 'white';
  element.id = `cell-${index}`;
  return element;
};

const Board = () => {
  const element = document.createElement('div');
  element.id = 'pixel-board';
  const rows = Array.from({ length: 5 });
  const lines = Array.from({ length: 5 });

  rows.forEach((_, rowIndex) => {
    const row = document.createElement('div');
    row.classList.add('row');
    element.appendChild(row);
    lines.forEach((__, lineIndex) => {
      row.appendChild(Cell(rowIndex * rows.length + lineIndex));
    });
  });

  return element;
};

document.body.appendChild(PaletteColor());
document.body.appendChild(Board());
