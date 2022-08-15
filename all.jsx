const { useState, useEffect } = React;

const root = ReactDOM.createRoot(document.getElementById('root'));

function App() {
  const [todoData, setTodoData] = useState([])
  const [tab, setTab] = useState('all')
  const [inputContent, setInputContent] = useState('')
  const notDone = todoData.filter(item => {
    return item.finish === false;
  })
  const postAddItem = () => {
    return new Promise((resolve, reject) => {
      resolve(axios.post('https://damp-stream-00143.herokuapp.com/todos', { title: inputContent }))
    })

  }
  const getTodo = () => {
    return new Promise((resolve, reject) => {
      resolve(axios.get('https://damp-stream-00143.herokuapp.com/todos'))

    })

  }
  // const patchFinshi = (id) => {
  //   return new Promise((resolve, reject) => {
  //     resolve(axios.patch('https://damp-stream-00143.herokuapp.com/todos/{id}'))
  //   })
  // }
  const handleDone = async (e) => {
    const id = e.target.dataset.num;

    axios.patch(`https://damp-stream-00143.herokuapp.com/todos/${id}`).then(res => {
      setTodoData(res.data.data);


    })

  }

  const handleDelete = async (e) => {
    const id = e.target.dataset.num;
    axios.delete(`https://damp-stream-00143.herokuapp.com/todos/${id}`).then(res => {
      setTodoData(res.data.data);
    })
  }

  const handleAddBtn = async () => {
    const rawtodoData = await postAddItem();
    const todoData = rawtodoData.data.data;
    setTodoData(todoData);
    setInputContent('')
  }

  const handleInputValue = (e) => {
    let { value } = e.target;
    setInputContent(value);
  }

  const handleFinishDelete = () => {
    const done = todoData.filter(item => { return item.finish == true })
    done.forEach(item => {
      axios.delete(`https://damp-stream-00143.herokuapp.com/todos/${item.id}`).then(res => {
        setTodoData(res.data.data)
      })
    })

  }
  const renderTodo = () => {
    let str = []
    if (tab == 'all') {
      str = todoData
    } else if (tab == 'done') {
      str = todoData.filter(item => item.finish == true)
    } else if (tab == 'notDone') {
      str = todoData.filter(item => item.finish == false)
    }
    return str.map((item) => {
      return (
        <li className="listli" style={item.finish ? { textDecoration: "line-through" } : null}>
          <input type="checkbox" name="" id="donebox" data-num={item.id} checked={item.finish} onClick={handleDone} />
          {item.title}
          <button className="vector" data-num={item.id} onClick={handleDelete} />
        </li>)
    })
  }
  const handleChangeTab = (e) => {
    setTab(e.target.dataset.tab)
  }
  // setAmountcompleted(todoData.length)
  useEffect(async () => {
    const rawtodoData = await getTodo();
    const todoData = rawtodoData.data.data;
    setTodoData(todoData)
  }, [])

  return (
    <div class="wrap">
      <div class="w-title ">
        <div class="c-title df fdr jcsb aic">
          <img src="src/img/logo_lg.svg" alt=""></img>
          <div class="c-logoout df  fdr jcsb aic">
            <h5 class="h5 login-name " id="login-name"></h5>
            <input type="button" value="登出" class="logooutbtn"></input>
          </div>
        </div>
      </div>

      <div class="w-todo df fdc ma ">
        <div class="c-input">
          <input type="text" value={inputContent} class="list-input" id="ListInput" onChange={handleInputValue}></input>
          <input type="button" value="" class="list-add" id="ListAdd" onClick={handleAddBtn}></input>
        </div>
        <div class="c-list df fdc">
          <ul class="c-listtitle df fdr" onClick={handleChangeTab}>
            <li class="titletext df aic jcc " id="listAll" data-tab='all' >全部</li>
            <li class="titletext df aic jcc" id="listTodo" data-tab='notDone'>待完成</li>
            <li class="titletext df aic jcc" id="listFinsh" data-tab='done'>已完成</li>
          </ul>

          <div class="c-listcontent ma">
            <ul class="listul">
              {renderTodo()}
            </ul>
            <div class="c-text df jcsb fdr aic">
              <span class="todonum">{notDone.length}個代辦事項</span>
              <button class="cleanfinishbtn" onClick={handleFinishDelete}>清除已完成項目</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

root.render(<App />);