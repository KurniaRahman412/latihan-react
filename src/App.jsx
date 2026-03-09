import { useEffect, useState } from "react"

function DisplayList({ data, setData, hapusTodo, tugasSelesai }) {
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
                  className="text-blue-600 bg-blue-50 px-3 py-1 rounded-md text-sm font-bold hover:bg-blue-300 transition-colors"
                  onClick={() => handleEdit(d)}
                > Edit </button>
                <button
                onClick={()=> tugasSelesai(d.id)}
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
        className="grow border border-gray-500 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
      <button
        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition-all"
        onClick={handleTambah}
      > Tambah </button>
    </div>
  )
}

function DisplaySelesai({todoSelesai, kembalikan, hapusSelesai}){
  return(
    <section className="my-4">
      
      <ul>
        {todoSelesai.map((s)=>(
          <li key={s.id} className="flex items-center justify-between bg-gray-300 p-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-gray-700 text-sm">{s.text}</span>
            <div className="flex justify-between gap-3">
              <button
              onClick={()=>kembalikan(s.id)}
              className="text-gray-600 px-3 py-1 rounded-md text-sm font-bold hover:text-green-600 hover:bg-green-300 transition-colors"
              >Kembalikan</button>
              <button
              onClick={()=>hapusSelesai(s.id)}
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
      { id: 1, text: "Sahur" },
      { id: 2, text: "Bukber" },
    ]
  })
  const [todoSelesai,setTodoSelesai] = useState(()=>{
    const saveTodo = localStorage.getItem("todo-selesai");
    if(saveTodo){
      return JSON.parse(saveTodo)
    }
    return []
  })

  useEffect( ()=>{
    localStorage.setItem("my-todolist", JSON.stringify(todo));
    localStorage.setItem("todo-selesai", JSON.stringify(todoSelesai))
  }, [todo, todoSelesai])

  
  const tambahTodo = (baru) => {
    setTodo([...todo, baru])
  }

  const hapusTodo = (id) => {
    setTodo(todo.filter((item) => item.id !== id))
  }
  const tugasSelesai = (id)=>{
    const pilih = todo.find(item => item.id === id)
    setTodoSelesai([...todoSelesai, pilih])
    hapusTodo(id)
  }
  const kembalikan = (id)=>{
    const pilih = todoSelesai.find(item => item.id === id)
    setTodo([...todo, pilih])
    setTodoSelesai(todoSelesai.filter(item => item.id !== id))
  }
  const hapusSelesai = (id)=>{
    setTodoSelesai(todoSelesai.filter(item => item.id !== id))
  }
  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-6 text-center border-b pb-4">
          📝 My To-Do List
        </h1>
        <DisplayList data={todo} setData={setTodo} hapusTodo={hapusTodo} tugasSelesai={tugasSelesai}/>
        <TambahList tambah={tambahTodo} />
        {todoSelesai.length !== 0 ? 
        (<h1 className="text-md font-extrabold text-gray-800 mt-20 text-center">
        ✅ To-Do Selesai
        </h1>
        ) : (<div></div>)}
        <DisplaySelesai todoSelesai={todoSelesai} kembalikan={kembalikan} hapusSelesai={hapusSelesai}/>
      </div>
    </div>
  )
}

export default App