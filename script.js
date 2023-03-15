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

const getSelectedColor = () =>
  document.querySelector('.selected').style.backgroundColor;

const generateEmptyTable = (size) =>
  Array.from({ length: size }, () =>
    Array.from({ length: size }, () => 'white'));

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

  element.addEventListener('click', () => {
    document.querySelectorAll('.color').forEach((item) => {
      item.classList.remove('selected');
    });

    element.classList.add('selected');
  });

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

const Cell = (index, color, saveCellColor) => {
  const element = document.createElement('div');
  element.classList.add('pixel');
  element.style.backgroundColor = color;
  element.id = `cell-${index}`;

  element.addEventListener('click', () => {
    const selectedColor = getSelectedColor();
    element.style.backgroundColor = selectedColor;
    saveCellColor(selectedColor);
  });

  return element;
};

const createBoard = (table) => {
  const handleChangeCellColor = (i, j) => (color) => {
    const eslint = table;
    eslint[i][j] = color;
    setStorageItem('pixelBoard', table);
  };
  console.log(table);
  return table.map((row, i) => {
    const element = document.createElement('div');
    element.classList.add('row');
    row.forEach((color, j) => {
      element.appendChild(
        Cell(i * table.length + j, color, handleChangeCellColor(i, j)),
      );
    });

    return element;
  });
};

const Board = () => {
  const element = document.createElement('div');
  element.id = 'pixel-board';

  const table = getStorageItem('pixelBoard') || generateEmptyTable(5);

  createBoard(table).forEach((item) => {
    console.log(item.children[0]);
    return element.appendChild(item);
  });

  return element;
};

document.body.appendChild(PaletteColor());
document.body.appendChild(Board());

document.querySelector('.color').classList.add('selected');
