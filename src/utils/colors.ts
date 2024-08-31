import colors from "../assets/colors.json";

export const getRandomColor = () => {
  const colorKeys = Object.keys(colors);
  const randomIndex = Math.floor(Math.random() * colorKeys.length);
  const randomKey = colorKeys[randomIndex];
  return colors[randomKey];
};
