import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-8">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h1 className="card-title text-3xl">Vite + React + Tailwind + DaisyUI</h1>
          <p className="py-2">Tailwind และ DaisyUI พร้อมใช้งานแล้ว</p>
          <div className="card-actions flex gap-2 flex-wrap justify-center">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setCount((c) => c + 1)}
            >
              Count is {count}
            </button>
            <button type="button" className="btn btn-secondary">
              DaisyUI Button
            </button>
            <button type="button" className="btn btn-accent btn-outline">
              Outline
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
