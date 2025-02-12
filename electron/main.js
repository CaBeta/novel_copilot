import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 初始化OpenAI客户端
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL:
    process.env.OPENAI_BASE_URL || "https://api.lkeap.cloud.tencent.com/v1",
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // 在开发环境中加载 Vite 开发服务器
  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    // 在生产环境中加载打包后的文件
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  // 监听渲染进程发送的请求，处理接口调用
  ipcMain.handle("completion", async (event, params) => {
    console.log(params);
    try {
      // 调用AI能力
      const completion = await client.chat.completions.create(params);
      return completion.choices[0].message.content;
    } catch (error) {
      console.error("API 调用失败:", error);
      throw new Error("API 调用失败");
    }
  });

  ipcMain.handle("stream", async (event, params) => {
    console.log(params);
    try {
      const chatCompletion = await client.chat.completions.create(params);
      for await (const chunk of chatCompletion) {
        // 每个 chunk 都是一个流式响应
        if (chunk.choices[0].delta.reasoning_content) {
          // 如果有思维链内容
          event.sender.send("stream-chunk", {
            reasoning_content: chunk.choices[0].delta.reasoning_content,
          });
        }

        if (chunk.choices[0].delta.content) {
          // 如果有最终内容
          if (
            chunk.choices[0].delta.content &&
            chunk.choices[0].delta.content.length !== 0
          ) {
            event.sender.send("stream-chunk", {
              content: chunk.choices[0].delta.content,
            });
          }
        }
      }
    } catch (error) {
      console.error("API 调用失败:", error);
      throw new Error("API 调用失败");
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
