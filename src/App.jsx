import { useState } from "react"

function DisplayList({data, hapusTodo}){
  return(
    <>
      <ul className="space-y-2 w-fit">
        {data.map(d => (
          <li key={d.id}
          className="flex items-center justify-between px-4"
          >
          {d.text}
          <div>
            <button
            className="text-emerald-700 mx-2 p-1 font-bold cursor-pointer hover:underline"
            >
              Edit
            </button>
            <button
            onClick={()=> hapusTodo(d.id)}
            className="text-red-700 mx-2 p-1 font-bold cursor-pointer hover:underline"
            >Hapus</button>
          </div>
          </li>
        ))}
      </ul>
    </>
  )
}
function TambahList({tambah}){
  const [data, setData] = useState("")
  const handleTambah = ()=>{
    tambah({id: Date.now(), text: data})
    setData([])
  }
  return(
    <>
      <input
      type="text"
      value={data}
      onChange={(e)=> setData(e.target.value)}
      className="border"
      ></input>
      <button
      className="border"
      onClick={handleTambah}
      >Tambah</button>
    </>
  )
}

function App(){
  const [todo, setTodo] = useState([
    {id: 1, text: "Sahur"},
    {id: 2, text: "Bukber"},
  ])
  const tambahTodo = (baru) => {
    setTodo([...todo, baru])
  }
  const hapusTodo = (id) => {
    setTodo(todo.filter((t)=> t.id !== id))
  }
  return(
    <>
      <h1 className="text-3xl font-bold self-center">Aplikasi To Do List</h1>
      <DisplayList data={todo} hapusTodo={hapusTodo}/>
      <TambahList tambah={tambahTodo}/> 
    </>
  )
}
export default App