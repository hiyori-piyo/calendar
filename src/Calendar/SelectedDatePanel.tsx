
import { ChangeEvent } from "./event"


const SelectedDatePanel=(props:{ event:ChangeEvent,allEvent:ChangeEvent[],open:boolean,onButton:(id:string)=>void,onClose:()=>void})=>{

    // const mile=props.event.extendedProps?.milestones
    const event=props.event.extendedProps

  if (!props.open || !event) {
    return null
  }
  
  const myMilestones = props.allEvent.filter(ev => 
    ev.extendedProps?.type === "mile" && ev.extendedProps?.parentID === props.event.id
  );

  if (event.type==="mile") {


      return(
        <div className={`detail-panel ${props.open ? "open" : ""}`}>

            <div>
                <span>タスク：{props.event.title}</span> <br />
                <span>達成した<input type="radio" name="" id="" onClick={()=>props.onButton(props.event.id)}/></span> 
                
                
                <input type="button" value="閉じる" onClick={()=>props.onClose()}/>

            </div>

        </div>
        )
      
    } else if(event.type==="main"){

    

        return(

          <div className={`detail-panel ${props.open ? "open" : ""}`}>

            <div>
                <span>タスク：{props.event.title}</span> <br />
                <span>詳細：{props.event.extendedProps?.detail}</span> <br />
                
                <p>中間目標</p>
                <div>
                    
                    {myMilestones.length > 0 ? (
                        myMilestones.map((m, index) => {
                          const dateString = m.start ? new Date(m.start).toLocaleDateString("ja-JP") : "日付なし";
                          return (
                          
                          <div key={m.id}
                              style={{ 
                              // 済になった中間タスクに横線を引く
                              textDecoration: m.extendedProps?.isComplete ? "line-through" : "none",
                              color: m.extendedProps?.isComplete ? "#888" : "inherit",
                              marginBottom: "5px"
                            }}>
                          
                            <span>{m.title}：{dateString.toString()}まで　</span>
                            <span>{m.extendedProps?.isComplete ? "完了しました":""}</span>
                          </div>
                        )})
                    ) : (<p></p>
                    )}
                    
                    
                 
                </div>
    

            </div>
            </div>
        )
        
    } else {
      return null
    }

} 


export default SelectedDatePanel







