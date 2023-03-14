const random = (min, max) => Math.random() * (max - min) + min;

const ButtonRandomColor = () => {
  const element = document.createElement('button');
  element.id = 'button-random-color';
  element.innerText = 'Cores aleatórias';

  element.addEventListener('click', () => {
    const getRandomColor = () =>
      `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
    document.querySelectorAll('.color').forEach((item, index) => {
      const eslint = item;
      eslint.style.backgroundColor = index === 0 ? 'black' : getRandomColor();
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
  const colors = ['black', 'purple', 'orange', 'green'];

  colors.forEach((color) => {
    element.appendChild(Color(color));
  });

  element.appendChild(ButtonRandomColor());
  return element;
};

document.body.appendChild(PaletteColor());
