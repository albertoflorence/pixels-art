const random = (min, max) => Math.round(Math.random() * (max - min) + min);

const getRandomColor = () =>
  `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;

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

const Cell = (color, saveCellColor) => {
  const element = document.createElement('div');
  element.classList.add('pixel');
  element.style.backgroundColor = color;

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
  return table.map((row, i) => {
    const element = document.createElement('div');
    element.classList.add('row');
    row.forEach((color, j) => {
      element.appendChild(Cell(color, handleChangeCellColor(i, j)));
    });

    return element;
  });
};

const Board = () => {
  const element = document.createElement('div');
  element.id = 'pixel-board';

  return [
    element,
    (array) => {
      element.innerHTML = '';
      createBoard(array).forEach((item) => element.appendChild(item));
    },
  ];
};

const ButtonClearBoard = (changeTable) => {
  const element = document.createElement('button');
  element.id = 'clear-board';
  element.innerText = 'Limpar';

  element.addEventListener('click', () => {
    changeTable(generateEmptyTable(5));
  });

  return element;
};

const InputBoardSize = () => {
  const element = document.createElement('input');
  element.id = 'board-size';
  element.type = 'number';
  element.min = 1;
  element.max = 25;

  return element;
};

const ButtonVQV = (changeTable) => {
  const element = document.createElement('button');
  element.id = 'generate-board';
  element.innerText = 'VQV';

  element.addEventListener('click', () => {
    const input = document.querySelector('#board-size');
    const value = parseInt(input.value, 10);
    if (!value || value < 1 || value > 25) {
      window.alert('Board inválido!');
      return;
    }

    changeTable(generateEmptyTable(value));
  });

  return element;
};

const [board, changeTable] = Board();

changeTable(getStorageItem('pixelBoard') || generateEmptyTable(5));

document.body.appendChild(PaletteColor());
document.body.appendChild(ButtonClearBoard(changeTable));
document.body.appendChild(InputBoardSize());
document.body.appendChild(ButtonVQV(changeTable));
document.body.appendChild(board);

document.querySelector('.color').classList.add('selected');
