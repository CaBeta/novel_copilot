import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Novel Copilot</h1>
      <div className="space-y-4">
        <div className="flex space-x-4">
          <Button>默认按钮</Button>
          <Button variant="secondary">次要按钮</Button>
          <Button variant="destructive">危险按钮</Button>
          <Button variant="outline">轮廓按钮</Button>
          <Button variant="ghost">幽灵按钮</Button>
          <Button variant="link">链接按钮</Button>
        </div>
        <div className="flex space-x-4">
          <Button size="sm">小按钮</Button>
          <Button>默认大小</Button>
          <Button size="lg">大按钮</Button>
        </div>
      </div>
    </div>
  )
}

export default App
