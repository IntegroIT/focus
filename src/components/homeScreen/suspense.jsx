import React, { useState, useEffect } from "react";
import { Suspense } from "react";

function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.example.com/data");
        const data = await response.json();
        setData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Suspense fallback={<div>Загрузка...</div>}>
        <div>Данные загружаются...</div>
      </Suspense>
    );
  }

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.content}</p>
    </div>
  );
}

export default MyComponent;
