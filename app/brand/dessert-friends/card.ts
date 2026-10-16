import { getCharacter, type DessertId, type Language } from "@/lib/dessert-friends/model";

function lines(context: CanvasRenderingContext2D, text: string, width: number) {
  const result: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && context.measureText(candidate).width > width) {
      result.push(line);
      line = word;
    } else line = candidate;
  }
  if (line) result.push(line);
  return result;
}

export async function createDessertCard(id: DessertId, lang: Language): Promise<Blob> {
  const character = getCharacter(id, lang);
  const image = new Image();
  image.src = character.image;
  await image.decode();
  await document.fonts.ready;

  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas unavailable");
  const font = getComputedStyle(document.body).getPropertyValue("--font-noto-kr").trim() || "sans-serif";
  const serif = getComputedStyle(document.body).getPropertyValue("--font-playfair").trim() || "Georgia";
  context.fillStyle = "#FAF7F2";
  context.fillRect(0, 0, 1080, 1350);
  context.strokeStyle = "#d8d3cb";
  context.lineWidth = 2;
  context.strokeRect(36, 36, 1008, 1278);
  context.textAlign = "center";
  context.fillStyle = "#0D0D0D";
  context.font = `bold 58px ${serif}`;
  context.fillText("Caffiend", 540, 116);
  context.fillStyle = "#174C35";
  context.font = `22px ${font}`;
  context.fillText(lang === "ko" ? "디저트에 사는 나와 닮은 친구" : "A little dessert friend, just like you", 540, 170);
  context.drawImage(image, 190, 205, 700, 700);
  context.fillStyle = "#0D0D0D";
  let titleSize = 62;
  do {
    context.font = `bold ${titleSize}px ${font}`;
    if (context.measureText(character.name).width <= 920) break;
    titleSize -= 2;
  } while (titleSize > 32);
  context.fillText(character.name, 540, 956);
  context.fillStyle = "#666666";
  context.font = `28px ${font}`;
  context.fillText(lang === "ko" ? `${character.menu}에 사는 작은 친구` : `A little friend who lives in ${character.menu}`, 540, 1008, 920);
  context.fillStyle = "#174C35";
  context.font = `30px ${font}`;
  lines(context, `“${character.quote}”`, 890).slice(0, 2).forEach((line, index) => {
    context.fillText(line, 540, 1082 + index * 42);
  });
  context.fillStyle = "#666666";
  context.font = `19px ${font}`;
  context.fillText(character.traits.join("  ·  "), 540, 1172, 920);
  context.strokeStyle = "#d8d3cb";
  context.beginPath();
  context.moveTo(170, 1210);
  context.lineTo(910, 1210);
  context.stroke();
  context.font = `22px ${font}`;
  context.fillText(lang === "ko" ? "나는 어떤 카피엔드 디저트일까?" : "Which Caffiend dessert am I?", 540, 1260);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Card creation failed")), "image/png");
  });
}
