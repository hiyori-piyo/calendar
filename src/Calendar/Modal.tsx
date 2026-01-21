import { MileStones } from "./event";
import { useState } from "react";
import { Event } from "./event";
import { useEffect } from "react";



const Modal = (props: { modalstate: Event ,onSave:(taskTitle:string,taskTime:string,milestone:MileStones[],taskColor:string,taskDetail:string)=>void,onClose:()=>void}) => {

//   表示中か非表示中か
  const state = props.modalstate;

//   モーダルで中間目標追加した情報格納する配列
  const [milestones, setMilestones] = useState<MileStones[]>([
    { text: "", date: "" },
  ]);

//   モーダル閉じたら概要やタスク名も空白に戻す
  useEffect(()=>{

    if (state==='display') {
      setTaskTitle("")
      setTaskTime("")
      setMilestones([{text:"",date:""}])
      setTaskDetail("")
    }
  },[state])

  // 　中間目標の欄を追加する
  const addMilestones = () => {
    setMilestones([...milestones, { text: "", date: "" }]);
  };

  // 　中間目標の欄を削除する
  const miledelete=(index:number)=>{

    setMilestones(milestones.filter((_,i)=>i !== index))
  }


  const [taskTitle,setTaskTitle]=useState("")
  const [taskTime,setTaskTime]=useState("")
  const [taskColor,setTaskColor]=useState("#3788d8")
  const [taskDetail,setTaskDetail]=useState("")

  if (state === "display") {
    return (
        <div className="modal-overlay" >
          <div className="modal-content" >

            <h2 className="modal-title">イベント追加</h2>
            <div className="input-row">

            {/* メインタスク */}
            <div className="input-group text-long">
              <label className="input-label">タスク</label>
                <input type="text" placeholder="例：Reactの勉強" className="input-field" 
                value={taskTitle}
                onChange={(e)=>setTaskTitle(e.target.value)}/>
            </div>

            

          {/* 締め切り時間 */}
            <div className="input-group">
              <label className="input-label">締切時間</label>
                <input type="time" name="" id="" className="input-field" 
                value={taskTime}
                onChange={(e)=>setTaskTime(e.target.value)}/>
            </div>
            </div>

          {/* 色の指定 */}
            <div className="input-group">
                <input type="color" name="" id="" 
                value={taskColor}
                style={{cursor:'pointer'}}
                onChange={(e)=>{

                    setTaskColor(e.target.value)
                }}/>
            </div>

            {/* 詳細 */}
            <div className="input-group text-long">
              <label className="input-label">詳細</label>
                <input type="text" placeholder="" className="input-field" 
                value={taskDetail}
                onChange={(e)=>setTaskDetail(e.target.value)}/>
            </div>

            {/* 中間目標 */}
               <div style={{ marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "10px" }}>
                <div className="flex-between">
                  <span>目標</span>
                  <input type="button" value="＋目標を追加" onClick={addMilestones} />

                </div>

            {/* 中間目標増やす */}
                <div className="milestone-list">
                  {milestones.map((miletone,index) => {
                    return (
                      <div className="input-row">
                        <div className="input-group text-long-l">
                          <input type="text" value={miletone.text} className="input-field" style={{ flex: 2 }}
                          onChange={(e)=>{
                            const newmile=[...milestones]
                            newmile[index]={...newmile[index],text:e.target.value}
                            setMilestones(newmile);
                          }}/>
                        </div>
                        <div className="input-group date-short">
                          <input type="date" name="" id="" value={miletone.date} className="input-field" style={{ flex: 1.5 }}
                          onChange={(e)=>{
                            const newmile=[...milestones]
                            newmile[index]={...newmile[index],date:e.target.value}
                            setMilestones(newmile);
                            
                          }}/>
                        </div>
                        <input type="button" value="削除" className="btn-delete" onClick={()=>miledelete(index)}/>


                      </div>
                    );
                  })}

                </div>
              </div>


            {/* イベント追加ボタン */}
            <button className="btn btn-primary" onClick={()=>props.onSave(taskTitle,taskTime,milestones,taskColor,taskDetail)}　disabled={!taskTitle.trim()}>イベントを追加</button>

            {/* キャンセルボタン */}
            <button onClick={() => props.onClose()} className="btn btn-secondary">キャンセル</button>
      </div>
      </div>

    );
  } else {
    return null;
  }
};

export default Modal;