import { useState } from "react";

const ImageGenerator = () => {
  const [imageSrc, setImageSrc] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    try {
      const scriptUrl =
        "https://script.google.com/macros/s/AKfycbwJQ_-I_vkv9fKID9WxZdN1A5eAl-bcQxqbvI4rKU9log_V2nR5vR3nNnz1h5diVLwb/exec";
      const response = await fetch(
        `${scriptUrl}?prompt=${encodeURIComponent(prompt)}`
      );
      const imageBase64 = await response.text();
      setImageSrc(`data:image/png;base64,${imageBase64}`);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Генератор изображений</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Введите описание изображения"
      />
      <button onClick={generateImage} disabled={loading}>
        {loading ? "Генерация..." : "Сгенерировать изображение"}
      </button>
      {imageSrc && <img src={imageSrc} alt="Generated" />}
    </div>
  );
};

export default ImageGenerator;
