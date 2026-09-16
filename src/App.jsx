import AddTodo from './components/AddTodo.jsx'
import TodoItem from './components/TodoItem.jsx'
import TodoList from './components/TodoList.jsx'
import ListSidebar from './components/ListSidebar.jsx'
import FilterBar from './components/FilterBar.jsx'
import StatsBar from './components/StatsBar.jsx'
import ConfirmModal from './components/ConfirmModal.jsx'
import Toaster from './components/Toaster.jsx'

function App() {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <header className="navbar bg-base-100 shadow-sm px-4">
        <h1 className="flex-1 text-xl font-bold">Todolist 555555555</h1>
        <button
          type="button"
          className="btn btn-ghost min-h-10 min-w-10"
          aria-label="Toggle theme (coming soon)"
        >
          Theme
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 md:flex-row">
        <aside className="card w-full shrink-0 bg-base-100 shadow md:w-64">
          <div className="card-body">
            <h2 className="card-title text-base">Lists</h2>
            <p className="text-sm opacity-70">Sidebar coming soon</p>
            <ListSidebar />
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="card bg-base-100 shadow">
            <div className="card-body gap-4">
              <p className="text-sm opacity-70">Add bar coming soon</p>
              <AddTodo />
              <FilterBar />
              <StatsBar />
              <TodoList />
              <TodoItem />
            </div>
          </div>
        </main>
      </div>

      <ConfirmModal />
      <Toaster />
    </div>
  )
}

export default App
