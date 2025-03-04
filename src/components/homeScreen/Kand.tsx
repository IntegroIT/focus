import React, { useState, useCallback, useRef } from "react";

// Типы API
interface GenerateResponse {
  uuid: string;
}

interface StatusResponse {
  status: "INITIAL" | "PROCESSING" | "DONE" | "FAILED";
  images?: string[];
  error?: string;
}

const KandinskyImageGenerator: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const isMounted = useRef(true);

  const API_KEY = "08864ABB8F3FC4DD4448F60CD2E36246";
  const SECRET_KEY = "8C51579149AABF4AC78744F685C7FD22";
  const API_URL = "https://api.fusionbrain.ai/v1/text2image/run";
  const MODELS_URL = "https://api.fusionbrain.ai/v1/models";

  const generateImage = useCallback(async () => {
    if (!text.trim()) {
      setError("Введите текст для генерации изображения");
      return;
    }

    setLoading(true);
    setError("");
    setImageUrl("");

    try {
      console.log("Запрос списка моделей...");
      const modelsResponse = await fetch(MODELS_URL, {
        headers: {
          "X-Key": `Key ${API_KEY}`,
          "X-Secret": `Secret ${SECRET_KEY}`,
        },
      });

      if (!modelsResponse.ok) {
        const errorText = await modelsResponse.text();
        throw new Error(`Ошибка при получении списка моделей: ${errorText}`);
      }

      const modelsData = await modelsResponse.json();
      console.log("Полученные модели:", modelsData);
      const modelId = modelsData[0]?.id;
      if (!modelId) throw new Error("Не удалось получить model_id");

      console.log("Отправка запроса на генерацию изображения...");
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Key": `Key ${API_KEY}`,
          "X-Secret": `Secret ${SECRET_KEY}`,
        },
        body: JSON.stringify({
          model_id: modelId,
          params: {
            prompt: text,
            width: 512,
            height: 512,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Ошибка при отправке запроса на генерацию: ${errorText}`
        );
      }

      const data: GenerateResponse = await response.json();
      console.log("UUID задачи:", data.uuid);
      const { uuid } = data;

      let resultUrl = "";
      const maxAttempts = 10;
      const delay = 5000;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        console.log(`Попытка ${attempt + 1} проверки статуса...`);
        const statusResponse = await fetch(
          `https://api.fusionbrain.ai/v1/text2image/status/${uuid}`,
          {
            headers: {
              "X-Key": `Key ${API_KEY}`,
              "X-Secret": `Secret ${SECRET_KEY}`,
            },
          }
        );

        if (!statusResponse.ok) {
          const errorText = await statusResponse.text();
          throw new Error(`Ошибка при проверке статуса задачи: ${errorText}`);
        }

        const statusData: StatusResponse = await statusResponse.json();
        console.log("Статус ответа:", statusData);
        if (statusData.status === "DONE") {
          resultUrl = statusData.images?.[0] || "";
          break;
        } else if (statusData.status === "FAILED") {
          throw new Error("Ошибка при генерации изображения");
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      if (!resultUrl) {
        throw new Error("Превышено время ожидания генерации");
      }

      if (isMounted.current) {
        setImageUrl(resultUrl);
      }
    } catch (error) {
      console.error("Ошибка:", error);
      if (isMounted.current) {
        setError(
          error instanceof Error
            ? error.message
            : "Произошла неизвестная ошибка"
        );
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [text, API_KEY, SECRET_KEY]);

  return (
    <div>
      <h1>Генератор изображений Kandinsky</h1>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Введите текст для генерации изображения"
      />
      <button onClick={generateImage} disabled={loading}>
        {loading ? "Генерация..." : "Сгенерировать"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {imageUrl && (
        <div>
          <h2>Результат:</h2>
          <img
            src={imageUrl}
            alt="Generated from Kandinsky"
            style={{ maxWidth: "100%" }}
          />
        </div>
      )}
    </div>
  );
};

export default KandinskyImageGenerator;
