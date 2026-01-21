
import { ChangeEvent } from "./event"


const SelectedDatePanel=(props:{ event:ChangeEvent,allEvent:ChangeEvent[],open:boolean,onButton:(id:string)=>void,onClose:()=>void})=>{


    const event=props.event.extendedProps

    // 詳細ウィンドウの状態がfalseのとき、もしくは受け取るデータが空っぽならそのまま閉じる
  if (!props.open || !event) {
    return null
  }
  
  // 親（メインタスク）のIDと一致するIDを中間目標の配列の中から探し、定数に入れる
  const myMilestones = props.allEvent.filter(ev => 
    ev.extendedProps?.type === "mile" && ev.extendedProps?.parentID === props.event.id
  );

  // イベントがメインタスクか中間目標かを判断しそれぞれで処理を分ける
  if (event.type==="mile") {

      return(
        <div className={`detail-panel ${props.open ? "open" : ""}`}>

            <div>
                <span>タスク：{props.event.title}</span> <br />

                {/* ここでクリックすると完了済になった中間目標のIDが親へと渡される */}
                <span>達成した<input type="radio" name="" id="" onClick={()=>props.onButton(props.event.id)}/></span> 
                
                
                <input type="button" value="閉じる" className="btn-close" onClick={()=>props.onClose()}/>

            </div>

        </div>
        )
      
    } else if(event.type==="main"){

    

        return(

          <div className={`detail-panel ${props.open ? "open" : ""}`}>

            <div>
                <span>タスク：{props.event.title}</span> <br />
                <span>詳細：{props.event.extendedProps?.detail ? props.event.extendedProps?.detail : "なし"}</span> <br />
                
                <p>中間目標</p>
                <div>
                    
                    {myMilestones.length > 0 ? (
                        myMilestones.map((m, index) => {

                          // 日付をyyyy-mm-ddにする
                          const dateString = m.start ? new Date(m.start).toLocaleDateString("ja-JP") : "";
                          
                          return (
                          
                          <div key={m.id}
                              style={{ 
                              // 完了済になった中間タスクに横線を引く
                              textDecoration: m.extendedProps?.isComplete ? "line-through" : "none",
                              color: m.extendedProps?.isComplete ? "#888" : "inherit",
                              marginBottom: "5px"
                            }}>
                          
                            <span>{m.title}：{dateString.toString()}まで　</span>

                            {/* 完了済みになってたら完了しましたと出す */}
                            <span>{m.extendedProps?.isComplete ? "完了しました":""}</span> <br />
                          </div>
                          
                        )})
                      ) : (<p></p>
                      )}
                    
                    
                 
                      <input type="button" value="閉じる" className="btn-close" onClick={()=>props.onClose()}/>
                </div>
    

            </div>
            </div>
        )
        
    } else {
      return null
    }

} 


export default SelectedDatePanel







