// Функція для розбору введеного тексту
export const parseText = (inputText) => {
  return inputText
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((item) => {
      return {
        dishName: item.split("\t")[0].replace(/ {2,}/g, " ").trim(),
        price: parseFloat(item.split("\t")[2].replace(",", ".")),
      };
    });
};
