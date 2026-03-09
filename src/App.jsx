import { useEffect, useState } from "react"

function DisplayList({ data, hapusTodo, toggleStatus, updateTodo }) {
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
  const simpan = (id)=>{
    updateTodo(id, editText)
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
              <button onClick={() => simpan(d.id)} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-blue-700">Simpan</button>
              <button onClick={batal} className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm font-semibold hover:bg-gray-400">Batal</button>
            </div>
          ) : (
            <>
              <span className="text-gray-700 font-medium">{d.text}</span>
              <div className="flex gap-2">
                <button
                  className="text-blue-600 bg-blue-50 px-3 py-1 rounded-md text-sm font-bold hover:bg-blue-300 transition-colors"
                  onClick={() => handleEdit(d)}
                > Edit </button>
                <button
                onClick={()=> toggleStatus(d.id)}
                className="text-green-600 bg-red-50 px-3 py-1 rounded-md text-sm font-bold hover:bg-green-300 transition-colors"
                >Selesai</button>
                <button
                  onClick={() => hapusTodo(d.id)}
                  className="text-red-600 bg-red-50 px-3 py-1 rounded-md text-sm font-bold hover:bg-red-300 transition-colors"
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
    tambah({ id: Date.now(), text: data, isCompleted: false })
    setData("")
  }

  return (
    <div className="flex gap-2 mt-6">
      <input
        type="text"
        placeholder="Tambah tugas baru..."
        value={data}
        onChange={(e) => setData(e.target.value)}
        className="grow border border-gray-500 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
      <button
        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition-all"
        onClick={handleTambah}
      > Tambah </button>
    </div>
  )
}

function DisplaySelesai({ data, toggleStatus, hapusTodo}){
  return(
    <section className="my-4">  
      <ul>
        {data.map((s)=>(
          <li key={s.id} className="flex items-center justify-between bg-gray-300 p-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-gray-700 text-sm">{s.text}</span>
            <div className="flex justify-between gap-3">
              <button
              onClick={()=>toggleStatus(s.id)}
              className="text-gray-600 px-3 py-1 rounded-md text-sm font-bold hover:text-green-600 hover:bg-green-300 transition-colors"
              >Kembalikan</button>
              <button
              onClick={()=>hapusTodo(s.id)}
              className="text-white bg-gray-400 px-3 py-1 rounded-md text-sm font-bold hover:bg-gray-700 transition-colors"
              >Hapus</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function App() {
  const [todo, setTodo] = useState(()=>{
    const saveTodo = localStorage.getItem("my-todolist");
    if(saveTodo){
      return JSON.parse(saveTodo)
    }
    return [
      { id: 1, text: "Sahur", isCompleted: false },
      { id: 2, text: "Bukber", isCompleted: false },
    ]
  })
  const activeTodo = todo.filter(t => !t.isCompleted)
  const completedTodo = todo.filter(t => t.isCompleted)
  useEffect( ()=>{
    localStorage.setItem("my-todolist", JSON.stringify(todo));
  }, [todo])

  
  const tambahTodo = (baru) => {
    setTodo([...todo, baru])
  }

  const updateTodo = (id, text) => {
    const updateTodo = todo.map((item) => {
      if (item.id === id) {
        return { ...item, text: text }
      }
      return item
    })
    setTodo(updateTodo)
  }

  const hapusTodo = (id) => {
    setTodo(todo.filter((item) => item.id !== id))
  }
  const toggleStatus = (id)=>{
    const update = todo.map(item => item.id === id ? {...item, isCompleted:!item.isCompleted}: item)
    setTodo(update)
  }

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-6 text-center border-b pb-4">
          📝 My To-Do List
        </h1>
        <DisplayList data={activeTodo} hapusTodo={hapusTodo} toggleStatus={toggleStatus} updateTodo={updateTodo}/>
        <TambahList tambah={tambahTodo} />
        {todo.some(item => item.isCompleted) && (
          <h2 className="text-xl font-extrabold text-gray-800 my-6 text-center">✅ To-Do Selesai</h2>
        )}
        <DisplaySelesai data={completedTodo} toggleStatus={toggleStatus} hapusTodo={hapusTodo}/>
      </div>
    </div>
  )
}

export default App