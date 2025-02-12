import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
function App() {
  const [data, setData] = useState<string | undefined>(undefined);

  useEffect(() => {
    let text = "";
    // 接收流式数据并显示
    window.novelCopilotAPI.on("stream-chunk", (_, data) => {
      if (data.reasoning_content) {
        // 处理思维链内容
        text += data.reasoning_content;
        setData(text);
      }

      if (data.content) {
        // 处理最终返回的内容
        text += data.content;
        setData(text);
      }
    });
  }, []);

  const testAPI = () => {
    fetchData("你好 你能给我写首诗吗").then((data) => {
      setData(data);
    });
  };

  const testStream = () => {
    streamData("你好 你能给我写首诗吗");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Novel Copilot</h1>
      <div className="space-y-4">
        <div className="flex space-x-4">
          <Button onClick={() => testAPI()}>测试API</Button>
          <Button onClick={() => testStream()}>测试流式</Button>
        </div>
        <Markdown>{data}</Markdown>
      </div>
    </div>
  );
}

export default App;

async function fetchData(message: string) {
  try {
    const data = await window.novelCopilotAPI.completion({
      model: "deepseek-v3",
      messages: [{ role: "user", content: message }],
    });
    console.log("Received API data:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

async function streamData(message: string) {
  window.novelCopilotAPI.stream({
    model: "deepseek-v3",
    messages: [{ role: "user", content: message }],
    stream: true,
  });
}
