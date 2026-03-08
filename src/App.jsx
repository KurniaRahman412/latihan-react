import { useEffect, useState } from "react"

function DisplayList({ data, setData, hapusTodo }) {
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState('')

  const handleEdit = (todo) => {
    setEditId(todo.id)
    setEditText(todo.text)
  }

  const batal = () => {
    setEditId(null)
    setEditText('')
  }

  const simpan = (id) => {
    const updateTodo = data.map((item) => {
      if (item.id === id) {
        return { ...item, text: editText }
      }
      return item
    })
    setData(updateTodo)
    setEditId(null)
  }

  return (
    <ul className="w-full space-y-3">
      {data.map(d => (
        <li key={d.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          {editId === d.id ? (
            <div className="flex w-full gap-2">
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="grow border-2 border-blue-400 rounded px-2 py-1 outline-none"
                autoFocus
              />
              <button onClick={() => simpan(editId)} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-blue-700">Simpan</button>
              <button onClick={batal} className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm font-semibold hover:bg-gray-400">Batal</button>
            </div>
          ) : (
            <>
              <span className="text-gray-700 font-medium">{d.text}</span>
              <div className="flex gap-2">
                <button
                  className="text-blue-600 bg-blue-50 px-3 py-1 rounded-md text-sm font-bold hover:bg-blue-100 transition-colors"
                  onClick={() => handleEdit(d)}
                > Edit </button>
                <button
                  onClick={() => hapusTodo(d.id)}
                  className="text-red-600 bg-red-50 px-3 py-1 rounded-md text-sm font-bold hover:bg-red-100 transition-colors"
                > Hapus </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  )
}

function TambahList({ tambah }) {
  const [data, setData] = useState("")

  const handleTambah = () => {
    if (!data.trim()) return // Mencegah input kosong
    tambah({ id: Date.now(), text: data })
    setData("")
  }

  return (
    <div className="flex gap-2 mt-6">
      <input
        type="text"
        placeholder="Tambah tugas baru..."
        value={data}
        onChange={(e) => setData(e.target.value)}
        className="grow border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
      <button
        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition-all"
        onClick={handleTambah}
      > Tambah </button>
    </div>
  )
}

function App() {
  const [todo, setTodo] = useState(()=>{
    const saveTodo = localStorage.getItem("my-todolist");
    if(saveTodo){
      return JSON.parse(saveTodo)
    }
    return [
      { id: 1, text: "Sahur" },
      { id: 2, text: "Bukber" },
    ]
  })

  useEffect( ()=>{
    localStorage.setItem("my-todolist", JSON.stringify(todo))
  }, [todo])
  const tambahTodo = (baru) => {
    setTodo([...todo, baru])
  }

  const hapusTodo = (id) => {
    setTodo(todo.filter((t) => t.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-6 text-center border-b pb-4">
          📝 My To-Do List
        </h1>
        <DisplayList data={todo} setData={setTodo} hapusTodo={hapusTodo} />
        <TambahList tambah={tambahTodo} />
      </div>
    </div>
  )
}

export default App